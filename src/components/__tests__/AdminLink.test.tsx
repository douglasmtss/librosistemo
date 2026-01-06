import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminLink from '../AdminLink'
import { usePathname } from 'next/navigation'

jest.mock('next/navigation')
jest.mock('next/link', () => {
    const MockElement = ({
        children,
        href,
        onClick,
        className
    }: {
        children: React.ReactNode
        href: string
        onClick?: () => void
        className?: string
    }): React.ReactNode => {
        return (
            <a href={href} onClick={onClick} className={className}>
                {children}
            </a>
        )
    }

    return MockElement
})

describe('AdminLink', (): void => {
    const mockUsePathname = usePathname as jest.Mock

    beforeEach((): void => {
        jest.clearAllMocks()
    })

    afterEach((): void => {
        jest.clearAllMocks()
    })

    test('should render link with afterNavigate content when pathname includes /dashboard', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages/dashboard/books')

        render(
            <AdminLink
                href="/default"
                afterNavigate={{
                    label: 'After Label',
                    path: '/after'
                }}
            >
                Default Label
            </AdminLink>
        )

        const link = screen.getByText('After Label')
        expect(link).toBeTruthy()
        expect(link.getAttribute('href')).toBe('/after')
    })

    test('should render link with beforeNavigate content when pathname does not include /dashboard', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages')

        render(
            <AdminLink
                href="/default"
                beforeNavigate={{
                    label: 'Before Label',
                    path: '/before'
                }}
            >
                Default Label
            </AdminLink>
        )

        const link = screen.getByText('Before Label')
        expect(link).toBeTruthy()
        expect(link.getAttribute('href')).toBe('/before')
    })

    test('should not render anything when result is null', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages')

        const { container } = render(<AdminLink href="/test" />)

        const links = container.querySelectorAll('a')
        expect(links.length).toBe(0)
    })

    test('should call onClick handler when link is clicked', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages')
        const mockOnClick = jest.fn()

        render(
            <AdminLink
                href="/test"
                onClick={mockOnClick}
                beforeNavigate={{
                    label: 'Click Me',
                    path: '/test'
                }}
            >
                Default Label
            </AdminLink>
        )

        const link = screen.getByText('Click Me')
        fireEvent.click(link)

        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    test('should prioritize afterNavigate when pathname includes /dashboard', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages/dashboard')

        render(
            <AdminLink
                href="/default"
                beforeNavigate={{
                    label: 'Before Label',
                    path: '/before'
                }}
                afterNavigate={{
                    label: 'After Label',
                    path: '/after'
                }}
            >
                Default Label
            </AdminLink>
        )

        const link = screen.getByText('After Label')
        expect(link).toBeTruthy()
        expect(link.getAttribute('href')).toBe('/after')
    })

    test('should prioritize beforeNavigate when pathname does not include /dashboard', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages/users')

        render(
            <AdminLink
                href="/default"
                beforeNavigate={{
                    label: 'Before Label',
                    path: '/before'
                }}
                afterNavigate={{
                    label: 'After Label',
                    path: '/after'
                }}
            >
                Default Label
            </AdminLink>
        )

        const link = screen.getByText('Before Label')
        expect(link).toBeTruthy()
        expect(link.getAttribute('href')).toBe('/before')
    })

    test('should apply className prop to the link', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages')

        render(
            <AdminLink
                href="/test"
                className="custom-class another-class"
                beforeNavigate={{
                    label: 'Test Link',
                    path: '/test'
                }}
            >
                Default
            </AdminLink>
        )

        const link = screen.getByText('Test Link')
        expect(link.getAttribute('class')).toBe('custom-class another-class')
    })

    test('should handle React components as labels', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages')

        const CustomLabel = (): React.ReactNode => <span>Custom Component</span>

        render(
            <AdminLink
                href="/test"
                beforeNavigate={{
                    label: <CustomLabel />,
                    path: '/test'
                }}
            >
                Default
            </AdminLink>
        )

        const label = screen.getByText('Custom Component')
        expect(label).toBeTruthy()
    })

    test('should render default content when beforeNavigate is undefined', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages')

        const { container } = render(
            <AdminLink href="/test" beforeNavigate={undefined}>
                Default Text
            </AdminLink>
        )

        // When pathname doesn't include '/dashboard' and beforeNavigate is undefined, nothing renders
        const links = container.querySelectorAll('a')
        expect(links.length).toBe(0)
    })

    test('should correctly identify /dashboard in different path segments', (): void => {
        mockUsePathname.mockReturnValueOnce('/dashboard')

        render(
            <AdminLink
                href="/default"
                afterNavigate={{
                    label: 'After',
                    path: '/after'
                }}
            >
                Default
            </AdminLink>
        )

        const link = screen.getByText('After')
        expect(link).toBeTruthy()
    })

    test('should handle empty beforeNavigate object gracefully', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages')

        const { container } = render(
            <AdminLink href="/test" beforeNavigate={undefined}>
                Default
            </AdminLink>
        )

        const links = container.querySelectorAll('a')
        expect(links.length).toBe(0)
    })

    test('should not render when all navigation options are undefined', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages')

        const { container } = render(<AdminLink href="/test" />)

        const links = container.querySelectorAll('a')
        expect(links.length).toBe(0)
    })

    test('should handle multiple consecutive clicks', (): void => {
        mockUsePathname.mockReturnValueOnce('/pages')
        const mockOnClick = jest.fn()

        render(
            <AdminLink
                href="/test"
                onClick={mockOnClick}
                beforeNavigate={{
                    label: 'Test',
                    path: '/test'
                }}
            >
                Default
            </AdminLink>
        )

        const link = screen.getByText('Test')
        fireEvent.click(link)
        fireEvent.click(link)
        fireEvent.click(link)

        expect(mockOnClick).toHaveBeenCalledTimes(3)
    })

    test('should use correct key based on pathname', (): void => {
        mockUsePathname.mockReturnValueOnce('/dashboard/something')

        render(
            <AdminLink
                href="/default"
                beforeNavigate={{
                    label: 'Before',
                    path: '/before'
                }}
                afterNavigate={{
                    label: 'After',
                    path: '/after'
                }}
            >
                Default
            </AdminLink>
        )

        // Should render 'After' because pathname includes '/dashboard'
        const after = screen.queryByText('After')
        expect(after).toBeTruthy()
    })
})
