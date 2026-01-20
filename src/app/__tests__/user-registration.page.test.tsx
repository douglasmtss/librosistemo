import '@testing-library/jest-dom'
import React from 'react'
import fs from 'fs'
import path from 'path'
import UserRegister from '../pages/dashboard/users/user-registration/page'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            users: {
                post: jest.fn(),
                get: jest.fn(),
                list: jest.fn(),
                delete: jest.fn(),
                update: jest.fn(),
                put: jest.fn()
            }
        }
    }
}))

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

describe('UserRegister Page', () => {
    test('should export default UserRegister component', () => {
        expect(UserRegister).toBeDefined()
        expect(typeof UserRegister).toBe('function')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import BackButton component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BackButton')
    })

    test('should import useRouter hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useRouter')
    })

    test('should import useToastify hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useToastify')
    })

    test('should use useState hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useState')
    })

    test('should have initialState for form', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('initialState')
        expect(content).toContain('first_name')
        expect(content).toContain('last_name')
        expect(content).toContain('phone')
    })

    test('should have form submission capability', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('handleSubmit')
        expect(content).toContain('api.sheet.users')
        expect(content).toContain('.post')
    })

    test('should have cancel link', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('Cancelar')
    })
})
