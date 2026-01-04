import { jwtServiceAccountAuth, scopes } from '@/services/jwtServiceAccountAuth'
import { JwtServiceAccountAuth } from '@/types/jwtServiceAccountAuth'
import { JWT } from 'google-auth-library'

describe('jwtServiceAccountAuth', () => {
    let originalEnv: NodeJS.ProcessEnv

    const expectedScopes = scopes

    beforeEach((): void => {
        originalEnv = { ...process.env }
    })

    afterEach((): void => {
        process.env = originalEnv
        jest.clearAllMocks()
    })

    describe('jwtServiceAccountAuth object', () => {
        test('should be defined', (): void => {
            expect(jwtServiceAccountAuth).toBeDefined()
        })

        test('should have required properties', (): void => {
            const requiredProperties: (keyof JwtServiceAccountAuth)[] = [
                'serviceAccountAuth',
                'email',
                'private_key',
                'sheetId',
                'scopes'
            ]

            requiredProperties.forEach((prop: keyof JwtServiceAccountAuth): void => {
                expect(jwtServiceAccountAuth).toHaveProperty(prop)
            })
        })

        test('should have serviceAccountAuth as JWT instance', (): void => {
            expect(jwtServiceAccountAuth.serviceAccountAuth).toBeInstanceOf(JWT)
        })

        test('should have email from environment variable', (): void => {
            const email: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL
            expect(jwtServiceAccountAuth.email).toBe(email)
        })

        test('should have sheetId from environment variable', (): void => {
            const sheetId: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
            expect(jwtServiceAccountAuth.sheetId).toBe(sheetId)
        })

        test('should have formatted private_key', (): void => {
            expect(jwtServiceAccountAuth.private_key).toBeDefined()
            expect(typeof jwtServiceAccountAuth.private_key).toBe('string')
        })

        test('should have correct scopes array', (): void => {
            expect(jwtServiceAccountAuth.scopes).toEqual(expectedScopes)
        })

        test('should have scopes as array', (): void => {
            expect(Array.isArray(jwtServiceAccountAuth.scopes)).toBe(true)
        })
    })

    describe('JWT initialization', () => {
        test('should initialize JWT with correct email', (): void => {
            const email: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL
            expect(jwtServiceAccountAuth.serviceAccountAuth.email).toBe(email)
        })

        test('should initialize JWT with formatted private key', (): void => {
            const originalKey: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY
            const formattedKey: string = (originalKey as string).replace(/\\n/g, '\n')
            expect(jwtServiceAccountAuth.serviceAccountAuth.key).toBe(formattedKey)
        })

        test('should initialize JWT with correct scopes', (): void => {
            expect(jwtServiceAccountAuth.serviceAccountAuth.scopes).toEqual(expectedScopes)
        })

        test('JWT should have authorize method', (): void => {
            expect(typeof jwtServiceAccountAuth.serviceAccountAuth.authorize).toBe('function')
        })
    })

    describe('Private key formatting', () => {
        test('should format private key with escaped newlines', (): void => {
            const privateKey: string = jwtServiceAccountAuth.private_key
            expect(privateKey).toContain('\n')
        })

        test('should replace escaped newlines with actual newlines', (): void => {
            const originalKey: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY
            if (originalKey && originalKey.includes('\\n')) {
                const hasEscapedNewlines: boolean = originalKey.includes('\\n')
                expect(hasEscapedNewlines).toBe(true)
            }
        })

        test('should maintain key structure after formatting', (): void => {
            const privateKey: string = jwtServiceAccountAuth.private_key
            expect(privateKey.length).toBeGreaterThan(0)
        })
    })

    describe('Environment variables validation', () => {
        test('should have NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL', (): void => {
            expect(process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL).toBeDefined()
            expect(typeof process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL).toBe('string')
        })

        test('should have NEXT_PUBLIC_GOOGLE_PRIVATE_KEY', (): void => {
            expect(process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY).toBeDefined()
            expect(typeof process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY).toBe('string')
        })

        test('should have NEXT_PUBLIC_GOOGLE_SHEET_ID', (): void => {
            expect(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID).toBeDefined()
            expect(typeof process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID).toBe('string')
        })

        test('should not have empty email', (): void => {
            const email: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL
            expect(email).toBeTruthy()
        })

        test('should not have empty private key', (): void => {
            const privateKey: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY
            expect(privateKey).toBeTruthy()
        })

        test('should not have empty sheet ID', (): void => {
            const sheetId: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
            expect(sheetId).toBeTruthy()
        })
    })

    describe('Type definitions', () => {
        test('jwtServiceAccountAuth should match JwtServiceAccountAuth type', (): void => {
            const isJwtServiceAccountAuth: boolean =
                typeof jwtServiceAccountAuth === 'object' &&
                jwtServiceAccountAuth !== null &&
                'serviceAccountAuth' in jwtServiceAccountAuth &&
                'email' in jwtServiceAccountAuth &&
                'private_key' in jwtServiceAccountAuth &&
                'sheetId' in jwtServiceAccountAuth &&
                'scopes' in jwtServiceAccountAuth

            expect(isJwtServiceAccountAuth).toBe(true)
        })

        test('serviceAccountAuth should be instance of JWT', (): void => {
            expect(jwtServiceAccountAuth.serviceAccountAuth).toBeInstanceOf(JWT)
        })

        test('scopes should be array of strings', (): void => {
            const isValidScopes: boolean =
                Array.isArray(jwtServiceAccountAuth.scopes) &&
                jwtServiceAccountAuth.scopes.every((scope: string): boolean => typeof scope === 'string')

            expect(isValidScopes).toBe(true)
        })

        test('email should be string', (): void => {
            expect(typeof jwtServiceAccountAuth.email).toBe('string')
        })

        test('private_key should be string', (): void => {
            expect(typeof jwtServiceAccountAuth.private_key).toBe('string')
        })

        test('sheetId should be string', (): void => {
            expect(typeof jwtServiceAccountAuth.sheetId).toBe('string')
        })
    })

    describe('Configuration consistency', () => {
        test('email in object should match email in JWT', (): void => {
            expect(jwtServiceAccountAuth.email).toBe(jwtServiceAccountAuth.serviceAccountAuth.email)
        })

        test('private_key in object should match key in JWT', (): void => {
            expect(jwtServiceAccountAuth.private_key).toBe(jwtServiceAccountAuth.serviceAccountAuth.key)
        })

        test('scopes in object should match scopes in JWT', (): void => {
            expect(jwtServiceAccountAuth.scopes).toEqual(jwtServiceAccountAuth.serviceAccountAuth.scopes)
        })

        test('all scopes should include spreadsheets scope', (): void => {
            const hasSpreadsheetScope: boolean = jwtServiceAccountAuth.scopes.some((scope: string): boolean =>
                scope.includes('spreadsheets')
            )

            expect(hasSpreadsheetScope).toBe(true)
        })
    })
})
