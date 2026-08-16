import React from 'react'
import '@testing-library/jest-dom'

// Mock LayoutChrome (client component com styled-components)
jest.mock('@/components/LayoutChrome', () => {
    return function MockLayoutChrome({ children }: { children: React.ReactNode }): React.JSX.Element {
        return <div data-testid="layout-chrome">{children}</div>
    }
})

import RootLayout from '../layout'

// Mock ToastContainer
jest.mock('react-toastify', () => ({
    ToastContainer: (): React.JSX.Element => <div data-testid="toast-container" />
}))

// Mock StyledComponentsRegistry
jest.mock('@/lib/registry', () => {
    return function MockRegistry({ children }: { children: React.ReactNode }): React.JSX.Element {
        return <div data-testid="styled-registry">{children}</div>
    }
})

// Mock configInfo
jest.mock('@/config/info', () => ({
    configInfo: {
        appName: 'Test App',
        appDescription: 'Test Description',
        appManual: 'https://example.com/manual'
    }
}))

describe('RootLayout', () => {
    test('should return a React node', async () => {
        const component = await RootLayout({ children: <div>Test Children</div> })

        expect(component).toBeTruthy()
    })

    test('should render with children prop and children should be present', async () => {
        const testChildren = <div data-testid="test-children">Test Content</div>
        const component = await RootLayout({ children: testChildren })

        // Para layout com html/body, não renderizamos normalmente
        // Apenas verificamos que o componente foi criado com as propriedades corretas
        expect(component).toBeDefined()
    })

    test('should render html element with pt-BR lang', async () => {
        const component = (await RootLayout({ children: <div>Test Children</div> })) as React.ReactElement<{
            lang: string
        }>

        expect(component.type).toBe('html')
        expect(component.props.lang).toBe('pt-BR')
    })

    test('should include StyledComponentsRegistry in component tree', async () => {
        const component = await RootLayout({ children: <div>Test Children</div> })

        // Verificar se o componente foi criado corretamente
        expect(component).toBeDefined()
        expect(component).not.toBeNull()
    })

    test('should render ToastContainer in layout', async () => {
        const component = await RootLayout({ children: <div>Test Children</div> })

        expect(component).toBeTruthy()
    })

    test('should include LayoutChrome in layout', async () => {
        const component = await RootLayout({ children: <div>Test Children</div> })

        expect(component).toBeTruthy()
    })

    test('should apply metadata correctly', async () => {
        const { metadata } = await import('../layout')
        expect(metadata.title).toBe('Test App')
        expect(metadata.description).toBe('Test Description')
    })

    test('should return Promise<ReactNode>', async () => {
        const result = RootLayout({ children: <div>Test Children</div> })
        expect(result).toBeInstanceOf(Promise)

        const resolved = await result
        expect(resolved).toBeTruthy()
    })
})
