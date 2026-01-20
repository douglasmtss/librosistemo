import '@testing-library/jest-dom'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            books: {
                get: jest.fn(),
                list: jest.fn(),
                delete: jest.fn(),
                update: jest.fn(),
                put: jest.fn()
            }
        }
    }
}))

jest.mock('@/components/BookEditForm', () => {
    return function MockBookEditForm() {
        return <div data-testid="book-edit-form">BookEditForm</div>
    }
})

jest.mock('@/components/BackButton', () => {
    return function MockBackButton() {
        return <div data-testid="back-button">BackButton</div>
    }
})

describe('EditBook Page [rowIndex]', () => {
    test('should export default EditBook component', () => {
        const EditBook = require('../pages/dashboard/[rowIndex]/page').default
        
        expect(EditBook).toBeDefined()
        expect(typeof EditBook).toBe('function')
    })

    test('should be a client component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import BookEditForm component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BookEditForm')
    })

    test('should import BackButton component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BackButton')
    })

    test('should have EditBookProps interface', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('EditBookProps')
        expect(content).toContain('params')
        expect(content).toContain('rowIndex')
    })

    test('should use useState hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useState')
    })

    test('should use useEffect hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useEffect')
    })
})
