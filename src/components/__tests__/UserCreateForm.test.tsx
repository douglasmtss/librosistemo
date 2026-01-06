import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserCreateForm from '../UserCreateForm'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'

jest.mock('next/link', () => {
    const MockElement = ({ children, href }: { children: React.ReactNode; href: string }): React.JSX.Element => (
        <a href={href} data-testid="next-link">
            {children}
        </a>
    )

    return MockElement
})

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            users: {
                post: jest.fn()
            }
        }
    }
}))

describe('UserCreateForm', () => {
    let mockRouter: { push: jest.Mock }

    beforeEach(() => {
        jest.clearAllMocks()
        mockRouter = {
            push: jest.fn()
        }
        ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const defaultProps = {
        first_name: 'John',
        last_name: 'Doe',
        phone: '123456789'
    }

    test('should render UserCreateForm component', () => {
        const { container } = render(<UserCreateForm {...defaultProps} />)
        expect(container).toBeTruthy()
    })

    test('should display form title', () => {
        render(<UserCreateForm {...defaultProps} />)
        expect(screen.getByText('Formulário de Edição')).toBeTruthy()
    })

    test('should render first_name input with initial value', () => {
        render(<UserCreateForm {...defaultProps} />)
        const input = screen.getByDisplayValue('John')
        expect(input).toBeTruthy()
    })

    test('should render last_name input with initial value', () => {
        render(<UserCreateForm {...defaultProps} />)
        const input = screen.getByDisplayValue('Doe')
        expect(input).toBeTruthy()
    })

    test('should render phone input with initial value', () => {
        render(<UserCreateForm {...defaultProps} />)
        const input = screen.getByDisplayValue('123456789')
        expect(input).toBeTruthy()
    })

    test('should render Cancelar button with correct href', () => {
        render(<UserCreateForm {...defaultProps} />)
        const cancelLink = screen.getByText('Cancelar')
        expect(cancelLink).toBeTruthy()
    })

    test('should render Cadastrar button', () => {
        render(<UserCreateForm {...defaultProps} />)
        const button = screen.getByText('Cadastrar')
        expect(button).toBeTruthy()
    })

    test('should update first_name on input change', () => {
        render(<UserCreateForm {...defaultProps} />)
        const input = screen.getByDisplayValue('John') as HTMLInputElement
        fireEvent.change(input, { target: { value: 'Jane' } })
        expect(input.value).toBe('Jane')
    })

    test('should update last_name on input change', () => {
        render(<UserCreateForm {...defaultProps} />)
        const input = screen.getByDisplayValue('Doe') as HTMLInputElement
        fireEvent.change(input, { target: { value: 'Smith' } })
        expect(input.value).toBe('Smith')
    })

    test('should update phone on input change', () => {
        render(<UserCreateForm {...defaultProps} />)
        const input = screen.getByDisplayValue('123456789') as HTMLInputElement
        fireEvent.change(input, { target: { value: '987654321' } })
        expect(input.value).toBe('987654321')
    })

    test('should call api.sheet.users.post on submit', async () => {
        ;(api.sheet.users.post as jest.Mock).mockResolvedValue({ status: 200 })

        render(<UserCreateForm {...defaultProps} />)
        const button = screen.getByText('Cadastrar')
        fireEvent.click(button)

        await waitFor(
            () => {
                expect(api.sheet.users.post).toHaveBeenCalled()
            },
            { timeout: 3000 }
        )
    })

    test('should push to users dashboard on successful submit', async () => {
        ;(api.sheet.users.post as jest.Mock).mockResolvedValue({ status: 200 })

        render(<UserCreateForm {...defaultProps} />)
        const button = screen.getByText('Cadastrar')
        fireEvent.click(button)

        await waitFor(
            () => {
                expect(mockRouter.push).toHaveBeenCalledWith('/pages/dashboard/users')
            },
            { timeout: 3000 }
        )
    })

    test('should handle empty first_name', () => {
        const props = { ...defaultProps, first_name: '' }
        render(<UserCreateForm {...props} />)
        expect(screen.getByPlaceholderText('Primeiro nome')).toBeTruthy()
    })

    test('should handle empty last_name', () => {
        const props = { ...defaultProps, last_name: '' }
        render(<UserCreateForm {...props} />)
        expect(screen.getByPlaceholderText('Sobrenome')).toBeTruthy()
    })

    test('should handle empty phone', () => {
        const props = { ...defaultProps, phone: '' }
        render(<UserCreateForm {...props} />)
        expect(screen.getByPlaceholderText('Telefone')).toBeTruthy()
    })

    test('should render form labels correctly', () => {
        render(<UserCreateForm {...defaultProps} />)
        expect(screen.getByText('Primeiro nome')).toBeTruthy()
        expect(screen.getByText('Sobrenome')).toBeTruthy()
        expect(screen.getByText('Telefone')).toBeTruthy()
    })

    test('should have correct input types', () => {
        render(<UserCreateForm {...defaultProps} />)
        const inputs = screen.getAllByRole('textbox')
        expect(inputs.length).toBe(3)
    })

    test('should handle special characters in fields', () => {
        const props = {
            first_name: 'João',
            last_name: 'da Silva',
            phone: '+55 (11) 99999-9999'
        }
        render(<UserCreateForm {...props} />)
        expect(screen.getByDisplayValue('João')).toBeTruthy()
        expect(screen.getByDisplayValue('da Silva')).toBeTruthy()
    })

    test('should maintain form state on input changes', () => {
        render(<UserCreateForm {...defaultProps} />)
        const firstNameInput = screen.getByDisplayValue('John') as HTMLInputElement
        const lastNameInput = screen.getByDisplayValue('Doe') as HTMLInputElement

        fireEvent.change(firstNameInput, { target: { value: 'Jane' } })
        expect(firstNameInput.value).toBe('Jane')
        expect(lastNameInput.value).toBe('Doe')
    })

    test('should render with default empty state when props are empty', () => {
        const emptyProps = {
            first_name: '',
            last_name: '',
            phone: ''
        }
        render(<UserCreateForm {...emptyProps} />)
        expect(screen.getByText('Formulário de Edição')).toBeTruthy()
    })
})
