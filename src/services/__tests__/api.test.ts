import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { Sheet } from '@/enums/sheets'

type AxiosMethodMock = jest.Mock<Promise<unknown>, unknown[]>

interface AxiosInstanceMock {
    get: AxiosMethodMock
    post: AxiosMethodMock
    put: AxiosMethodMock
    delete: AxiosMethodMock
}

function buildAxiosInstance(): AxiosInstanceMock {
    return {
        get: jest.fn<Promise<unknown>, unknown[]>(),
        post: jest.fn<Promise<unknown>, unknown[]>(),
        put: jest.fn<Promise<unknown>, unknown[]>(),
        delete: jest.fn<Promise<unknown>, unknown[]>()
    }
}

jest.mock('axios', () => {
    const instance = buildAxiosInstance()
    const create = jest.fn(() => instance)

    return {
        __esModule: true,
        default: { create },
        create,
        __instance: instance
    }
})

const axiosMockModule = jest.requireMock('axios') as { __instance: AxiosInstanceMock }

import { services, api, GOOGLE_API_LIMIT, spreadsheet_url } from '../api'

const createAxiosResponse = <T>(data: T, overrides?: Partial<AxiosResponse<T>>): AxiosResponse<T> => ({
    data,
    status: overrides?.status ?? 200,
    statusText: overrides?.statusText ?? 'OK',
    headers: overrides?.headers ?? {},
    config: (overrides?.config as InternalAxiosRequestConfig<T>) ?? ({} as InternalAxiosRequestConfig<T>)
})

