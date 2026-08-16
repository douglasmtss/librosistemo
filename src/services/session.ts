// Sessão assinada com HMAC-SHA256 via Web Crypto — funciona tanto no runtime
// Node (rota /api/auth) quanto no Edge (proxy.ts), sem dependências.

export const SESSION_COOKIE = 'app-session'
export const SESSION_TTL_SECONDS = 60 * 60 * 8

const DEV_FALLBACK_SECRET = 'librosistemo-dev-secret-defina-SESSION_SECRET'

export const getSessionSecret = (): string => {
    const secret = process.env.SESSION_SECRET

    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            console.error('[session] SESSION_SECRET não definido em produção — sessões inseguras')
        }

        return DEV_FALLBACK_SECRET
    }

    return secret
}

type SessionPayload = {
    sub: string
    exp: number
}

const encoder = new TextEncoder()

const toBase64Url = (bytes: Uint8Array): string =>
    btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

const fromBase64Url = (value: string): Uint8Array => {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/')

    return Uint8Array.from(atob(base64), char => char.charCodeAt(0))
}

const getKey = async (secret: string): Promise<CryptoKey> =>
    crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])

export const createSessionToken = async (
    username: string,
    ttlSeconds: number = SESSION_TTL_SECONDS,
    secret: string = getSessionSecret()
): Promise<string> => {
    const payload: SessionPayload = { sub: username, exp: Date.now() + ttlSeconds * 1000 }
    const encodedPayload = toBase64Url(encoder.encode(JSON.stringify(payload)))

    const key = await getKey(secret)
    const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(encodedPayload)))

    return `${encodedPayload}.${toBase64Url(signature)}`
}

export const verifySessionToken = async (
    token: string | undefined,
    secret: string = getSessionSecret()
): Promise<SessionPayload | null> => {
    if (!token) {
        return null
    }

    const [encodedPayload, encodedSignature] = token.split('.')

    if (!encodedPayload || !encodedSignature) {
        return null
    }

    try {
        const key = await getKey(secret)
        const valid = await crypto.subtle.verify(
            'HMAC',
            key,
            fromBase64Url(encodedSignature) as BufferSource,
            encoder.encode(encodedPayload)
        )

        if (!valid) {
            return null
        }

        const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as SessionPayload

        if (typeof payload.exp !== 'number' || payload.exp < Date.now()) {
            return null
        }

        return payload
    } catch {
        return null
    }
}
