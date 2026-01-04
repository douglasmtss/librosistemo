import { Sheet } from '@/enums/sheets'
import { SpreadsheetResponse } from '@/types/spreadsheet'
import axios, { AxiosResponse } from 'axios'
const ax = axios.create({
    baseURL: process.env.BASE_URL
})

export const GOOGLE_API_LIMIT = 60000

export const spreadsheet_url = '/api/spreadsheet'

const spreadsheet_url_sheet = {
    books: `${spreadsheet_url}?sheet=${Sheet.books}`,
    users: `${spreadsheet_url}?sheet=${Sheet.users}`,
    lends: `${spreadsheet_url}?sheet=${Sheet.lends}`
}

export const services = {
    google: async (isbn: string): Promise<AxiosResponse> => {
        const response = await ax.get(`https://www.googleapis.com/books/v1/volumes?q=${isbn}`)

        return response
    },
    brasilapi: async (isbn: string): Promise<BrasilapiBook> => {
        const response = await ax.get(`https://brasilapi.com.br/api/isbn/v1/${isbn}`)

        return response?.data
    }
}

export const api = {
    auth: {
        post: async (auth: { username: string; password: string }): Promise<AxiosResponse> => {
            const response = await ax
                .post<AxiosResponse>('/api/auth', JSON.stringify(auth), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    if (res?.data?.status === 200) {
                        return res
                    } else {
                        res.status = 401

                        return res
                    }
                })
                .catch(error => {
                    console.error('[Sheet] - Error login:', error)
                })

            return response as AxiosResponse
        }
    },
    sheet: {
        books: {
            get: async (): Promise<Book[]> => {
                const response = await ax
                    .get<SpreadsheetResponse>(spreadsheet_url_sheet.books)
                    .then(res => {
                        return res.data as unknown as Book[]
                    })
                    .catch(error => {
                        console.error('[Sheet] - Error fetching books:', error)
                    })

                return response as unknown as Promise<Book[]>
            },
            post: async (book: Book): Promise<AxiosResponse> => {
                const response = await ax
                    .post<SpreadsheetResponse>(spreadsheet_url_sheet.books, JSON.stringify(book), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => {
                        return res
                    })
                    .catch(error => {
                        console.error('[Sheet] - Error fetching books:', error)
                    })

                return response as AxiosResponse
            },
            delete: async (id: string): Promise<AxiosResponse> => {
                const response = await ax.delete(`${spreadsheet_url_sheet.books}&id=${id}`).catch(error => {
                    console.error(`[Sheet] - Error deleting id ${id}:`, error)
                })

                return response as AxiosResponse
            },
            put: async (id: string, book: Book): Promise<AxiosResponse> => {
                const response = await ax
                    .put(`${spreadsheet_url_sheet.books}&id=${id}`, JSON.stringify(book), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .catch(error => {
                        console.error(`[Sheet] - Error update book:`, error)
                    })

                return response as AxiosResponse
            }
        },
        users: {
            get: async (): Promise<User[]> => {
                const response = await ax
                    .get<SpreadsheetResponse>(spreadsheet_url_sheet.users)
                    .then(res => {
                        return res.data as unknown as User[]
                    })
                    .catch(error => {
                        console.error('[Sheet] - Error fetching Users:', error)
                    })

                return response as unknown as Promise<User[]>
            },
            post: async (user: User): Promise<AxiosResponse> => {
                const response = await ax
                    .post<SpreadsheetResponse>(spreadsheet_url_sheet.users, JSON.stringify(user), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => {
                        return res
                    })
                    .catch(error => {
                        console.error('[Sheet] - Error fetching users:', error)
                    })

                return response as AxiosResponse
            },
            delete: async (id: string): Promise<AxiosResponse> => {
                const response = await ax.delete(`${spreadsheet_url_sheet.users}&id=${id}`).catch(error => {
                    console.error(`[Sheet] - Error deleting id ${id}:`, error)
                })

                return response as AxiosResponse
            },
            put: async (id: string, user: User): Promise<AxiosResponse> => {
                const response = await ax
                    .put(`${spreadsheet_url_sheet.users}&id=${id}`, JSON.stringify(user), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .catch(error => {
                        console.error(`[Sheet] - Error update user:`, error)
                    })

                return response as AxiosResponse
            }
        },
        lends: {
            get: async (): Promise<Lend[]> => {
                const response = await ax
                    .get<SpreadsheetResponse>(spreadsheet_url_sheet.lends)
                    .then(res => {
                        return res.data as unknown as Lend[]
                    })
                    .catch(error => {
                        console.error('[Sheet] - Error fetching lends:', error)
                    })

                return response as unknown as Promise<Lend[]>
            },
            post: async (lend: Lend): Promise<AxiosResponse> => {
                const response = await ax
                    .post<SpreadsheetResponse>(spreadsheet_url_sheet.lends, JSON.stringify(lend), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => {
                        return res
                    })
                    .catch(error => {
                        console.error('[Sheet] - Error fetching lend:', error)
                    })

                return response as AxiosResponse
            },
            delete: async (id: string): Promise<AxiosResponse> => {
                const response = await ax.delete(`${spreadsheet_url_sheet.lends}&id=${id}`).catch(error => {
                    console.error(`[Sheet] - Error deleting id ${id}:`, error)
                })

                return response as AxiosResponse
            },
            put: async (id: string, lend: Lend): Promise<AxiosResponse> => {
                const response = await ax
                    .put(`${spreadsheet_url_sheet.lends}&id=${id}`, JSON.stringify(lend), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .catch(error => {
                        console.error(`[Sheet] - Error update lend:`, error)
                    })

                return response as AxiosResponse
            }
        }
    }
}
