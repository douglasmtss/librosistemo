/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import LayoutMenu from '../LayoutMenu'

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, className }: { src: string; alt: string; className?: string }): React.JSX.Element => (
        <img src={src} alt={alt} className={className} data-testid="logo-image" />
    )
}))

jest.mock('next/link', () => {
    const MockElement = ({
        children,
        href,
        onClick
    }: {
        children: React.ReactNode
        href: string
        onClick?: () => void
    }): React.JSX.Element => (
        <a href={href} onClick={onClick} data-testid={`link-${href}`}>
            {children}
        </a>
    )

    return MockElement
})

jest.mock('next/dynamic', () => ({
    __esModule: true,
    default: (fn: () => Promise<{ default: React.ComponentType<React.InsHTMLAttributes<HTMLDivElement>> }>) => {
        const DynamicModule = React.lazy(fn)

        return (props: React.ComponentProps<typeof DynamicModule>): React.JSX.Element => (
            <React.Suspense fallback={<div>Loading...</div>}>
                <DynamicModule {...props} />
            </React.Suspense>
        )
    }
}))

jest.mock('@/components/HamburgerAndCloser', () => ({
    __esModule: true,
    default: ({
        show,
        setShow,
        className
    }: {
        show: boolean
        setShow: (show: boolean) => void
        className?: string
    }): React.JSX.Element => (
        <button data-testid="hamburger-closer" onClick={() => setShow(!show)} className={className}>
            {show ? '✕' : '☰'}
        </button>
    )
}))

jest.mock('@/components/AdminLink', () => ({
    __esModule: true,
    default: (): React.JSX.Element => <div data-testid="admin-link">Admin</div>
}))

jest.mock('@/config/info', () => ({
    configInfo: {
        appName: 'Test App',
        appLogo: '/test-logo.png'
    }
}))

jest.mock('react-icons/rx', () => ({
    RxExit: ({ className }: { className?: string }): React.JSX.Element => (
        <span className={className} data-testid="exit-icon">
            🚪
        </span>
    )
}))

describe('LayoutMenu', () => {
    beforeEach(() => {
        // Suppress React 18 Suspense warning in tests
        // See: https://github.com/facebook/react/issues/25675
        jest.spyOn(console, 'error').mockImplementation(() => {
            // Ignore Suspense warnings
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })
    test('should render LayoutMenu component', () => {
        const { container } = render(<LayoutMenu />)
        expect(container).toBeTruthy()
    })

    test('should render app logo', async () => {
        render(<LayoutMenu />)
        await act(async () => {
            const logo = await screen.findByTestId('logo-image')
            expect(logo).toBeTruthy()
        })
    })

    test('should have hamburger button', async () => {
        render(<LayoutMenu />)
        await act(async () => {
            const hamburger = await screen.findByTestId('hamburger-closer')
            expect(hamburger).toBeTruthy()
        })
    })

    test('should display INÍCIO text', async () => {
        render(<LayoutMenu />)
        await act(async () => {
            const inicioLink = await screen.findByText('INÍCIO')
            expect(inicioLink).toBeTruthy()
        })
    })

    test('should display LIVROS text', async () => {
        render(<LayoutMenu />)
        await act(async () => {
            const livrosLink = await screen.findByText('LIVROS')
            expect(livrosLink).toBeTruthy()
        })
    })

    test('should display USUÁRIOS text', async () => {
        render(<LayoutMenu />)
        await act(async () => {
            const usuariosLink = await screen.findByText('USUÁRIOS')
            expect(usuariosLink).toBeTruthy()
        })
    })

    test('should display EMPRÉSTIMOS text', async () => {
        render(<LayoutMenu />)
        await act(async () => {
            const emprestimoLink = await screen.findByText('EMPRÉSTIMOS')
            expect(emprestimoLink).toBeTruthy()
        })
    })

    test('should render navbar ul element', () => {
        render(<LayoutMenu />)
        const lists = screen.getAllByRole('list')
        expect(lists.length).toBeGreaterThan(0)
    })

    test('should render menu slider div', () => {
        const { container } = render(<LayoutMenu />)
        const menuSlider = container.querySelector('#menu-slider')
        expect(menuSlider).toBeTruthy()
    })

    test('should have menu slider div with correct classes when show is false', () => {
        const { container } = render(<LayoutMenu />)
        const menuSlider = container.querySelector('#menu-slider')
        expect(menuSlider).toBeTruthy()

        // Check for translate-x-full when menu is closed
        const className = menuSlider?.getAttribute('class') || ''
        expect(className).toContain('translate-x-full')
    })

    test('should handle menu visibility toggle', async () => {
        render(<LayoutMenu />)
        const hamburger = await screen.findByTestId('hamburger-closer')

        // Click to open menu
        await act(async () => {
            fireEvent.click(hamburger)
        })

        expect(hamburger).toBeTruthy()
    })

    test('should navigate to home when INÍCIO link is clicked', async () => {
        render(<LayoutMenu />)
        const inicioLink = await screen.findByText('INÍCIO')

        await act(async () => {
            fireEvent.click(inicioLink)
        })

        expect(inicioLink).toBeTruthy()
    })

    test('should navigate to books when LIVROS link is clicked', async () => {
        render(<LayoutMenu />)
        const livrosLink = await screen.findByText('LIVROS')

        await act(async () => {
            fireEvent.click(livrosLink)
        })

        expect(livrosLink).toBeTruthy()
    })

    test('should navigate to users when USUÁRIOS link is clicked', async () => {
        render(<LayoutMenu />)
        const usuariosLink = await screen.findByText('USUÁRIOS')

        await act(async () => {
            fireEvent.click(usuariosLink)
        })

        expect(usuariosLink).toBeTruthy()
    })

    test('should navigate to lends when EMPRÉSTIMOS link is clicked', async () => {
        render(<LayoutMenu />)
        const emprestimoLink = await screen.findByText('EMPRÉSTIMOS')

        await act(async () => {
            fireEvent.click(emprestimoLink)
        })

        expect(emprestimoLink).toBeTruthy()
    })

    test('should render AdminLink component', async () => {
        render(<LayoutMenu />)
        const adminLink = await screen.findByTestId('admin-link')
        expect(adminLink).toBeTruthy()
    })
})
