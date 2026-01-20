import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'
import Users from '../pages/dashboard/users/page'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
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

jest.mock('@/components/PaginatedUserItems', () => {
    return function MockPaginatedUserItems(): React.JSX.Element {
        return <div data-testid="paginated-users">PaginatedUserItems</div>
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

describe('Users Page', () => {
    test('should export default Users component', () => {
        expect(Users).toBeDefined()
        expect(typeof Users).toBe('function')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import PaginatedUserItems component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('PaginatedUserItems')
    })

    test('should import BackButton component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BackButton')
    })

    test('should import Loading component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('Loading')
    })

    test('should import Empty component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('Empty')
    })

    test('should use useState hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useState')
    })

    test('should use useEffect hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useEffect')
    })

    test('should have handleDelete function', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('handleDelete')
    })

    test('should have filtering functionality', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('handleChange')
        expect(content).toContain('filteredUsers')
    })
})
