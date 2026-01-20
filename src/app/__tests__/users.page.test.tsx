import '@testing-library/jest-dom'

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
    return function MockEmpty() {
        return <div data-testid="empty">Empty</div>
    }
})

jest.mock('@/components/PaginatedUserItems', () => {
    return function MockPaginatedUserItems() {
        return <div data-testid="paginated-users">PaginatedUserItems</div>
    }
})

jest.mock('@/components/Loading', () => {
    return function MockLoading() {
        return <div data-testid="loading">Loading</div>
    }
})

jest.mock('@/components/BackButton', () => {
    return function MockBackButton() {
        return <div data-testid="back-button">BackButton</div>
    }
})

describe('Users Page', () => {
    test('should export default Users component', () => {
        const Users = require('../pages/dashboard/users/page').default
        
        expect(Users).toBeDefined()
        expect(typeof Users).toBe('function')
    })

    test('should be a client component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import PaginatedUserItems component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('PaginatedUserItems')
    })

    test('should import BackButton component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BackButton')
    })

    test('should import Loading component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('Loading')
    })

    test('should import Empty component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('Empty')
    })

    test('should use useState hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useState')
    })

    test('should use useEffect hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useEffect')
    })

    test('should have handleDelete function', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('handleDelete')
    })

    test('should have filtering functionality', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('handleChange')
        expect(content).toContain('filteredUsers')
    })
})
