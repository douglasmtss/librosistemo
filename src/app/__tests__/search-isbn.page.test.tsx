import '@testing-library/jest-dom'
import React from 'react'
import fs from 'fs'
import path from 'path'
import SearchPage from '../pages/dashboard/book-registration/[isbn]/page'

jest.mock('@/services/api', () => ({
    services: {
        brasilapi: jest.fn(),
        google: jest.fn()
    }
}))

jest.mock('@/components/Empty', () => ({
    Empty: function MockEmpty(): React.JSX.Element {
        return <div data-testid="empty">Empty</div>
    }
}))

jest.mock('@/components/BookCreateForm', () => {
    return function MockBookCreateForm(): React.JSX.Element {
        return <div data-testid="book-form">BookCreateForm</div>
    }
})

jest.mock('@/components/Img', () => ({
    Img: function MockImg(): React.JSX.Element {
        return <div data-testid="img">Img</div>
    }
}))

jest.mock('@/components/BackButton', () => ({
    BackButton: function MockBackButton(): React.JSX.Element {
        return <div data-testid="back-button">BackButton</div>
    }
}))

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

jest.mock('react-icons/ai', () => ({
    AiOutlineLoading3Quarters: (): React.JSX.Element => <div data-testid="loading-icon">Loading</div>
}))

describe('SearchPage [isbn]', () => {
    test('should export default SearchPage component', () => {
        expect(SearchPage).toBeDefined()
        expect(typeof SearchPage).toBe('function')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import services from api', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import { services } from '@/services/api'")
    })

    test('should import useEffect and useState hooks', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useEffect')
        expect(content).toContain('useState')
    })

    test('should import BookCreateForm component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BookCreateForm')
    })

    test('should import BackButton component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BackButton')
    })

    test('should import Empty component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('Empty')
    })

    test('should have SearchPageProps interface', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('SearchPageProps')
        expect(content).toContain('params')
        expect(content).toContain('isbn')
    })

    test('should have searchFromBrasilApi function', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('searchFromBrasilApi')
        expect(content).toContain('brasilapi')
    })

    test('should have useToastify hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useToastify')
    })
})
