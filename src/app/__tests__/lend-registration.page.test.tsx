import '@testing-library/jest-dom'

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            lends: {
                post: jest.fn(),
                get: jest.fn(),
                list: jest.fn(),
                delete: jest.fn(),
                update: jest.fn(),
                put: jest.fn()
            },
            books: {
                get: jest.fn(),
                list: jest.fn(),
                put: jest.fn()
            },
            users: {
                get: jest.fn(),
                list: jest.fn(),
                put: jest.fn()
            }
        }
    }
}))

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

jest.mock('@/hooks/useToastify', () => ({
    useToastify: () => ({
        toast: jest.fn()
    })
}))

jest.mock('@/hooks/useEntities', () => ({
    useEntities: jest.fn(() => ({
        books: [],
        users: [],
        lends: [],
        optionsBooks: [],
        optionsUsers: [],
        setBooks: jest.fn(),
        setUsers: jest.fn(),
        setLends: jest.fn(),
        loadingUsers: false,
        loadingBooks: false,
        loadingLends: false
    }))
}))

jest.mock('@/hooks/getBookAmountAndAvailable', () => ({
    getBookAmountAndAvailable: jest.fn(() => ({
        booksAvailable: 5,
        selectedBookAmount: 3
    }))
}))

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn()
    })
}))

jest.mock('react-icons/fa', () => ({
    FaPencilAlt: () => <div data-testid="edit-icon">Edit</div>
}))

jest.mock('react-select', () => {
    return function MockSelect() {
        return <div data-testid="select">Select</div>
    }
})

jest.mock('uuid', () => ({
    v4: () => 'test-uuid-1234'
}))

describe('LendRegistration Page', () => {
    test('should export default LendRegistration component', () => {
        const LendRegistration = require('../pages/dashboard/lends/lend-registration/page').default
        
        expect(LendRegistration).toBeDefined()
        expect(typeof LendRegistration).toBe('function')
    })

    test('should be a client component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import useEntities hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useEntities')
    })

    test('should import getBookAmountAndAvailable hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('getBookAmountAndAvailable')
    })

    test('should import Loading component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('Loading')
    })

    test('should import BackButton component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BackButton')
    })

    test('should import react-select', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain("import Select from 'react-select'")
    })

    test('should use useState hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useState')
    })

    test('should use useEffect hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useEffect')
    })

    test('should use useCallback hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useCallback')
    })

    test('should have user and book selection', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('userSelected')
        expect(content).toContain('bookSelected')
    })

    test('should use useRouter for navigation', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/lends/lend-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useRouter')
    })
})
