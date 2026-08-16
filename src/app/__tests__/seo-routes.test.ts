import robots from '../robots'
import sitemap from '../sitemap'

describe('SEO routes', (): void => {
    beforeEach((): void => {
        process.env.SITE_URL = 'https://librosistemo.example'
    })

    afterEach((): void => {
        delete process.env.SITE_URL
    })

    test('robots permite só a landing e aponta o sitemap', (): void => {
        const result = robots()
        const rules = result.rules as { allow: string; disallow: string[] }

        expect(rules.allow).toBe('/')
        expect(rules.disallow).toEqual(expect.arrayContaining(['/pages/', '/login', '/api/']))
        expect(result.sitemap).toBe('https://librosistemo.example/sitemap.xml')
    })

    test('sitemap lista apenas a landing', (): void => {
        const result = sitemap()

        expect(result).toHaveLength(1)
        expect(result[0].url).toBe('https://librosistemo.example')
    })
})
