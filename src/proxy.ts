import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest): Promise<NextResponse<unknown>> {
    const appLogged = request.cookies.get('app-logged')

    if (!appLogged) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}
export const config = {
    matcher: ['/((?!api/auth|login|_next/static|_next/image|favicon.ico|images|icons|scripts).*)']
}
