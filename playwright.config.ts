import { defineConfig, devices } from '@playwright/test'

// E2E roda contra um build de produção com banco SQLite descartável (e2e.db).
// Local: yarn build && yarn e2e. No CI o build acontece em step separado.
const PORT = 3900

export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: process.env.CI ? [['html'], ['github']] : [['html', { open: 'never' }], ['list']],
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: 'on-first-retry'
    },
    projects: [
        {
            name: 'chromium-mobile',
            use: { ...devices['Pixel 7'] }
        },
        {
            name: 'chromium-desktop',
            use: { ...devices['Desktop Chrome'] }
        }
    ],
    webServer: {
        command: `rm -f e2e.db && yarn db:setup && yarn start -p ${PORT}`,
        port: PORT,
        reuseExistingServer: false,
        timeout: 120000,
        env: {
            DATABASE_URL: 'file:./e2e.db',
            SESSION_SECRET: 'segredo-e2e',
            ADMIN_USERNAME: 'admin-e2e',
            ADMIN_PASSWORD: 'senha-e2e'
        }
    }
})
