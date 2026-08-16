import { expect, test } from '@playwright/test'

test.describe('Autenticação', () => {
    test('rota protegida sem sessão redireciona para /login', async ({ page }) => {
        await page.goto('/pages/dashboard')

        await expect(page).toHaveURL(/\/login$/)
    })

    test('login com credenciais inválidas mantém na tela e avisa', async ({ page }) => {
        await page.goto('/login')

        await page.getByPlaceholder('Usuário').fill('admin-e2e')
        await page.getByPlaceholder('Senha').fill('senha-errada')
        await page.getByRole('button', { name: 'Entrar' }).click()

        await expect(page.getByText('Usuário ou senha inválidos')).toBeVisible()
        await expect(page).toHaveURL(/\/login$/)
    })

    test('login com credenciais válidas leva ao dashboard', async ({ page }) => {
        await page.goto('/login')

        await page.getByPlaceholder('Usuário').fill('admin-e2e')
        await page.getByPlaceholder('Senha').fill('senha-e2e')
        await page.getByRole('button', { name: 'Entrar' }).click()

        await expect(page).toHaveURL(/\/pages\/dashboard/)
    })

    test('cookie adulterado não dá acesso', async ({ page, context }) => {
        await context.addCookies([
            { name: 'app-session', value: 'payload-falso.assinatura-falsa', url: 'http://localhost:3900' }
        ])

        await page.goto('/pages/dashboard/books')

        await expect(page).toHaveURL(/\/login$/)
    })
})
