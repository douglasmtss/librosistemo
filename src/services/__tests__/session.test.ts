/**
 * @jest-environment node
 */
import { createSessionToken, getSessionSecret, verifySessionToken } from '../session'

const SECRET = 'segredo-de-teste'

describe('services/session', (): void => {
    test('token criado é verificado com sucesso', async (): Promise<void> => {
        const token = await createSessionToken('allan', 60, SECRET)
        const payload = await verifySessionToken(token, SECRET)

        expect(payload).not.toBeNull()
        expect(payload?.sub).toBe('allan')
        expect(payload?.exp).toBeGreaterThan(Date.now())
    })

    test('token adulterado é rejeitado', async (): Promise<void> => {
        const token = await createSessionToken('allan', 60, SECRET)
        const [payload, signature] = token.split('.')
        const tampered = `${payload.slice(0, -2)}xx.${signature}`

        await expect(verifySessionToken(tampered, SECRET)).resolves.toBeNull()
    })

    test('token assinado com outro segredo é rejeitado', async (): Promise<void> => {
        const token = await createSessionToken('allan', 60, 'outro-segredo')

        await expect(verifySessionToken(token, SECRET)).resolves.toBeNull()
    })

    test('token expirado é rejeitado', async (): Promise<void> => {
        const token = await createSessionToken('allan', -1, SECRET)

        await expect(verifySessionToken(token, SECRET)).resolves.toBeNull()
    })

    test.each([undefined, '', 'lixo', 'a.b.c', 'só-uma-parte'])(
        'token malformado %p é rejeitado',
        async (token): Promise<void> => {
            await expect(verifySessionToken(token as string | undefined, SECRET)).resolves.toBeNull()
        }
    )

    describe('getSessionSecret', (): void => {
        const originalSecret = process.env.SESSION_SECRET

        afterEach((): void => {
            process.env.SESSION_SECRET = originalSecret
        })

        test('usa SESSION_SECRET quando definido', (): void => {
            process.env.SESSION_SECRET = 'definido'

            expect(getSessionSecret()).toBe('definido')
        })

        test('cai no fallback de dev quando não definido', (): void => {
            delete process.env.SESSION_SECRET

            expect(getSessionSecret()).toContain('dev-secret')
        })
    })
})
