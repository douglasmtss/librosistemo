import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { Entity } from '@/enums/entities'

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

import { api, entities_url, ISBN_LOOKUP_DELAY_MS, services } from '../api'

const createAxiosResponse = <T>(data: T, overrides?: Partial<AxiosResponse<T>>): AxiosResponse<T> => ({
    data,
    status: overrides?.status ?? 200,
    statusText: overrides?.statusText ?? 'OK',
    headers: overrides?.headers ?? {},
    config: (overrides?.config as InternalAxiosRequestConfig<T>) ?? ({} as InternalAxiosRequestConfig<T>)
})

describe('services/api', (): void => {
    let consoleErrorSpy: jest.SpyInstance<void, Parameters<typeof console.error>>
    let axiosInstance: AxiosInstanceMock

    beforeEach((): void => {
        axiosInstance = axiosMockModule.__instance
        axiosInstance.get.mockReset()
        axiosInstance.post.mockReset()
        axiosInstance.put.mockReset()
        axiosInstance.delete.mockReset()

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((): void => {})
    })

    afterEach((): void => {
        consoleErrorSpy.mockRestore()
        jest.clearAllMocks()
    })

    describe('constants', (): void => {
        test('expõe ISBN_LOOKUP_DELAY_MS', (): void => {
            expect(ISBN_LOOKUP_DELAY_MS).toBe(60000)
        })

        test('expõe entities_url', (): void => {
            expect(entities_url).toBe('/api/entities')
        })
    })

    describe('services.brasilapi', (): void => {
        test('busca livro por ISBN na BrasilAPI', async (): Promise<void> => {
            const book = { title: 'Dom Casmurro' }

            axiosInstance.get.mockResolvedValue(createAxiosResponse(book))

            const result = await services.brasilapi('9781234567890')

            expect(axiosInstance.get).toHaveBeenCalledWith('https://brasilapi.com.br/api/isbn/v1/9781234567890')
            expect(result).toEqual(book)
        })

        test('propaga erro da BrasilAPI', async (): Promise<void> => {
            const error = new Error('network')

            axiosInstance.get.mockRejectedValue(error)

            await expect(services.brasilapi('invalid')).rejects.toThrow(error)
        })
    })

    describe('api.auth.post', (): void => {
        test('retorna resposta com status 200 para login válido', async (): Promise<void> => {
            axiosInstance.post.mockResolvedValue(createAxiosResponse({ appLogged: 'yes', status: 200 }))

            const response = await api.auth.post({ username: 'a', password: 'b' })

            expect(axiosInstance.post).toHaveBeenCalledWith(
                '/api/auth',
                JSON.stringify({ username: 'a', password: 'b' }),
                expect.objectContaining({
                    headers: { 'Content-Type': 'application/json' },
                    validateStatus: expect.any(Function)
                })
            )
            expect(response.status).toBe(200)
        })

        test('marca status 401 quando o corpo não confirma login', async (): Promise<void> => {
            axiosInstance.post.mockResolvedValue(createAxiosResponse({ status: 401 }))

            const response = await api.auth.post({ username: 'a', password: 'errada' })

            expect(response.status).toBe(401)
        })

        test('propaga falha de rede', async (): Promise<void> => {
            axiosInstance.post.mockRejectedValue(new Error('offline'))

            await expect(api.auth.post({ username: 'a', password: 'b' })).rejects.toThrow('offline')
        })
    })

    describe('api.auth.logout', (): void => {
        test('chama DELETE /api/auth', async (): Promise<void> => {
            axiosInstance.delete.mockResolvedValue(createAxiosResponse({ status: 200 }))

            await api.auth.logout()

            expect(axiosInstance.delete).toHaveBeenCalledWith('/api/auth')
        })
    })

    describe.each(Object.values(Entity))('api.sheet.%s (CRUD genérico)', (entity: Entity): void => {
        const url = `${entities_url}?entity=${entity}`
        const record = { id: '42' }

        test('get retorna a lista', async (): Promise<void> => {
            axiosInstance.get.mockResolvedValue(createAxiosResponse([record]))

            const result = await api.sheet[entity].get()

            expect(axiosInstance.get).toHaveBeenCalledWith(url)
            expect(result).toEqual([record])
        })

        test('propaga erro do GET', async (): Promise<void> => {
            axiosInstance.get.mockRejectedValue(new Error('fail'))

            await expect(api.sheet[entity].get()).rejects.toThrow('fail')
        })

        test('post envia o registro como JSON', async (): Promise<void> => {
            axiosInstance.post.mockResolvedValue(createAxiosResponse(record, { status: 201 }))

            const response = await api.sheet[entity].post(record as never)

            expect(axiosInstance.post).toHaveBeenCalledWith(url, JSON.stringify(record), {
                headers: { 'Content-Type': 'application/json' }
            })
            expect(response.status).toBe(201)
        })

        test('put envia o registro para a URL com id', async (): Promise<void> => {
            axiosInstance.put.mockResolvedValue(createAxiosResponse(record))

            await api.sheet[entity].put('42', record as never)

            expect(axiosInstance.put).toHaveBeenCalledWith(`${url}&id=42`, JSON.stringify(record), {
                headers: { 'Content-Type': 'application/json' }
            })
        })

        test('delete chama a URL com id', async (): Promise<void> => {
            axiosInstance.delete.mockResolvedValue(createAxiosResponse({ deleted: '42' }))

            await api.sheet[entity].delete('42')

            expect(axiosInstance.delete).toHaveBeenCalledWith(`${url}&id=42`)
        })

        test('propaga erro nas operações de escrita', async (): Promise<void> => {
            axiosInstance.post.mockRejectedValue(new Error('fail'))
            axiosInstance.put.mockRejectedValue(new Error('fail'))
            axiosInstance.delete.mockRejectedValue(new Error('fail'))

            await expect(api.sheet[entity].post(record as never)).rejects.toThrow('fail')
            await expect(api.sheet[entity].put('42', record as never)).rejects.toThrow('fail')
            await expect(api.sheet[entity].delete('42')).rejects.toThrow('fail')
        })
    })
})
