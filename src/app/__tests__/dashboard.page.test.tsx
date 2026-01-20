import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dashboard from '../pages/dashboard/page'

describe('Dashboard Page', () => {
    test('should render dashboard navigation links', () => {
        const component = <Dashboard />

        render(component)

        expect(screen.getByRole('link', { name: /livros/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /usuários/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /empréstimos/i })).toBeInTheDocument()
    })

    test('should have correct link hrefs', () => {
        const component = <Dashboard />

        render(component)

        const booksLink = screen.getByRole('link', { name: /livros/i })
        const usersLink = screen.getByRole('link', { name: /usuários/i })
        const lendsLink = screen.getByRole('link', { name: /empréstimos/i })

        expect(booksLink).toHaveAttribute('href', '/pages/dashboard/books')
        expect(usersLink).toHaveAttribute('href', '/pages/dashboard/users')
        expect(lendsLink).toHaveAttribute('href', '/pages/dashboard/lends')
    })

    test('should apply correct CSS classes to links', () => {
        const component = <Dashboard />

        render(component)

        const booksLink = screen.getByRole('link', { name: /livros/i })

        expect(booksLink).toHaveClass('py-2', 'px-4', 'bg-primary')
    })

    test('should render dashboard container with correct structure', () => {
        const component = <Dashboard />

        const { container } = render(component)

        const mainDiv = container.querySelector('.w-full.max-w-185.mx-auto')
        expect(mainDiv).toBeInTheDocument()
    })

    test('should return React.ReactNode', () => {
        const component = <Dashboard />

        expect(component).toBeTruthy()
    })
})
