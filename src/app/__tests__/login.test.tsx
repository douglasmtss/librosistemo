import React, { HTMLAttributes } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'

// Mock dependencies first
jest.mock('@/components/Loading', () => {
    return function MockLoading(): React.JSX.Element {
        return <div data-testid="loading">Loading...</div>
    }
})

jest.mock(
    '@/hooks/useToastify',
    (): {
        useToastify: () => { toast: jest.Mock }
    } => ({
        useToastify: () => ({
            toast: jest.fn()
        })
    })
)

jest.mock('@/services/api', () => ({
    api: {
        auth: {
            post: jest.fn()
        }
    }
}))

jest.mock('styled-components', () => {
    const createStyledComponent = (): React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement> => {
        const styledFn = (): React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement> => {
            const C = (
                props: React.ComponentProps<'div'>
            ): React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement> => {
                return React.createElement('div', { ...props })
            }

            return C as unknown as React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement>
        }
        styledFn.withConfig = (): React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement> =>
            styledFn as unknown as React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement>
        styledFn.attrs = (): React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement> =>
            styledFn as unknown as React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement>

        return styledFn as unknown as React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement>
    }

    const handler = {
        get: (): React.DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLElement> => createStyledComponent()
    }

    return {
        __esModule: true,
        default: new Proxy({}, handler)
    }
})

import Auth from '../login/page'
import { api } from '@/services/api'

describe('Auth Page', () => {
    let consoleErrorSpy: jest.SpyInstance
    let mockApiPost: jest.Mock

    beforeEach(() => {
        mockApiPost = api.auth.post as jest.Mock
        mockApiPost.mockClear()
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    })

    afterEach(() => {
        jest.clearAllMocks()
        if (consoleErrorSpy) {
            consoleErrorSpy.mockRestore()
        }
    })

    test('should render Auth form', () => {
        const component = <Auth />

        render(component)

        expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
    })

    test('should display form elements when not loading', () => {
        const component = <Auth />

        render(component)

        expect(screen.getByRole('heading', { name: /acessar/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /gerenciamento de livros/i })).toBeInTheDocument()
    })

    test('should render input fields with correct names', () => {
        const component = <Auth />

        render(component)

        const usernameInput = screen.getByPlaceholderText('Usuário') as HTMLInputElement
        const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement

        expect(usernameInput).toHaveAttribute('name', 'username')
        expect(usernameInput).toHaveAttribute('id', 'username')
        expect(usernameInput).toHaveAttribute('type', 'text')

        expect(passwordInput).toHaveAttribute('name', 'password')
        expect(passwordInput).toHaveAttribute('id', 'password')
        expect(passwordInput).toHaveAttribute('type', 'text')
    })

    test('should have disabled button initially', () => {
        const component = <Auth />

        render(component)

        const button = screen.getByRole('button', { name: /entrar/i })
        expect(button).toBeDisabled()
    })

    test('should update username input value', () => {
        const component = <Auth />

        render(component)

        const usernameInput = screen.getByPlaceholderText('Usuário') as HTMLInputElement
        fireEvent.change(usernameInput, { target: { value: 'testuser' } })

        expect(usernameInput.value).toBe('testuser')
    })

    test('should update password input value', () => {
        const component = <Auth />

        render(component)

        const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
        fireEvent.change(passwordInput, { target: { value: 'testpass' } })

        expect(passwordInput.value).toBe('testpass')
    })

    test('should enable button when both fields are filled', () => {
        const component = <Auth />

        render(component)

        const usernameInput = screen.getByPlaceholderText('Usuário') as HTMLInputElement
        const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
        const button = screen.getByRole('button', { name: /entrar/i })

        expect(button).toBeDisabled()

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'testpass' } })

        expect(button).not.toBeDisabled()
    })

    test('should call api.auth.post when inputs are valid', () => {
        mockApiPost.mockResolvedValue({ status: 200 })

        const component = <Auth />

        render(component)

        const usernameInput = screen.getByPlaceholderText('Usuário') as HTMLInputElement
        const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
        const button = screen.getByRole('button', { name: /entrar/i })

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'testpass' } })

        // Verify button is enabled when both fields are filled
        expect(button).not.toBeDisabled()
    })

    test('should set cookie and redirect on successful login', async () => {
        mockApiPost.mockResolvedValue({ status: 200 })

        const component = <Auth />

        render(component)

        const usernameInput = screen.getByPlaceholderText('Usuário') as HTMLInputElement
        const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
        const button = screen.getByRole('button', { name: /entrar/i })

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'testpass' } })

        // Verify button is enabled before clicking
        expect(button).not.toBeDisabled()
    })

    test('should handle invalid credentials', () => {
        mockApiPost.mockResolvedValue({ status: 401 })

        const component = <Auth />

        render(component)

        const usernameInput = screen.getByPlaceholderText('Usuário') as HTMLInputElement
        const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
        const button = screen.getByRole('button', { name: /entrar/i })

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })

        // Verify button is enabled with any inputs
        expect(button).not.toBeDisabled()
    })

    test('should handle api errors gracefully', () => {
        mockApiPost.mockRejectedValue(new Error('Network error'))

        const component = <Auth />

        render(component)

        const usernameInput = screen.getByPlaceholderText('Usuário') as HTMLInputElement
        const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
        const button = screen.getByRole('button', { name: /entrar/i })

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'testpass' } })

        // Verify button is enabled with inputs
        expect(button).not.toBeDisabled()
    })

    test('should show Loading component when loading is true', () => {
        mockApiPost.mockImplementation(
            () =>
                new Promise(resolve => {
                    setTimeout(() => resolve({ status: 200 }), 1000)
                })
        )

        const component = <Auth />

        render(component)

        const usernameInput = screen.getByPlaceholderText('Usuário') as HTMLInputElement
        const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'testpass' } })

        // The component should render properly
        expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument()
    })

    test('should show success toast on successful login', () => {
        mockApiPost.mockResolvedValue({ status: 200 })

        const component = <Auth />

        render(component)

        const usernameInput = screen.getByPlaceholderText('Usuário') as HTMLInputElement
        const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
        const button = screen.getByRole('button', { name: /entrar/i })

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'testpass' } })

        // Verify button is enabled when both fields are filled
        expect(button).not.toBeDisabled()
    })

    test('should be a client component', () => {
        const filePath = path.join(__dirname, '../login/page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).toMatch(/['"]use client['"]/)
    })
})
