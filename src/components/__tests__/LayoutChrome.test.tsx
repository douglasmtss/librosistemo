import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Mock dinâmico deve ser antes de importar o componente
jest.mock('next/dynamic', () => {
    return function MockDynamic() {
        return function MockedLayoutMenu(): React.JSX.Element {
            return <div data-testid="layout-menu">Mocked Layout Menu</div>
        }
    }
})

jest.mock('next/link', () => {
    const MockLink = ({
        children,
        href,
        target
    }: {
        children: React.ReactNode
        href: string
        target?: string
    }): React.JSX.Element => (
        <a href={href} target={target}>
            {children}
        </a>
    )

    return MockLink
})

jest.mock('@/config/info', () => ({
    configInfo: {
        appName: 'Test App',
        appDescription: 'Test Description',
        appManual: 'https://example.com/manual'
    }
}))

import LayoutChrome from '../LayoutChrome'

describe('LayoutChrome', () => {
    test('should render children inside the content area', () => {
        render(
            <LayoutChrome>
                <div data-testid="page-content">Conteúdo da página</div>
            </LayoutChrome>
        )

        expect(screen.getByTestId('page-content')).toBeInTheDocument()
        expect(screen.getByText('Conteúdo da página')).toBeInTheDocument()
    })

    test('should render header with LayoutMenu', () => {
        render(
            <LayoutChrome>
                <div>children</div>
            </LayoutChrome>
        )

        const header = screen.getByRole('banner')
        expect(header).toBeInTheDocument()
        expect(header).toContainElement(screen.getByTestId('layout-menu'))
    })

    test('should render footer with Manual link', () => {
        render(
            <LayoutChrome>
                <div>children</div>
            </LayoutChrome>
        )

        const footer = screen.getByRole('contentinfo')
        expect(footer).toBeInTheDocument()

        const manualLink = screen.getByRole('link', { name: 'Manual' })
        expect(footer).toContainElement(manualLink)
        expect(manualLink).toHaveAttribute('href', 'https://example.com/manual')
        expect(manualLink).toHaveAttribute('target', '__blank')
    })

    test('should keep chrome order: header, content, footer', () => {
        const { container } = render(
            <LayoutChrome>
                <div data-testid="page-content">children</div>
            </LayoutChrome>
        )

        const [header, content, footer] = Array.from(container.children)
        expect(header.tagName).toBe('HEADER')
        expect(content).toContainElement(screen.getByTestId('page-content'))
        expect(footer.tagName).toBe('FOOTER')
    })
})
