import '@testing-library/jest-dom'

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
    return function MockUserEditForm() {
        return <div data-testid="user-edit-form">UserEditForm</div>
    }
})

jest.mock('@/components/BackButton', () => {
    return function MockBackButton() {
        return <div data-testid="back-button">BackButton</div>
    }
})

describe('EditUser Page [rowIndex]', () => {
    test('should export default EditUser component', () => {
        const EditUser = require('../pages/dashboard/users/[rowIndex]/page').default
        
        expect(EditUser).toBeDefined()
        expect(typeof EditUser).toBe('function')
    })

    test('should be a client component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should import api from services', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain("import { api } from '@/services/api'")
    })

    test('should import UserEditForm component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('UserEditForm')
    })

    test('should import BackButton component', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('BackButton')
    })

    test('should have EditUserProps interface', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('EditUserProps')
        expect(content).toContain('params')
        expect(content).toContain('rowIndex')
    })

    test('should use useState hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useState')
    })

    test('should use useEffect hook', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/users/[rowIndex]/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('useEffect')
    })
})
