import { configInfo } from '@/config/info'

describe('configInfo', () => {
    test('should be an object', () => {
        expect(typeof configInfo).toBe('object')
    })

    test('should have correct number of properties', () => {
        expect(Object.keys(configInfo).length).toBe(5)
    })

    test('should have all required properties', () => {
        const requiredProperties = ['appName', 'appDescription', 'appLogo', 'appManual']
        requiredProperties.forEach(prop => {
            expect(configInfo).toHaveProperty(prop)
        })
    })

    test('should export configInfo object', () => {
        expect(configInfo).toBeDefined()
    })

    test('should have appName property', () => {
        expect(configInfo.appName).toBeDefined()
        expect(typeof configInfo.appName).toBe('string')
        expect(configInfo.appName).toBe('Librosistemo')
    })

    test('should have appDescription property', () => {
        expect(configInfo.appDescription).toBeDefined()
        expect(typeof configInfo.appDescription).toBe('string')
        expect(configInfo.appDescription).toBe(
            'Sistema open source de gestão de biblioteca — livros, usuários e empréstimos'
        )
    })

    test('should have appLogo property with correct path', () => {
        expect(configInfo.appLogo).toBeDefined()
        expect(typeof configInfo.appLogo).toBe('string')
        expect(configInfo.appLogo).toBe('/images/logo-librosistemo.png')
        expect(configInfo.appLogo).toMatch(/^\/images\//)
    })

    test('should have appManual property with valid GitHub URL', () => {
        expect(configInfo.appManual).toBeDefined()
        expect(typeof configInfo.appManual).toBe('string')
        expect(configInfo.appManual).toContain('https://github.com/')
        expect(configInfo.appManual).toContain('librosistemo')
        expect(configInfo.appManual).toContain('MANUAL_PT_BR.md')
    })

    test('should have all required properties', () => {
        const requiredProperties = ['appName', 'appDescription', 'appLogo', 'appManual']
        requiredProperties.forEach(prop => {
            expect(configInfo).toHaveProperty(prop)
        })
    })

    test('should not have empty values', () => {
        Object.values(configInfo).forEach(value => {
            expect(value).toBeTruthy()
            expect(value).not.toBe('')
        })
    })

    test('should have correct structure', () => {
        expect(Object.keys(configInfo)).toEqual(['appName', 'appDescription', 'appLogo', 'appRepository', 'appManual'])
    })
})
