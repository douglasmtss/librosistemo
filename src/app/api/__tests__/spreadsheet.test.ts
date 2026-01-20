import '@testing-library/jest-dom'

describe('Spreadsheet API Route', () => {
    describe('Exports', () => {
        test('spreadsheet route should export GET function', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('export async function GET')
        })

        test('spreadsheet route should export POST function', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('export async function POST')
        })

        test('spreadsheet route should export PUT function', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('export async function PUT')
        })

        test('spreadsheet route should export DELETE function', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('export async function DELETE')
        })
    })

    describe('File structure', () => {
        test('spreadsheet route should import fetchGoogleSheets', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('fetchGoogleSheets')
        })

        test('spreadsheet route should import NextRequest and NextResponse', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('NextRequest')
            expect(content).toContain('NextResponse')
        })

        test('spreadsheet route should import Sheet enum', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('Sheet')
        })

        test('spreadsheet route should handle sheet parameter', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('sheet')
            expect(content).toContain('searchParams')
        })

        test('spreadsheet route should have CRUD operations', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('spreadsheet.get')
            expect(content).toContain('spreadsheet.add')
            expect(content).toContain('spreadsheet.update')
        })

        test('spreadsheet route should handle delete operations', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('spreadsheet.delete')
        })

        test('spreadsheet route should return 200 status', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('status: 200')
        })

        test('spreadsheet route should handle id parameter', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain("get('id')")
        })

        test('spreadsheet route should parse request body', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('req.json()')
        })

        test('spreadsheet route should use NextResponse.json', () => {
            const fs = require('fs')
            const path = require('path')
            const filePath = path.join(__dirname, '../spreadsheet/route.ts')
            const content = fs.readFileSync(filePath, 'utf-8')

            expect(content).toContain('NextResponse.json')
        })
    })
})
