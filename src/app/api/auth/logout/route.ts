import { SESSION_COOKIE } from '@/services/session'
import { NextRequest, NextResponse } from 'next/server'

// Logout navegável (link "Sair" do menu): expira o cookie e volta para a landing.
export async function GET(req: NextRequest): Promise<NextResponse> {
    const response = NextResponse.redirect(new URL('/', req.url))

    response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })

    return response
}
