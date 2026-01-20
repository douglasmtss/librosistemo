import React from 'react'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'
import Books from '../pages/dashboard/books/page'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            books: {
                list: jest.fn(),
                get: jest.fn(),
                delete: jest.fn(),
                update: jest.fn()
            },
            lends: {
                list: jest.fn(),
                get: jest.fn(),
                delete: jest.fn(),
                update: jest.fn()
            },
            users: {
                list: jest.fn(),
                get: jest.fn(),
                delete: jest.fn(),
                update: jest.fn()
            }
        }
    }
}))

jest.mock('@/components/Empty', () => {
    return function MockEmpty(): React.JSX.Element {
        return <div data-testid="empty">Empty</div>
    }
})

jest.mock('@/components/PaginatedBookItems', () => {
    return function MockPaginatedBookItems(): React.JSX.Element {
        return <div data-testid="paginated-items">PaginatedBookItems</div>
    }
})

jest.mock('@/components/Loading', () => {
    return function MockLoading(): React.JSX.Element {
        return <div data-testid="loading">Loading</div>
    }
})

jest.mock('@/components/BackButton', () => {
    return function MockBackButton(): React.JSX.Element {
        return <div data-testid="back-button">BackButton</div>
    }
})

describe('Books Page', () => {
    test('should export default Books component', () => {
        expect(Books).toBeDefined()
        expect(typeof Books).toBe('function')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import PaginatedBookItems component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('PaginatedBookItems')
    })

    test('should import BackButton component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BackButton')
    })

    test('should import Loading component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('Loading')
    })

    test('should import Empty component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('Empty')
    })

    test('should have FilterBook type definition', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('FilterBook')
    })

    test('should use useEffect hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useEffect')
    })

    test('should use useState hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useState')
    })

    test('should have filtering functionality', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/books/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('handleChange')
        expect(content).toContain('filter')
    })
})
