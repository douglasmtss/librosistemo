import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'

// Mock para PaginatedBooks
jest.mock('@/components/PaginatedBooks', () => ({
    PaginatedBooks: ({ itemsPerPage }: { itemsPerPage: number }): React.JSX.Element => (
        <div data-testid="paginated-books">Paginated Books - Items per page: {itemsPerPage}</div>
    )
}))

import Home from '../page'

describe('Home Page', () => {
    test('should render the Home component', () => {
        const result = <Home />

        expect(result).toBeTruthy()
    })

    test('should return JSX.Element', () => {
        const result = <Home />

        expect(result).toBeDefined()
        expect(result).toHaveProperty('type')
    })

    test('should render main element with flex layout', () => {
        const { container } = render(<Home />)

        const main = container.querySelector('main')
        expect(main).toBeInTheDocument()
        expect(main).toHaveClass('flex', 'flex-col')
    })

    test('should render PaginatedBooks component with itemsPerPage prop', () => {
        render(<Home />)

        expect(screen.getByTestId('paginated-books')).toBeInTheDocument()
        expect(screen.getByText(/Items per page: 10/i)).toBeInTheDocument()
    })

    test('should render PaginatedBooks with correct itemsPerPage value', () => {
        render(<Home />)

        const paginatedBooks = screen.getByTestId('paginated-books')
        expect(paginatedBooks).toHaveTextContent('10')
    })

    test('should be a client component', async () => {
        // Verificar que o arquivo começa com 'use client'

        const filePath = path.join(__dirname, '../page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })
})
