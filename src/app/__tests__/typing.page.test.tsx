import '@testing-library/jest-dom'
import React from 'react'
import fs from 'fs'
import path from 'path'
import Typing from '../pages/dashboard/book-registration/typing/page'

jest.mock('@/components/BackButton', () => {
    return function MockBackButton(): React.JSX.Element {
        return <div data-testid="back-button">Back Button</div>
    }
})

describe('Typing Page', () => {
    test('should export default Typing component', () => {
        expect(Typing).toBeDefined()
        expect(typeof Typing).toBe('function')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/typing/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should contain heading element', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/typing/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('<h2>')
        expect(content).toContain('Digite o código ISBN')
    })

    test('should contain input element for ISBN', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/typing/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('type="number"')
        expect(content).toContain('placeholder="123.45.678.912-3"')
    })

    test('should import BackButton component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/typing/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BackButton')
    })

    test('should import Link from next/link', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/typing/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import Link from 'next/link'")
    })

    test('should use useState hook', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/typing/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useState')
    })

    test('should have Cancelar link', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/typing/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('Cancelar')
    })

    test('should have Pesquisar link/button', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/typing/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('Pesquisar')
    })
})
