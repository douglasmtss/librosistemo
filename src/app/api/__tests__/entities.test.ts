/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

jest.mock('@/services/db/repositories', () => ({
    entityRepository: {
        list: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn()
    }
}))

import { entityRepository } from '@/services/db/repositories'
import { DELETE, GET, POST, PUT } from '../entities/route'

const repository = entityRepository as jest.Mocked<typeof entityRepository>

const buildRequest = (query: string, init?: { method?: string; body?: unknown }): NextRequest =>
    new NextRequest(`http://localhost/api/entities${query}`, {
        method: init?.method ?? 'GET',
        body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
        headers: { 'Content-Type': 'application/json' }
    })

const notFoundError = Object.assign(new Error('not found'), { code: 'P2025' })

describe('/api/entities', (): void => {
    let consoleErrorSpy: jest.SpyInstance

    beforeEach((): void => {
        jest.clearAllMocks()
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((): void => {})
    })

    afterEach((): void => {
        consoleErrorSpy.mockRestore()
    })

    describe('validação de entidade', (): void => {
        test.each(['?entity=admins', '?entity=auth', '?entity=qualquer', ''])(
            'GET %s retorna 400',
            async (query: string): Promise<void> => {
                const response = await GET(buildRequest(query))

                expect(response.status).toBe(400)
                expect(repository.list).not.toHaveBeenCalled()
            }
        )
    })

    describe('GET', (): void => {
        test('lista registros da entidade', async (): Promise<void> => {
            const books = [{ id: '1', title: 'Dom Casmurro' }]

            repository.list.mockResolvedValue(books)

            const response = await GET(buildRequest('?entity=books'))

            expect(response.status).toBe(200)
            await expect(response.json()).resolves.toEqual(books)
            expect(repository.list).toHaveBeenCalledWith('books')
        })

        test('busca registro por id', async (): Promise<void> => {
            repository.getById.mockResolvedValue({ id: '1', first_name: 'Maria' })

            const response = await GET(buildRequest('?entity=users&id=1'))

            expect(response.status).toBe(200)
            expect(repository.getById).toHaveBeenCalledWith('users', '1')
        })

        test('retorna 404 quando o id não existe', async (): Promise<void> => {
            repository.getById.mockResolvedValue(null)

            const response = await GET(buildRequest('?entity=users&id=999'))

            expect(response.status).toBe(404)
        })

        test('retorna 500 quando o repositório falha', async (): Promise<void> => {
            repository.list.mockRejectedValue(new Error('db off'))

            const response = await GET(buildRequest('?entity=books'))

            expect(response.status).toBe(500)
        })
    })

    describe('POST', (): void => {
        test('cria registro e retorna 201', async (): Promise<void> => {
            const lend = { user_id: 'u1', book_id: 'b1' }

            repository.create.mockResolvedValue({ id: 'l1', ...lend })

            const response = await POST(buildRequest('?entity=lends', { method: 'POST', body: lend }))

            expect(response.status).toBe(201)
            expect(repository.create).toHaveBeenCalledWith('lends', lend)
        })

        test('retorna 400 para entidade inválida sem tocar no banco', async (): Promise<void> => {
            const response = await POST(buildRequest('?entity=admins', { method: 'POST', body: {} }))

            expect(response.status).toBe(400)
            expect(repository.create).not.toHaveBeenCalled()
        })

        test('retorna 400 para payload inválido', async (): Promise<void> => {
            const response = await POST(buildRequest('?entity=books', { method: 'POST', body: { title: '' } }))

            expect(response.status).toBe(400)
            expect(repository.create).not.toHaveBeenCalled()
        })
    })

    describe('PUT', (): void => {
        test('atualiza registro existente', async (): Promise<void> => {
            repository.update.mockResolvedValue({ id: 'b1', title: 'Novo título' })

            const response = await PUT(
                buildRequest('?entity=books&id=b1', { method: 'PUT', body: { title: 'Novo título' } })
            )

            expect(response.status).toBe(200)
            expect(repository.update).toHaveBeenCalledWith('books', 'b1', { title: 'Novo título' })
        })

        test('retorna 400 sem id', async (): Promise<void> => {
            const response = await PUT(buildRequest('?entity=books', { method: 'PUT', body: {} }))

            expect(response.status).toBe(400)
        })

        test('retorna 404 quando o registro não existe', async (): Promise<void> => {
            repository.update.mockRejectedValue(notFoundError)

            const response = await PUT(buildRequest('?entity=books&id=x', { method: 'PUT', body: {} }))

            expect(response.status).toBe(404)
        })

        test('retorna 400 para payload de atualização inválido', async (): Promise<void> => {
            const response = await PUT(buildRequest('?entity=books&id=x', { method: 'PUT', body: [] }))

            expect(response.status).toBe(400)
            expect(repository.update).not.toHaveBeenCalled()
        })
    })

    describe('DELETE', (): void => {
        test('exclui registro', async (): Promise<void> => {
            repository.remove.mockResolvedValue({ id: 'u1' })

            const response = await DELETE(buildRequest('?entity=users&id=u1', { method: 'DELETE' }))

            expect(response.status).toBe(200)
            expect(repository.remove).toHaveBeenCalledWith('users', 'u1')
        })

        test('retorna 400 sem id', async (): Promise<void> => {
            const response = await DELETE(buildRequest('?entity=users', { method: 'DELETE' }))

            expect(response.status).toBe(400)
        })

        test('retorna 404 quando o registro não existe', async (): Promise<void> => {
            repository.remove.mockRejectedValue(notFoundError)

            const response = await DELETE(buildRequest('?entity=users&id=zz', { method: 'DELETE' }))

            expect(response.status).toBe(404)
        })
    })
})
