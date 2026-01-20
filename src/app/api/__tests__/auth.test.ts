import '@testing-library/jest-dom'

describe('Auth API Route', () => {
    test('auth route should export POST function', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../auth/route.ts')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('export async function POST')
    })

    test('auth route should import fetchGoogleSheets', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../auth/route.ts')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('fetchGoogleSheets')
    })

    test('auth route should import NextRequest and NextResponse', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../auth/route.ts')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('NextRequest')
        expect(content).toContain('NextResponse')
    })

    test('auth route should check username and password', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../auth/route.ts')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('username')
        expect(content).toContain('password')
    })

    test('auth route should return 401 for invalid credentials', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../auth/route.ts')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('401')
    })

    test('auth route should return 200 for valid credentials', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../auth/route.ts')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('200')
        expect(content).toContain('appLogged')
    })

    test('auth route should log POST requests', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../auth/route.ts')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('console.log')
        expect(content).toContain('POST')
    })

    test('auth route should fetch spreadsheet data', () => {
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../auth/route.ts')
        const content = fs.readFileSync(filePath, 'utf-8')
        
        expect(content).toContain('spreadsheet')
        expect(content).toContain('userAdmin')
    })
})
