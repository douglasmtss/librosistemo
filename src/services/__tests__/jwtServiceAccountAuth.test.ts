import type { JwtServiceAccountAuth } from '@/types/jwtServiceAccountAuth'
import { JWT } from 'google-auth-library'

jest.mock('google-auth-library', () => ({
    JWT: jest.fn().mockImplementation(({ email, key, scopes }: { email: string; key: string; scopes: string[] }) => ({
        email,
        key,
        scopes,
        authorize: jest.fn(async (): Promise<void> => {}),
        subject: undefined,
        additionalClaims: undefined,
        sign: jest.fn(),
        computeSubject: jest.fn(),
        gtoken: undefined,
        projectId: undefined,
        quotaProjectId: undefined
    }))
}))

type AuthModule = typeof import('../jwtServiceAccountAuth')

const MODULE_PATH = '../jwtServiceAccountAuth'

const defaultEnv: Record<string, string> = {
    NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL: 'service-account@test.com',
    NEXT_PUBLIC_GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nline-one\\nline-two\\n-----END PRIVATE KEY-----',
    NEXT_PUBLIC_GOOGLE_SHEET_ID: 'sheet-12345'
}

const importAuthModule = async (): Promise<AuthModule> => import(MODULE_PATH)

describe('jwtServiceAccountAuth', (): void => {
    let originalEnv: NodeJS.ProcessEnv
    let jwtMock: jest.Mock

    beforeEach(async (): Promise<void> => {
        originalEnv = { ...process.env }
        jest.resetModules()
        process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL = defaultEnv.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL
        process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY = defaultEnv.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY
        process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID = defaultEnv.NEXT_PUBLIC_GOOGLE_SHEET_ID

        const googleAuthModule = await import('google-auth-library')
        jwtMock = googleAuthModule.JWT as unknown as jest.Mock
        jwtMock.mockClear()
    })

    afterEach((): void => {
        process.env = originalEnv
        jest.resetModules()
        jest.clearAllMocks()
    })

    describe('successful initialization', (): void => {
        test('should expose formatted credentials and shared scopes', async (): Promise<void> => {
            const { jwtServiceAccountAuth, scopes } = await importAuthModule()

            expect(jwtServiceAccountAuth.email).toBe(defaultEnv.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL)
            expect(jwtServiceAccountAuth.sheetId).toBe(defaultEnv.NEXT_PUBLIC_GOOGLE_SHEET_ID)
            expect(jwtServiceAccountAuth.scopes).toBe(scopes)
            expect(jwtServiceAccountAuth.scopes).toEqual(['https://www.googleapis.com/auth/spreadsheets'])

            expect(jwtMock).toHaveBeenCalledTimes(1)
            expect(jwtMock).toHaveBeenCalledWith({
                email: defaultEnv.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: jwtServiceAccountAuth.private_key,
                scopes
            })
            expect(jwtServiceAccountAuth.serviceAccountAuth).toEqual(
                expect.objectContaining({
                    email: defaultEnv.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    key: jwtServiceAccountAuth.private_key,
                    scopes
                })
            )
        })

        test('should align exported object with JwtServiceAccountAuth type', async (): Promise<void> => {
            const { jwtServiceAccountAuth } = await importAuthModule()

            const keys: (keyof JwtServiceAccountAuth)[] = [
                'serviceAccountAuth',
                'email',
                'private_key',
                'sheetId',
                'scopes'
            ]

            keys.forEach((property: keyof JwtServiceAccountAuth): void => {
                expect(jwtServiceAccountAuth).toHaveProperty(property)
            })
            expect(jwtServiceAccountAuth.private_key).toBe(jwtServiceAccountAuth.serviceAccountAuth.key)
        })
    })

    describe('formatting behaviour', (): void => {
        test('should replace escaped newlines in the private key', async (): Promise<void> => {
            const replaceSpy = jest.spyOn(String.prototype, 'replace')

            const { jwtServiceAccountAuth } = await importAuthModule()

            expect(replaceSpy).toHaveBeenCalledWith(/\\n/g, '\n')
            expect(jwtServiceAccountAuth.private_key).not.toContain('\\n')
            expect(jwtServiceAccountAuth.private_key).toContain('\n')

            replaceSpy.mockRestore()
        })
    })

    describe('environment validation', (): void => {
        const expectImportToThrow = async (): Promise<void> => {
            await expect(importAuthModule()).rejects.toThrow('Missing required environment variables')
        }

        test('should throw when private key is undefined', async (): Promise<void> => {
            Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_GOOGLE_PRIVATE_KEY')

            await expectImportToThrow()
        })

        test('should throw when email is empty', async (): Promise<void> => {
            process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL = ''

            await expectImportToThrow()
        })
    })
})
