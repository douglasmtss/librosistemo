/**
 * @jest-environment node
 */
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

jest.mock('@/services/db/repositories', () => ({
    adminRepository: {
        findByUsername: jest.fn()
    }
}))

import { adminRepository } from '@/services/db/repositories'
import { DELETE, POST } from '../auth/route'

const findByUsername = adminRepository.findByUsername as jest.Mock

const buildRequest = (body: unknown): NextRequest =>
    new NextRequest('http://localhost/api/auth', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })

describe('POST /api/auth', (): void => {
    const passwordHash = bcrypt.hashSync('rivail', 4)

    beforeEach((): void => {
        findByUsername.mockReset()
        process.env.SESSION_SECRET = 'segredo-de-teste'
    })

    test('retorna 200 e cookie de sessão httpOnly para credenciais válidas', async (): Promise<void> => {
        findByUsername.mockResolvedValue({ id: '1', username: 'allan', passwordHash })

        const response = await POST(buildRequest({ username: 'allan', password: 'rivail' }))

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ appLogged: 'yes', status: 200 })

        const setCookie = response.headers.get('set-cookie') ?? ''

        expect(setCookie).toContain('app-session=')
        expect(setCookie.toLowerCase()).toContain('httponly')
    })

    test('retorna 401 para senha incorreta', async (): Promise<void> => {
        findByUsername.mockResolvedValue({ id: '1', username: 'allan', passwordHash })

        const response = await POST(buildRequest({ username: 'allan', password: 'errada' }))

        expect(response.status).toBe(401)
        expect(response.headers.get('set-cookie')).toBeNull()
    })

    test('retorna 401 para usuário inexistente', async (): Promise<void> => {
        findByUsername.mockResolvedValue(null)

        const response = await POST(buildRequest({ username: 'ninguem', password: 'x' }))

        expect(response.status).toBe(401)
    })

    test('retorna 401 quando faltam credenciais', async (): Promise<void> => {
        const response = await POST(buildRequest({ username: 'allan' }))

        expect(response.status).toBe(401)
        expect(findByUsername).not.toHaveBeenCalled()
    })

    test('retorna 500 quando o corpo não é JSON válido', async (): Promise<void> => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((): void => {})

        const request = new NextRequest('http://localhost/api/auth', { method: 'POST', body: 'não-json' })
        const response = await POST(request)

        expect(response.status).toBe(500)
        consoleErrorSpy.mockRestore()
    })
})

describe('DELETE /api/auth', (): void => {
    test('expira o cookie de sessão', async (): Promise<void> => {
        const response = await DELETE()

        expect(response.status).toBe(200)

        const setCookie = response.headers.get('set-cookie') ?? ''

        expect(setCookie).toContain('app-session=')
        expect(setCookie).toContain('Max-Age=0')
    })
})
