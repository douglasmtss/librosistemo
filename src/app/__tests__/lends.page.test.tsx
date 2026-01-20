import '@testing-library/jest-dom'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            lends: {
                list: jest.fn(),
                get: jest.fn(),
                delete: jest.fn(),
                update: jest.fn()
            },
            books: {
                list: jest.fn(),
                get: jest.fn()
            }
        }
    }
}))

jest.mock('@/components/Empty', () => {
    return function MockEmpty() {
        return <div data-testid="empty">Empty</div>
    }
})

jest.mock('@/components/PaginatedLendsItems', () => {
    return function MockPaginatedLendsItems() {
        return <div data-testid="paginated-lends">PaginatedLendsItems</div>
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

jest.mock('@/hooks/useEntities', () => ({
    useEntities: jest.fn(() => ({
        books: [],
        lends: [],
        setLends: jest.fn(),
        filteredLends: [],
        setFilteredLends: jest.fn(),
        loadingLends: false
    }))
}))

describe('Lends Page', () => {
    test('should export default Lends component', () => {
        const Lends = require('../pages/dashboard/lends/page').default
        
        expect(Lends).toBeDefined()
        expect(typeof Lends).toBe('function')
    })

    test('should be a client component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import PaginatedLendsItems component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('PaginatedLendsItems')
    })

    test('should import BackButton component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BackButton')
    })

    test('should import Loading component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('Loading')
    })

    test('should import Empty component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('Empty')
    })

    test('should import useEntities hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useEntities')
    })

    test('should have handleDelete function', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('handleDelete')
    })

    test('should have filtering functionality', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('handleChange')
        expect(content).toContain('filteredLends')
    })

    test('should handle lends deletion', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('api.sheet.lends.delete')
    })
})
