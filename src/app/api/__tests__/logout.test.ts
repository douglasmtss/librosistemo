/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET } from '../auth/logout/route'

describe('GET /api/auth/logout', (): void => {
    test('expira o cookie de sessão e redireciona para a landing', async (): Promise<void> => {
        const response = await GET(new NextRequest('http://localhost/api/auth/logout'))

        expect(response.status).toBe(307)
        expect(response.headers.get('location')).toBe('http://localhost/')

        const setCookie = response.headers.get('set-cookie') ?? ''

        expect(setCookie).toContain('app-session=')
        expect(setCookie).toContain('Max-Age=0')
    })
})
