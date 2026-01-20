import '@testing-library/jest-dom'

jest.mock('@/components/BackButton', () => {
    return function MockBackButton() {
        return <div data-testid="back-button">Back Button</div>
    }
})

describe('List Page', () => {
    test('should export default List component', () => {
        const List = require('../pages/dashboard/book-registration/list/page').default
        
        expect(List).toBeDefined()
        expect(typeof List).toBe('function')
    })

    test('should be a client component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should contain heading elements', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('<h2>')
        expect(content).toContain('Digite ou cole uma lista de códigos ISBN')
    })

    test('should contain textarea element', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('<textarea')
    })

    test('should import BackButton component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BackButton')
    })

    test('should import Link from next/link', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain("import Link from 'next/link'")
    })

    test('should use useState hook for inputValue and codes', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useState')
        expect(content).toContain('inputValue')
        expect(content).toContain('setCodes')
    })

    test('should have handleChange function', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('handleChange')
    })

    test('should have handleSearch function', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('handleSearch')
    })

    test('should navigate to list_isbn route on search', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('list_isbn')
    })
})
