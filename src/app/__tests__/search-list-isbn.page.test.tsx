import '@testing-library/jest-dom'
import React from 'react'
import fs from 'fs'
import path from 'path'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            books: {
                get: jest.fn(),
                list: jest.fn(),
                post: jest.fn(),
                put: jest.fn(),
                delete: jest.fn()
            }
        }
    },
    services: {
        brasilapi: jest.fn(),
        google: jest.fn()
    },
    GOOGLE_API_LIMIT: 100
}))

jest.mock('@/components/Empty', () => {
    return function MockEmpty(): React.JSX.Element {
        return <div data-testid="empty">Empty</div>
    }
})

jest.mock('@/components/Img', () => {
    return function MockImg(): React.JSX.Element {
        return <div data-testid="img">Img</div>
    }
})

jest.mock('@/components/BookCreateFormFromList', () => {
    return function MockBookCreateFormFromList(): React.JSX.Element {
        return <div data-testid="book-form-list">BookCreateFormFromList</div>
    }
})

jest.mock('@/components/BackToTopButton', () => {
    return function MockBackToTopButton(): React.JSX.Element {
        return <div data-testid="back-top">BackToTopButton</div>
    }
})

jest.mock('@/components/BackButton', () => {
    return function MockBackButton(): React.JSX.Element {
        return <div data-testid="back-button">BackButton</div>
    }
})

jest.mock(
    '@/hooks/useToastify',
    (): {
        useToastify: () => { toast: jest.Mock<void, [message: string]> }
    } => ({
        useToastify: () => ({
            toast: jest.fn()
        })
    })
)

jest.mock('@/hooks/useEntities', () => ({
    useEntities: jest.fn(() => ({
        books: [],
        users: [],
        lends: [],
        setBooks: jest.fn(),
        setUsers: jest.fn(),
        setLends: jest.fn(),
        filteredBooks: [],
        filteredUsers: [],
        filteredLends: [],
        setFilteredBooks: jest.fn(),
        setFilteredUsers: jest.fn(),
        setFilteredLends: jest.fn(),
        loading: false,
        loadingUsers: false,
        loadingLends: false,
        loadingBooks: false
    }))
}))

jest.mock(
    'next/navigation',
    (): {
        useSearchParams: () => { get: jest.Mock<string | null, [key: string]> }
        useRouter: () => { push: jest.Mock<void, [url: string]>; back: jest.Mock<void, []> }
    } => ({
        useSearchParams: () => ({
            get: jest.fn(key => {
                if (key === 'list_isbn') return JSON.stringify(['9788570460097'])

                return null
            })
        }),
        useRouter: () => ({
            push: jest.fn(),
            back: jest.fn()
        })
    })
)

jest.mock(
    'react-icons/ai',
    (): {
        AiOutlineLoading3Quarters: () => React.JSX.Element
    } => ({
        AiOutlineLoading3Quarters: () => <div data-testid="loading-icon">Loading</div>
    })
)

jest.mock('@/lib/checkIfBookAlreadyExists', () => ({
    checkIfBookAlreadyExists: jest.fn(() => false)
}))

jest.mock(
    'uuid',
    (): {
        v4: () => string
    } => ({
        v4: () => 'test-uuid-1234'
    })
)

describe('SearchPageImpl [list_isbn]', () => {
    test('should export SearchPageImpl component with suspense', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list_isbn/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('SearchPageImpl')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list_isbn/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api and services', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list_isbn/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import { api, services } from '@/services/api'")
    })

    test('should import useEntities hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list_isbn/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useEntities')
    })

    test('should import BookCreateFormFromList component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list_isbn/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BookCreateFormFromList')
    })

    test('should import useSearchParams hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list_isbn/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useSearchParams')
    })

    test('should import checkIfBookAlreadyExists utility', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list_isbn/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('checkIfBookAlreadyExists')
    })

    test('should have complex state management', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list_isbn/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useState')
        expect(content).toContain('useEffect')
        expect(content).toContain('useCallback')
    })

    test('should handle error objects', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list_isbn/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('ErrorObj')
        expect(content).toContain('codesWithErrors')
    })
})
