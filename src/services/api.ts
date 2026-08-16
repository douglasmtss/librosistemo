import { Entity } from '@/enums/entities'
import axios, { AxiosResponse } from 'axios'

const ax = axios.create({
    baseURL: process.env.BASE_URL
})

// Pausa entre lotes de consultas de ISBN para respeitar o rate limit da BrasilAPI.
export const ISBN_LOOKUP_DELAY_MS = 60000

export const entities_url = '/api/entities'

const jsonHeaders = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const services = {
    brasilapi: async (isbn: string): Promise<BrasilapiBook> => {
        const response = await ax.get(`https://brasilapi.com.br/api/isbn/v1/${isbn}`)

        return response?.data
    }
}

type EntityCrud<T> = {
    get: () => Promise<T[]>
    post: (data: T) => Promise<AxiosResponse>
    put: (id: string, data: T) => Promise<AxiosResponse>
    delete: (id: string) => Promise<AxiosResponse>
}

const createEntityCrud = <T>(entity: Entity): EntityCrud<T> => {
    const url = `${entities_url}?entity=${entity}`

    return {
        get: async (): Promise<T[]> => {
            const response = await ax
                .get<T[]>(url)
                .then(res => res.data)
                .catch(error => {
                    console.error(`[api] - Erro ao buscar ${entity}:`, error)
                })

            return response as unknown as Promise<T[]>
        },
        post: async (data: T): Promise<AxiosResponse> => {
            const response = await ax.post(url, JSON.stringify(data), jsonHeaders).catch(error => {
                console.error(`[api] - Erro ao criar ${entity}:`, error)
            })

            return response as AxiosResponse
        },
        put: async (id: string, data: T): Promise<AxiosResponse> => {
            const response = await ax.put(`${url}&id=${id}`, JSON.stringify(data), jsonHeaders).catch(error => {
                console.error(`[api] - Erro ao atualizar ${entity} ${id}:`, error)
            })

            return response as AxiosResponse
        },
        delete: async (id: string): Promise<AxiosResponse> => {
            const response = await ax.delete(`${url}&id=${id}`).catch(error => {
                console.error(`[api] - Erro ao excluir ${entity} ${id}:`, error)
            })

            return response as AxiosResponse
        }
    }
}

export const api = {
    auth: {
        post: async (auth: { username: string; password: string }): Promise<AxiosResponse> => {
            const response = await ax
                .post<AxiosResponse>('/api/auth', JSON.stringify(auth), jsonHeaders)
                .then(res => {
                    if (res?.data?.status === 200) {
                        return res
                    } else {
                        res.status = 401

                        return res
                    }
                })
                .catch(error => {
                    console.error('[api] - Erro no login:', error)
                })

            return response as AxiosResponse
        },
        logout: async (): Promise<AxiosResponse> => {
            const response = await ax.delete('/api/auth').catch(error => {
                console.error('[api] - Erro no logout:', error)
            })

            return response as AxiosResponse
        }
    },
    sheet: {
        books: createEntityCrud<Book>(Entity.books),
        users: createEntityCrud<User>(Entity.users),
        lends: createEntityCrud<Lend>(Entity.lends)
    }
}
