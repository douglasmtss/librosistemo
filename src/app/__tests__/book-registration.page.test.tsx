import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('@/components/BackButton', () => {
    return function MockBackButton() {
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
        const fs = require('fs')
        const path = require('path')
        const filePath = path.join(__dirname, '../pages/dashboard/book-registration/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })
})