describe('services/api', (): void => {
    let consoleErrorSpy: jest.SpyInstance<void, Parameters<typeof console.error>>
    let consoleLogSpy: jest.SpyInstance<void, Parameters<typeof console.log>>
    let axiosInstance: AxiosInstanceMock

    beforeEach((): void => {
        axiosInstance = axiosMockModule.__instance
        axiosInstance.get.mockReset()
        axiosInstance.post.mockReset()
        axiosInstance.put.mockReset()
        axiosInstance.delete.mockReset()

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((): void => {})
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation((): void => {})
    })

    afterEach((): void => {
        consoleErrorSpy.mockRestore()
        consoleLogSpy.mockRestore()
        jest.clearAllMocks()
    })

    describe('constants', (): void => {
        test('should expose GOOGLE_API_LIMIT constant', (): void => {
            expect(GOOGLE_API_LIMIT).toBe(60000)
        })

        test('should expose spreadsheet_url constant', (): void => {
            expect(spreadsheet_url).toBe('/api/spreadsheet')
        })
    })

    describe('services.google', (): void => {
        test('should fetch google books using provided ISBN', async (): Promise<void> => {
            const response = createAxiosResponse({ items: [{ id: '1' }] })
            axiosInstance.get.mockResolvedValueOnce(response)

            const result = await services.google('9781234567890')

            expect(axiosInstance.get).toHaveBeenCalledWith(
                'https://www.googleapis.com/books/v1/volumes?q=9781234567890'
            )
            expect(result).toBe(response)
        })

        test('should propagate error when google books request fails', async (): Promise<void> => {
            const error = new Error('network issue')
            axiosInstance.get.mockRejectedValueOnce(error)

            await expect(services.google('invalid')).rejects.toThrow(error)
        })
    })

    describe('services.brasilapi', (): void => {
        test('should fetch brasil api book info and return data payload', async (): Promise<void> => {
            const payload = { isbn: '978', title: 'Example' }
            const response = createAxiosResponse(payload)
            axiosInstance.get.mockResolvedValueOnce(response)

            const result = await services.brasilapi('978')

            expect(axiosInstance.get).toHaveBeenCalledWith('https://brasilapi.com.br/api/isbn/v1/978')
            expect(result).toEqual(payload)
        })

        test('should resolve with undefined when brasil api returns no data', async (): Promise<void> => {
            const response = createAxiosResponse<undefined>(undefined)
            axiosInstance.get.mockResolvedValueOnce(response)

            const result = await services.brasilapi('978')

            expect(result).toBeUndefined()
        })

        test('should propagate error when brasil api request fails', async (): Promise<void> => {
            const error = new Error('timeout')
            axiosInstance.get.mockRejectedValueOnce(error)

            await expect(services.brasilapi('timeout')).rejects.toThrow(error)
        })
    })

    describe('api.auth.post', (): void => {
        const credentials = { username: 'user', password: 'pass' }

        test('should post credentials and return axios response when status is 200', async (): Promise<void> => {
            const response = createAxiosResponse({ status: 200, token: 'jwt' })
            axiosInstance.post.mockResolvedValueOnce(response)

            const result = await api.auth.post(credentials)

            expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth', JSON.stringify(credentials), {
                headers: { 'Content-Type': 'application/json' }
            })
            expect(result).toBe(response)
        })

        test('should force status 401 when spreadsheet rejects login', async (): Promise<void> => {
            const response = createAxiosResponse({ status: 403 })
            axiosInstance.post.mockResolvedValueOnce(response)

            const result = await api.auth.post(credentials)

            expect(result.status).toBe(401)
        })

        test('should return undefined and log error when request fails', async (): Promise<void> => {
            const error = new Error('request failed')
            axiosInstance.post.mockRejectedValueOnce(error)

            const result = await api.auth.post(credentials)

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error login:', error)
            expect(result).toBeUndefined()
        })
    })

    describe('api.sheet.books', (): void => {
        test('should fetch book list from spreadsheet endpoint', async (): Promise<void> => {
            const books = [{ id: '1', title: 'Book' } as Book]
            const response = createAxiosResponse(books)
            axiosInstance.get.mockResolvedValueOnce(response)

            const result = await api.sheet.books.get()

            expect(axiosInstance.get).toHaveBeenCalledWith(`/api/spreadsheet?sheet=${Sheet.books}`)
            expect(result).toEqual(books)
        })

        test('should log and return undefined when fetching books fails', async (): Promise<void> => {
            const error = new Error('fetch failed')
            axiosInstance.get.mockRejectedValueOnce(error)

            const result = await api.sheet.books.get()

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error fetching books:', error)
            expect(result).toBeUndefined()
        })

        test('should post book data with json payload', async (): Promise<void> => {
            const book = { id: '2', title: 'New' } as Book
            const response = createAxiosResponse({ success: true })
            axiosInstance.post.mockResolvedValueOnce(response)
            const stringifySpy = jest.spyOn(JSON, 'stringify')

            const result = await api.sheet.books.post(book)

            expect(axiosInstance.post).toHaveBeenCalledWith(
                `/api/spreadsheet?sheet=${Sheet.books}`,
                JSON.stringify(book),
                { headers: { 'Content-Type': 'application/json' } }
            )
            expect(stringifySpy).toHaveBeenCalledWith(book)
            expect(result).toBe(response)

            stringifySpy.mockRestore()
        })

        test('should log error when book creation fails', async (): Promise<void> => {
            const book = { id: '3', title: 'Broken' } as Book
            const error = new Error('create failed')
            axiosInstance.post.mockRejectedValueOnce(error)

            await api.sheet.books.post(book)

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error fetching books:', error)
        })

        test('should delete book entry using spreadsheet id', async (): Promise<void> => {
            const response = createAxiosResponse({})
            axiosInstance.delete.mockResolvedValueOnce(response)

            const result = await api.sheet.books.delete('book-1')

            expect(axiosInstance.delete).toHaveBeenCalledWith(`/api/spreadsheet?sheet=${Sheet.books}&id=book-1`)
            expect(result).toBe(response)
        })

        test('should log error when book deletion fails', async (): Promise<void> => {
            const error = new Error('delete failed')
            axiosInstance.delete.mockRejectedValueOnce(error)

            const result = await api.sheet.books.delete('book-err')

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error deleting id book-err:', error)
            expect(result).toBeUndefined()
        })

        test('should update book entry with payload', async (): Promise<void> => {
            const book = { id: '4', title: 'Updated' } as Book
            const response = createAxiosResponse({})
            axiosInstance.put.mockResolvedValueOnce(response)

            const result = await api.sheet.books.put('4', book)

            expect(axiosInstance.put).toHaveBeenCalledWith(
                `/api/spreadsheet?sheet=${Sheet.books}&id=4`,
                JSON.stringify(book),
                { headers: { 'Content-Type': 'application/json' } }
            )
            expect(result).toBe(response)
        })

        test('should log error when book update fails', async (): Promise<void> => {
            const book = { id: '5', title: 'Fail' } as Book
            const error = new Error('update failed')
            axiosInstance.put.mockRejectedValueOnce(error)

            const result = await api.sheet.books.put('5', book)

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error update book:', error)
            expect(result).toBeUndefined()
        })
    })

    describe('api.sheet.users', (): void => {
        test('should fetch users from spreadsheet endpoint', async (): Promise<void> => {
            const users = [{ id: '1', name: 'User' } as User]
            const response = createAxiosResponse(users)
            axiosInstance.get.mockResolvedValueOnce(response)

            const result = await api.sheet.users.get()

            expect(axiosInstance.get).toHaveBeenCalledWith(`/api/spreadsheet?sheet=${Sheet.users}`)
            expect(result).toEqual(users)
        })

        test('should log error when fetching users fails', async (): Promise<void> => {
            const error = new Error('users failed')
            axiosInstance.get.mockRejectedValueOnce(error)

            const result = await api.sheet.users.get()

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error fetching Users:', error)
            expect(result).toBeUndefined()
        })

        test('should create spreadsheet user entry', async (): Promise<void> => {
            const user = { id: '2', name: 'New User' } as User
            const response = createAxiosResponse({})
            axiosInstance.post.mockResolvedValueOnce(response)

            const result = await api.sheet.users.post(user)

            expect(axiosInstance.post).toHaveBeenCalledWith(
                `/api/spreadsheet?sheet=${Sheet.users}`,
                JSON.stringify(user),
                { headers: { 'Content-Type': 'application/json' } }
            )
            expect(result).toBe(response)
        })

        test('should log error when creating user fails', async (): Promise<void> => {
            const user = { id: '2', name: 'Broken User' } as User
            const error = new Error('user create failed')
            axiosInstance.post.mockRejectedValueOnce(error)

            await api.sheet.users.post(user)

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error fetching users:', error)
        })

        test('should delete user from spreadsheet', async (): Promise<void> => {
            const response = createAxiosResponse({})
            axiosInstance.delete.mockResolvedValueOnce(response)

            const result = await api.sheet.users.delete('user-1')

            expect(axiosInstance.delete).toHaveBeenCalledWith(`/api/spreadsheet?sheet=${Sheet.users}&id=user-1`)
            expect(result).toBe(response)
        })

        test('should log error when deleting user fails', async (): Promise<void> => {
            const error = new Error('user delete failed')
            axiosInstance.delete.mockRejectedValueOnce(error)

            const result = await api.sheet.users.delete('user-broken')

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error deleting id user-broken:', error)
            expect(result).toBeUndefined()
        })

        test('should update user entry with payload', async (): Promise<void> => {
            const user = { id: '3', name: 'Updated User' } as User
            const response = createAxiosResponse({})
            axiosInstance.put.mockResolvedValueOnce(response)

            const result = await api.sheet.users.put('3', user)

            expect(axiosInstance.put).toHaveBeenCalledWith(
                `/api/spreadsheet?sheet=${Sheet.users}&id=3`,
                JSON.stringify(user),
                { headers: { 'Content-Type': 'application/json' } }
            )
            expect(result).toBe(response)
        })

        test('should log error when updating user fails', async (): Promise<void> => {
            const user = { id: '4', name: 'Failing User' } as User
            const error = new Error('user update failed')
            axiosInstance.put.mockRejectedValueOnce(error)

            const result = await api.sheet.users.put('4', user)

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error update user:', error)
            expect(result).toBeUndefined()
        })
    })

    describe('api.sheet.lends', (): void => {
        test('should fetch lends from spreadsheet', async (): Promise<void> => {
            const lends = [{ id: '1', bookId: 'b1', userId: 'u1' } as Lend]
            const response = createAxiosResponse(lends)
            axiosInstance.get.mockResolvedValueOnce(response)

            const result = await api.sheet.lends.get()

            expect(axiosInstance.get).toHaveBeenCalledWith(`/api/spreadsheet?sheet=${Sheet.lends}`)
            expect(result).toEqual(lends)
        })

        test('should log error when fetching lends fails', async (): Promise<void> => {
            const error = new Error('lends failed')
            axiosInstance.get.mockRejectedValueOnce(error)

            const result = await api.sheet.lends.get()

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error fetching lends:', error)
            expect(result).toBeUndefined()
        })

        test('should create lend entry', async (): Promise<void> => {
            const lend = { id: '2', bookId: 'b2', userId: 'u2' } as Lend
            const response = createAxiosResponse({})
            axiosInstance.post.mockResolvedValueOnce(response)

            const result = await api.sheet.lends.post(lend)

            expect(axiosInstance.post).toHaveBeenCalledWith(
                `/api/spreadsheet?sheet=${Sheet.lends}`,
                JSON.stringify(lend),
                { headers: { 'Content-Type': 'application/json' } }
            )
            expect(result).toBe(response)
        })

        test('should log error when creating lend fails', async (): Promise<void> => {
            const lend = { id: '3', bookId: 'b3', userId: 'u3' } as Lend
            const error = new Error('lend create failed')
            axiosInstance.post.mockRejectedValueOnce(error)

            await api.sheet.lends.post(lend)

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error fetching lend:', error)
        })

        test('should delete lend entry', async (): Promise<void> => {
            const response = createAxiosResponse({})
            axiosInstance.delete.mockResolvedValueOnce(response)

            const result = await api.sheet.lends.delete('lend-1')

            expect(axiosInstance.delete).toHaveBeenCalledWith(`/api/spreadsheet?sheet=${Sheet.lends}&id=lend-1`)
            expect(result).toBe(response)
        })

        test('should log error when deleting lend fails', async (): Promise<void> => {
            const error = new Error('lend delete failed')
            axiosInstance.delete.mockRejectedValueOnce(error)

            const result = await api.sheet.lends.delete('lend-broken')

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error deleting id lend-broken:', error)
            expect(result).toBeUndefined()
        })

        test('should update lend entry', async (): Promise<void> => {
            const lend = { id: '4', bookId: 'b4', userId: 'u4' } as Lend
            const response = createAxiosResponse({})
            axiosInstance.put.mockResolvedValueOnce(response)

            const result = await api.sheet.lends.put('4', lend)

            expect(axiosInstance.put).toHaveBeenCalledWith(
                `/api/spreadsheet?sheet=${Sheet.lends}&id=4`,
                JSON.stringify(lend),
                { headers: { 'Content-Type': 'application/json' } }
            )
            expect(result).toBe(response)
        })

        test('should log error when updating lend fails', async (): Promise<void> => {
            const lend = { id: '5', bookId: 'b5', userId: 'u5' } as Lend
            const error = new Error('lend update failed')
            axiosInstance.put.mockRejectedValueOnce(error)

            const result = await api.sheet.lends.put('5', lend)

            expect(consoleErrorSpy).toHaveBeenCalledWith('[Sheet] - Error update lend:', error)
            expect(result).toBeUndefined()
        })
    })
})
