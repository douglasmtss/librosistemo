import React from 'react'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'
import ManualRegister from '../pages/dashboard/book-registration/manual/page'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            books: {
                post: jest.fn(),
                get: jest.fn(),
                list: jest.fn(),
                delete: jest.fn(),
                update: jest.fn(),
                put: jest.fn()
            }
        }
    },
    services: {
        brasilapi: jest.fn(),
        google: jest.fn()
    }
}))

jest.mock('@/components/SelectPhoto', () => {
    return function MockSelectPhoto(): React.JSX.Element {
        return <div data-testid="select-photo">SelectPhoto</div>
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
        useToastify: () => { toast: jest.Mock }
    } => ({
        useToastify: () => ({
            toast: jest.fn()
        })
    })
)

jest.mock('react-icons/im', () => ({
    ImCamera: (): React.JSX.Element => <div data-testid="camera-icon">Camera</div>
}))

jest.mock(
    'next/navigation',
    (): {
        useRouter: () => { push: jest.Mock; back: jest.Mock }
    } => ({
        useRouter: () => ({
            push: jest.fn(),
            back: jest.fn()
        })
    })
)

jest.mock(
    'uuid',
    (): {
        v4: () => string
    } => ({
        v4: () => 'test-uuid-1234'
    })
)

describe('ManualRegister Page', () => {
    test('should export default ManualRegister component', () => {
        expect(ManualRegister).toBeDefined()
        expect(typeof ManualRegister).toBe('function')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/manual/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/manual/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import SelectPhoto component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/manual/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('SelectPhoto')
    })

    test('should import BackButton component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/manual/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BackButton')
    })

    test('should import useRouter hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/manual/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useRouter')
    })

    test('should import useToastify hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/manual/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useToastify')
    })

    test('should use useState hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/manual/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useState')
    })

    test('should have initialState for form', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/manual/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('initialState')
        expect(content).toContain('isbn')
        expect(content).toContain('title')
    })

    test('should have form submission capability', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/manual/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('handleSubmit')
        expect(content).toContain('api.sheet.books')
        expect(content).toContain('.post')
    })
})
