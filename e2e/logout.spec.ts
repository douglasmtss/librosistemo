import { expect, test } from '@playwright/test'

test.describe('Logout', () => {
    test('sair encerra a sessão de verdade', async ({ page }) => {
        await page.goto('/login')
        await page.getByPlaceholder('Usuário').fill('admin-e2e')
        await page.getByPlaceholder('Senha').fill('senha-e2e')
        await page.getByRole('button', { name: 'Entrar' }).click()
        await expect(page).toHaveURL(/\/pages\/dashboard/)

        await page.goto('/api/auth/logout')
        await expect(page).toHaveURL(/\/$/)

        await page.goto('/pages/dashboard')
        await expect(page).toHaveURL(/\/login$/)
    })
})
