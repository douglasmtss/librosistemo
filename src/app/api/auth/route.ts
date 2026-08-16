import { adminRepository } from '@/services/db/repositories'
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from '@/services/session'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = (await req.json()) as { username?: string; password?: string }

        if (!body.username || !body.password) {
            return NextResponse.json({ status: 401 }, { status: 401 })
        }

        const admin = await adminRepository.findByUsername(body.username)

        if (!admin || !(await bcrypt.compare(body.password, admin.passwordHash))) {
            return NextResponse.json({ status: 401 }, { status: 401 })
        }

        const token = await createSessionToken(admin.username)

        // O corpo mantém o contrato que o front espera ({ status: 200 });
        // a sessão de verdade vai no cookie httpOnly, fora do alcance de JS.
        const response = NextResponse.json({ appLogged: 'yes', status: 200 }, { status: 200 })

        response.cookies.set(SESSION_COOKIE, token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: SESSION_TTL_SECONDS
        })

        return response
    } catch (error) {
        console.error('[auth] Erro inesperado:', error)

        return NextResponse.json({ status: 500 }, { status: 500 })
    }
}

export async function DELETE(): Promise<NextResponse> {
    const response = NextResponse.json({ status: 200 }, { status: 200 })

    response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })

    return response
}
