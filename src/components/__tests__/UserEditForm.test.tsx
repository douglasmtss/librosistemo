import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserEditForm from '../UserEditForm'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useToastify } from '@/hooks/useToastify'

jest.mock('@/services/api')
jest.mock('next/navigation')
jest.mock('@/hooks/useToastify')
jest.mock('next/link', () => {
    const MockElement = ({ children, href }: { children: React.ReactNode; href: string }): React.ReactNode => {
        return <a href={href}>{children}</a>
    }

    return MockElement
})

describe('UserEditForm', (): void => {
    const mockPush = jest.fn()
    const mockToast = jest.fn()
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation()

    const defaultProps = {
        id: '123',
        first_name: 'João',
        last_name: 'Silva',
        phone: '11999999999',
        rowIndex: '0'
    }

    beforeEach((): void => {
        jest.clearAllMocks()
        ;(useRouter as jest.Mock).mockReturnValue({
            push: mockPush
        })
        ;(useToastify as jest.Mock).mockReturnValue({
            toast: mockToast
        })
        ;(api.sheet.users.put as jest.Mock).mockResolvedValue({ status: 200 })
    })

    afterEach((): void => {
        jest.clearAllMocks()
        mockConsoleError.mockClear()
    })

    test('should render the form with initial values', (): void => {
        render(<UserEditForm {...defaultProps} />)

        const firstNameInput = screen.getByDisplayValue('João') as HTMLInputElement
        const lastNameInput = screen.getByDisplayValue('Silva') as HTMLInputElement
        const phoneInput = screen.getByDisplayValue('11999999999') as HTMLInputElement

        expect(firstNameInput.value).toBe('João')
        expect(lastNameInput.value).toBe('Silva')
        expect(phoneInput.value).toBe('11999999999')
        expect(screen.getByText('Formulário de Edição')).toBeTruthy()
    })

    test('should update first_name when input changes', (): void => {
        render(<UserEditForm {...defaultProps} />)

        const firstNameInput = screen.getByPlaceholderText('Primeiro nome') as HTMLInputElement

        fireEvent.change(firstNameInput, { target: { value: 'Maria' } })

        expect(firstNameInput.value).toBe('Maria')
    })

    test('should update last_name when input changes', (): void => {
        render(<UserEditForm {...defaultProps} />)

        const lastNameInput = screen.getByPlaceholderText('Sobrenome') as HTMLInputElement

        fireEvent.change(lastNameInput, { target: { value: 'Santos' } })

        expect(lastNameInput.value).toBe('Santos')
    })

    test('should update phone when input changes', (): void => {
        render(<UserEditForm {...defaultProps} />)

        const phoneInput = screen.getByPlaceholderText('Telefone') as HTMLInputElement

        fireEvent.change(phoneInput, { target: { value: '21988888888' } })

        expect(phoneInput.value).toBe('21988888888')
    })

    test('should submit form with success', async (): Promise<void> => {
        render(<UserEditForm {...defaultProps} />)

        const firstNameInput = screen.getByPlaceholderText('Primeiro nome') as HTMLInputElement
        fireEvent.change(firstNameInput, { target: { value: 'Maria' } })

        const submitButton = screen.getByRole('button', { name: /Salvar/i })
        fireEvent.click(submitButton)

        await waitFor((): void => {
            expect(api.sheet.users.put).toHaveBeenCalledWith('123', {
                first_name: 'Maria',
                last_name: 'Silva',
                phone: '11999999999'
            })
        })

        await waitFor((): void => {
            expect(mockToast).toHaveBeenCalledWith('Alterações salvas com sucesso!', 'success')
        })

        await waitFor((): void => {
            expect(mockPush).toHaveBeenCalledWith('/pages/dashboard/users')
        })
    })

    test('should show warning toast when response status is not 200', async (): Promise<void> => {
        ;(api.sheet.users.put as jest.Mock).mockResolvedValueOnce({ status: 400 })

        render(<UserEditForm {...defaultProps} />)

        const submitButton = screen.getByRole('button', { name: /Salvar/i })
        fireEvent.click(submitButton)

        await waitFor((): void => {
            expect(mockToast).toHaveBeenCalledWith('Alterações não foram salvas!', 'warning')
        })
    })

    test('should show error toast when API call fails', async (): Promise<void> => {
        const mockError = new Error('API Error')
        ;(api.sheet.users.put as jest.Mock).mockRejectedValueOnce(mockError)

        render(<UserEditForm {...defaultProps} />)

        const submitButton = screen.getByRole('button', { name: /Salvar/i })
        fireEvent.click(submitButton)

        await waitFor((): void => {
            expect(mockToast).toHaveBeenCalledWith('Erro ao tentar salvar as alterações', 'error')
        })

        await waitFor((): void => {
            expect(mockConsoleError).toHaveBeenCalledWith('Error trying save changes', mockError)
        })
    })

    test('should not submit form when id is not provided', async (): Promise<void> => {
        const propsWithoutId = { ...defaultProps, id: undefined as unknown as string }

        render(<UserEditForm {...propsWithoutId} />)

        const submitButton = screen.getByRole('button', { name: /Salvar/i })
        fireEvent.click(submitButton)

        await waitFor((): void => {
            expect(api.sheet.users.put).not.toHaveBeenCalled()
        })
    })

    test('should update initial values when props change', (): void => {
        const { rerender } = render(<UserEditForm {...defaultProps} />)

        const firstNameInput = screen.getByDisplayValue('João') as HTMLInputElement
        expect(firstNameInput.value).toBe('João')

        const newProps = {
            ...defaultProps,
            first_name: 'Pedro',
            last_name: 'Oliveira',
            phone: '31987654321'
        }

        rerender(<UserEditForm {...newProps} />)

        const updatedFirstNameInput = screen.getByDisplayValue('Pedro') as HTMLInputElement
        expect(updatedFirstNameInput.value).toBe('Pedro')
    })

    test('should render cancel link with correct href', (): void => {
        render(<UserEditForm {...defaultProps} />)

        const cancelLink = screen.getByRole('link') as HTMLAnchorElement
        expect(cancelLink.href).toContain('/pages/dashboard')
        expect(cancelLink.textContent).toBe('Cancelar')
    })

    test('should handle multiple field updates before submit', async (): Promise<void> => {
        render(<UserEditForm {...defaultProps} />)

        const firstNameInput = screen.getByPlaceholderText('Primeiro nome') as HTMLInputElement
        const lastNameInput = screen.getByPlaceholderText('Sobrenome') as HTMLInputElement
        const phoneInput = screen.getByPlaceholderText('Telefone') as HTMLInputElement

        fireEvent.change(firstNameInput, { target: { value: 'Ana' } })
        fireEvent.change(lastNameInput, { target: { value: 'Costa' } })
        fireEvent.change(phoneInput, { target: { value: '85999999999' } })

        const submitButton = screen.getByRole('button', { name: /Salvar/i })
        fireEvent.click(submitButton)

        await waitFor((): void => {
            expect(api.sheet.users.put).toHaveBeenCalledWith('123', {
                first_name: 'Ana',
                last_name: 'Costa',
                phone: '85999999999'
            })
        })
    })
})
