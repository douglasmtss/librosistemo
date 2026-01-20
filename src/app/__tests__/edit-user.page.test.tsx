import React from 'react'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'
import EditUser from '../pages/dashboard/users/[rowIndex]/page'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            users: {
                get: jest.fn(),
                list: jest.fn(),
                delete: jest.fn(),
                update: jest.fn(),
                put: jest.fn()
            }
        }
    }
}))

jest.mock('@/components/UserEditForm', () => {
    return function MockUserEditForm(): React.JSX.Element {
        return <div data-testid="user-edit-form">UserEditForm</div>
    }
})

jest.mock('@/components/BackButton', () => {
    return function MockBackButton(): React.JSX.Element {
        return <div data-testid="back-button">BackButton</div>
    }
})

describe('EditUser Page [rowIndex]', () => {
    test('should export default EditUser component', () => {
        expect(EditUser).toBeDefined()
        expect(typeof EditUser).toBe('function')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import UserEditForm component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('UserEditForm')
    })

    test('should import BackButton component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BackButton')
    })

    test('should have EditUserProps interface', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('EditUserProps')
        expect(content).toContain('params')
        expect(content).toContain('rowIndex')
    })

    test('should use useState hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useState')
    })

    test('should use useEffect hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useEffect')
    })
})
