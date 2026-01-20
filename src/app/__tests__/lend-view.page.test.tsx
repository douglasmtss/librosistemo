import React from 'react'
import '@testing-library/jest-dom'
import LendView from '../pages/dashboard/lends/[rowIndex]/page'
import fs from 'fs'
import path from 'path'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            lends: {
                get: jest.fn(),
                list: jest.fn(),
                delete: jest.fn(),
                update: jest.fn(),
                put: jest.fn()
            },
            books: {
                list: jest.fn(),
                get: jest.fn(),
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

describe('LendView Page [rowIndex]', () => {
    test('should export default LendView component', () => {
        expect(LendView).toBeDefined()
        expect(typeof LendView).toBe('function')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/lends/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/lends/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import BackButton component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/lends/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BackButton')
    })

    test('should have LendViewProps interface', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/lends/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('LendViewProps')
        expect(content).toContain('params')
        expect(content).toContain('rowIndex')
    })

    test('should use useState hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/lends/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useState')
    })

    test('should use useEffect hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/lends/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useEffect')
    })

    test('should have handleDelete function', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/lends/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('handleDelete')
    })
})
