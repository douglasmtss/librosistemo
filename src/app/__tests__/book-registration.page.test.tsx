import React from 'react'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'

jest.mock('@/components/BackButton', () => {
    return function MockBackButton(): React.JSX.Element {
        return <div data-testid="back-button">Back Button</div>
    }
})

import BookRegistration from '../pages/dashboard/book-registration/page'

describe('BookRegistration Page', () => {
    test('should render book registration page', () => {
        const component = BookRegistration()

        expect(component).toBeTruthy()
    })

    test('should return React.ReactNode', () => {
        const component = BookRegistration()

        expect(component).toBeDefined()
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })
})
