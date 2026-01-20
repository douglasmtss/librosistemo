import '@testing-library/jest-dom'

jest.mock('@/components/BackButton', () => {
    return function MockBackButton() {
        return <div data-testid="back-button">Back Button</div>
    }
})

jest.mock('@/components/Scan', () => {
    return function MockScan() {
        return <div data-testid="scan-component">Scan Component</div>
    }
})

import Scanner from '../pages/dashboard/book-registration/scanner/page'

describe('Scanner Page', () => {
    test('should export default Scanner component', () => {
        expect(Scanner).toBeDefined()
        expect(typeof Scanner).toBe('function')
    })

    test('should return React.ReactNode', () => {
        const component = Scanner()

        expect(component).toBeDefined()
        expect(component).not.toBeNull()
    })

    test('should be a client component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/scanner/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should contain heading element in JSX', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/scanner/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('<h1')
        expect(content).toContain('Escanear código ISBN')
    })

    test('should import BackButton component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/scanner/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BackButton')
    })

    test('should import Scan component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/scanner/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('Scan')
    })
})
