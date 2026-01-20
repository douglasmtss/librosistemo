import '@testing-library/jest-dom'

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
    return function MockBackButton() {
        return <div data-testid="back-button">BackButton</div>
    }
})

jest.mock('@/hooks/useToastify', () => ({
    useToastify: () => ({
        toast: jest.fn()
    })
}))

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn()
    })
}))

jest.mock('uuid', () => ({
    v4: () => 'test-uuid-1234'
}))

describe('UserRegister Page', () => {
    test('should export default UserRegister component', () => {
        const UserRegister = require('../pages/dashboard/users/user-registration/page').default
        
        expect(UserRegister).toBeDefined()
        expect(typeof UserRegister).toBe('function')
    })

    test('should be a client component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import BackButton component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BackButton')
    })

    test('should import useRouter hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useRouter')
    })

    test('should import useToastify hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useToastify')
    })

    test('should use useState hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useState')
    })

    test('should have initialState for form', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('initialState')
        expect(content).toContain('first_name')
        expect(content).toContain('last_name')
        expect(content).toContain('phone')
    })

    test('should have form submission capability', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('handleSubmit')
        expect(content).toContain('api.sheet.users')
        expect(content).toContain('.post')
    })

    test('should have cancel link', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/user-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('Cancelar')
    })
})
