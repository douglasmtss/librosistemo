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
        get: async (): Promise<T[]> => (await ax.get<T[]>(url)).data,
        post: (data: T): Promise<AxiosResponse> => ax.post(url, JSON.stringify(data), jsonHeaders),
        put: (id: string, data: T): Promise<AxiosResponse> =>
            ax.put(`${url}&id=${id}`, JSON.stringify(data), jsonHeaders),
        delete: (id: string): Promise<AxiosResponse> => ax.delete(`${url}&id=${id}`)
    }
}

export const api = {
    auth: {
        post: async (auth: { username: string; password: string }): Promise<AxiosResponse> => {
            const response = await ax.post<AxiosResponse>('/api/auth', JSON.stringify(auth), {
                ...jsonHeaders,
                // 401 é resposta esperada (credenciais erradas), não erro de rede
                validateStatus: status => status < 500
            })

            if (response?.data?.status !== 200) {
                response.status = 401
            }

            return response
        },
        logout: async (): Promise<AxiosResponse> => {
            return ax.delete('/api/auth')
        }
    },
    sheet: {
        books: createEntityCrud<Book>(Entity.books),
        users: createEntityCrud<User>(Entity.users),
        lends: createEntityCrud<Lend>(Entity.lends)
    }
}
