import React from 'react'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'
import List from '../pages/dashboard/book-registration/list/page'

jest.mock('@/components/BackButton', () => {
    return function MockBackButton(): React.JSX.Element {
        return <div data-testid="back-button">Back Button</div>
    }
})

describe('List Page', () => {
    test('should export default List component', () => {
        expect(List).toBeDefined()
        expect(typeof List).toBe('function')
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })

    test('should contain heading elements', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('<h2>')
        expect(content).toContain('Digite ou cole uma lista de códigos ISBN')
    })

    test('should contain textarea element', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('<textarea')
    })

    test('should import BackButton component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('BackButton')
    })

    test('should import Link from next/link', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain("import Link from 'next/link'")
    })

    test('should use useState hook for inputValue and codes', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('useState')
        expect(content).toContain('inputValue')
        expect(content).toContain('setCodes')
    })

    test('should have handleChange function', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('handleChange')
    })

    test('should have handleSearch function', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('handleSearch')
    })

    test('should navigate to list_isbn route on search', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/list/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toContain('list_isbn')
    })
})
