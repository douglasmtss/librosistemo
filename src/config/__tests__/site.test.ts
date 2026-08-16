import { getSiteUrl } from '../site'

describe('config/site', (): void => {
    const original = process.env.SITE_URL

    afterEach((): void => {
        if (original === undefined) {
            delete process.env.SITE_URL
        } else {
            process.env.SITE_URL = original
        }
    })

    test('usa SITE_URL quando definido', (): void => {
        process.env.SITE_URL = 'https://librosistemo.example'

        expect(getSiteUrl()).toBe('https://librosistemo.example')
    })

    test('cai no localhost quando não definido', (): void => {
        delete process.env.SITE_URL

        expect(getSiteUrl()).toBe('http://localhost:3000')
    })
})
