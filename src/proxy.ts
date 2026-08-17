import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/services/session'

export async function proxy(request: NextRequest): Promise<NextResponse<unknown>> {
    const { pathname } = request.nextUrl

    // A landing page é pública; o restante exige sessão válida.
    if (pathname === '/') {
        return NextResponse.next()
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value
    const session = await verifySessionToken(token)

    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api/auth|login|_next/static|_next/image|favicon.ico|site.webmanifest|manifest.webmanifest|robots.txt|sitemap.xml|images|icons|scripts).*)'
    ]
}
