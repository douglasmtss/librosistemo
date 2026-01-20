import '@testing-library/jest-dom'

jest.mock('@/services/api', () => ({
    services: {
        brasilapi: jest.fn(),
        google: jest.fn(),
    }
}))

jest.mock('@/components/Empty', () => {
    return function MockEmpty() {
        return <div data-testid="empty">Empty</div>
    }
})

jest.mock('@/components/BookCreateForm', () => {
    return function MockBookCreateForm() {
        return <div data-testid="book-form">BookCreateForm</div>
    }
})

jest.mock('@/components/Img', () => {
    return function MockImg() {
        return <div data-testid="img">Img</div>
    }
})

jest.mock('@/components/BackButton', () => {
    return function MockBackButton() {
        return <div data-testid="back-button">BackButton</div>
    }
})

jest.mock('@/hooks/useToastify', () => ({
    useToastify: () => ({
        toast: jest.fn()
    })
}))

jest.mock('react-icons/ai', () => ({
    AiOutlineLoading3Quarters: () => <div data-testid="loading-icon">Loading</div>
}))

describe('SearchPage [isbn]', () => {
    test('should export default SearchPage component', () => {
        const SearchPage = require('../pages/dashboard/book-registration/[isbn]/page').default
        
        expect(SearchPage).toBeDefined()
        expect(typeof SearchPage).toBe('function')
    })

    test('should be a client component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import services from api', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain("import { services } from '@/services/api'")
    })

    test('should import useEffect and useState hooks', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useEffect')
        expect(content).toContain('useState')
    })

    test('should import BookCreateForm component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BookCreateForm')
    })

    test('should import BackButton component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BackButton')
    })

    test('should import Empty component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('Empty')
    })

    test('should have SearchPageProps interface', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('SearchPageProps')
        expect(content).toContain('params')
        expect(content).toContain('isbn')
    })

    test('should have searchFromBrasilApi function', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('searchFromBrasilApi')
        expect(content).toContain('brasilapi')
    })

    test('should have useToastify hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/[isbn]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useToastify')
    })
})
