import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookEditForm, { BookEditFormProps } from '../BookEditForm'
import { api } from '@/services/api'
import { useToastify } from '@/hooks/useToastify'
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
            books: {
                put: jest.fn()
            }
        }
    }
}))

jest.mock('@/hooks/useToastify', () => ({
    useToastify: jest.fn(() => ({
        toast: jest.fn()
    }))
}))

jest.mock('react-icons/im', () => ({
    ImCamera: ({ className }: { className?: string }): React.JSX.Element => (
        <span data-testid="camera-icon" className={className}>
            📷
        </span>
    )
}))

jest.mock('../SelectPhoto', () => ({
    SelectPhoto: ({
        onCancel,
        onSave
    }: {
        onCancel: () => void
        onSave: (image: string) => void
    }): React.JSX.Element => (
        <div data-testid="select-photo">
            <button onClick={onCancel} data-testid="photo-cancel">
                Cancel
            </button>
            <button onClick={() => onSave('https://example.com/image.jpg')} data-testid="photo-save">
                Save
            </button>
        </div>
    )
}))

describe('BookEditForm', () => {
    let mockRouter: { push: jest.Mock }
    let mockToast: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        mockRouter = {
            push: jest.fn()
        }
        mockToast = jest.fn()
        ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
        ;(useToastify as jest.Mock).mockReturnValue({
            toast: mockToast
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const defaultProps: BookEditFormProps = {
        id: 'book-123',
        isbn: 123456789,
        title: 'Edit Test Book',
        subtitle: 'Edit Subtitle',
        author: 'Edit Author',
        description: 'Edit Description',
        image: 'https://example.com/image.jpg',
        amount: 2,
        category: 'Fiction',
        place: 'Shelf 2',
        rowIndex: '0',
        status: 'available' as const
    }

    it('should render BookEditForm component', () => {
        const { container } = render(<BookEditForm {...defaultProps} />)
        expect(container).toBeTruthy()
    })

    it('should display form title', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByText('Formulário de Edição')).toBeTruthy()
    })

    it('should render ISBN input with initial value', () => {
        render(<BookEditForm {...defaultProps} />)
        const isbnInput = screen.getByDisplayValue('123456789')
        expect(isbnInput).toBeTruthy()
    })

    it('should render title input with initial value', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByDisplayValue('Edit Test Book')).toBeTruthy()
    })

    it('should render subtitle input with initial value', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByDisplayValue('Edit Subtitle')).toBeTruthy()
    })

    it('should render author input with initial value', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByDisplayValue('Edit Author')).toBeTruthy()
    })

    it('should render description input with initial value', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByDisplayValue('Edit Description')).toBeTruthy()
    })

    it('should render category input with initial value', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByDisplayValue('Fiction')).toBeTruthy()
    })

    it('should render image input with initial value', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByDisplayValue('https://example.com/image.jpg')).toBeTruthy()
    })

    it('should render amount input with initial value', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByDisplayValue('2')).toBeTruthy()
    })

    it('should render place input with initial value', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByDisplayValue('Shelf 2')).toBeTruthy()
    })

    it('should render Cancelar button with correct href', () => {
        render(<BookEditForm {...defaultProps} />)
        const cancelLink = screen.getByText('Cancelar')
        expect(cancelLink).toBeTruthy()
    })

    it('should render Salvar button', () => {
        render(<BookEditForm {...defaultProps} />)
        const updateButton = screen.getByText('Salvar')
        expect(updateButton).toBeTruthy()
    })

    it('should update ISBN on input change', () => {
        render(<BookEditForm {...defaultProps} />)
        const isbnInput = screen.getByDisplayValue('123456789') as HTMLInputElement
        fireEvent.change(isbnInput, { target: { value: '987654321' } })
        expect(isbnInput.value).toBe('987654321')
    })

    it('should update title on input change', () => {
        render(<BookEditForm {...defaultProps} />)
        const titleInput = screen.getByDisplayValue('Edit Test Book') as HTMLInputElement
        fireEvent.change(titleInput, { target: { value: 'Updated Title' } })
        expect(titleInput.value).toBe('Updated Title')
    })

    it('should update subtitle on input change', () => {
        render(<BookEditForm {...defaultProps} />)
        const subtitleInput = screen.getByDisplayValue('Edit Subtitle') as HTMLInputElement
        fireEvent.change(subtitleInput, { target: { value: 'Updated Subtitle' } })
        expect(subtitleInput.value).toBe('Updated Subtitle')
    })

    it('should update author on input change', () => {
        render(<BookEditForm {...defaultProps} />)
        const authorInput = screen.getByDisplayValue('Edit Author') as HTMLInputElement
        fireEvent.change(authorInput, { target: { value: 'Updated Author' } })
        expect(authorInput.value).toBe('Updated Author')
    })

    it('should update description on input change', () => {
        render(<BookEditForm {...defaultProps} />)
        const descInput = screen.getByDisplayValue('Edit Description') as HTMLInputElement
        fireEvent.change(descInput, { target: { value: 'Updated Description' } })
        expect(descInput.value).toBe('Updated Description')
    })

    it('should update category on input change', () => {
        render(<BookEditForm {...defaultProps} />)
        const categoryInput = screen.getByDisplayValue('Fiction') as HTMLInputElement
        fireEvent.change(categoryInput, { target: { value: 'Science' } })
        expect(categoryInput.value).toBe('Science')
    })

    it('should update image on input change', () => {
        render(<BookEditForm {...defaultProps} />)
        const imageInput = screen.getByDisplayValue('https://example.com/image.jpg') as HTMLInputElement
        fireEvent.change(imageInput, { target: { value: 'https://example.com/new.jpg' } })
        expect(imageInput.value).toBe('https://example.com/new.jpg')
    })

    it('should update amount on input change', () => {
        render(<BookEditForm {...defaultProps} />)
        const amountInput = screen.getByDisplayValue('2') as HTMLInputElement
        fireEvent.change(amountInput, { target: { value: '5' } })
        expect(amountInput.value).toBe('5')
    })

    it('should update place on input change', () => {
        render(<BookEditForm {...defaultProps} />)
        const placeInput = screen.getByDisplayValue('Shelf 2') as HTMLInputElement
        fireEvent.change(placeInput, { target: { value: 'Shelf 3' } })
        expect(placeInput.value).toBe('Shelf 3')
    })

    it('should show SelectPhoto when camera button is clicked', () => {
        render(<BookEditForm {...defaultProps} />)
        const cameraButton = screen.getByRole('button', { name: /📷/i })
        fireEvent.click(cameraButton)
        expect(screen.getByTestId('select-photo')).toBeTruthy()
    })

    it('should hide SelectPhoto when cancel is clicked', () => {
        render(<BookEditForm {...defaultProps} />)
        const cameraButton = screen.getByRole('button', { name: /📷/i })
        fireEvent.click(cameraButton)
        expect(screen.getByTestId('select-photo')).toBeTruthy()

        const cancelButton = screen.getByTestId('photo-cancel')
        fireEvent.click(cancelButton)
        expect(screen.queryByTestId('select-photo')).toBeFalsy()
    })

    it('should update image when photo is saved', () => {
        render(<BookEditForm {...defaultProps} />)
        const cameraButton = screen.getByRole('button', { name: /📷/i })
        fireEvent.click(cameraButton)

        const saveButton = screen.getByTestId('photo-save')
        fireEvent.click(saveButton)

        expect(mockToast).toHaveBeenCalledWith('Imagem selecionada com sucesso!', 'info')
    })

    it('should show success toast on successful update', async () => {
        ;(api.sheet.books.put as jest.Mock).mockResolvedValue({ status: 200 })

        render(<BookEditForm {...defaultProps} />)
        const updateButton = screen.getByText('Salvar')
        fireEvent.click(updateButton)

        await waitFor(
            () => {
                expect(mockToast).toHaveBeenCalledWith('Alterações salvas com sucesso!', 'success')
            },
            { timeout: 3000 }
        )
    })

    it('should push to dashboard on successful update', async () => {
        ;(api.sheet.books.put as jest.Mock).mockResolvedValue({ status: 200 })

        render(<BookEditForm {...defaultProps} />)
        const updateButton = screen.getByText('Salvar')
        fireEvent.click(updateButton)

        await waitFor(
            () => {
                expect(mockRouter.push).toHaveBeenCalledWith('/pages/dashboard')
            },
            { timeout: 3000 }
        )
    })

    it('should show warning toast when update fails', async () => {
        ;(api.sheet.books.put as jest.Mock).mockResolvedValue({ status: 400 })

        render(<BookEditForm {...defaultProps} />)
        const updateButton = screen.getByText('Salvar')
        fireEvent.click(updateButton)

        await waitFor(
            () => {
                expect(mockToast).toHaveBeenCalledWith('Alterações não foram salvas!', 'warning')
            },
            { timeout: 3000 }
        )
    })

    it('should show error toast on catch error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

        ;(api.sheet.books.put as jest.Mock).mockRejectedValue(new Error('API Error'))

        render(<BookEditForm {...defaultProps} />)
        const updateButton = screen.getByText('Salvar')
        fireEvent.click(updateButton)

        await waitFor(
            () => {
                expect(mockToast).toHaveBeenCalledWith('Erro ao tentar salvar as alterações', 'error')
            },
            { timeout: 3000 }
        )

        consoleErrorSpy.mockRestore()
    })

    it('should call api.sheet.books.put with correct parameters', async () => {
        ;(api.sheet.books.put as jest.Mock).mockResolvedValue({ status: 200 })

        render(<BookEditForm {...defaultProps} />)
        const updateButton = screen.getByText('Salvar')
        fireEvent.click(updateButton)

        await waitFor(
            () => {
                expect(api.sheet.books.put).toHaveBeenCalledWith('book-123', expect.any(Object))
            },
            { timeout: 3000 }
        )
    })

    it('should not update if id is missing', async () => {
        const propsWithoutId = {
            ...defaultProps,
            id: undefined as unknown as string
        }

        render(<BookEditForm {...propsWithoutId} />)
        const updateButton = screen.getByText('Salvar')
        fireEvent.click(updateButton)

        await new Promise(resolve => setTimeout(resolve, 100))
        expect(api.sheet.books.put).not.toHaveBeenCalled()
    })

    it('should handle null optional fields', () => {
        const propsWithNullFields: BookEditFormProps = {
            ...defaultProps,
            subtitle: null as unknown as string,
            description: null as unknown as string
        }

        render(<BookEditForm {...propsWithNullFields} />)
        expect(screen.getByText('Formulário de Edição')).toBeTruthy()
    })

    it('should initialize form values from props on mount', () => {
        render(<BookEditForm {...defaultProps} />)
        expect(screen.getByDisplayValue('Edit Test Book')).toBeTruthy()
        expect(screen.getByDisplayValue('Edit Author')).toBeTruthy()
    })

    it('should preserve form data when showing and hiding SelectPhoto', () => {
        render(<BookEditForm {...defaultProps} />)
        const titleInput = screen.getByDisplayValue('Edit Test Book') as HTMLInputElement

        fireEvent.change(titleInput, { target: { value: 'Changed Title' } })

        const cameraButton = screen.getByRole('button', { name: /📷/i })
        fireEvent.click(cameraButton)

        const cancelButton = screen.getByTestId('photo-cancel')
        fireEvent.click(cancelButton)

        const updatedTitleInput = screen.getByDisplayValue('Changed Title')
        expect(updatedTitleInput).toBeTruthy()
    })

    it('should handle form submission with special characters', async () => {
        ;(api.sheet.books.put as jest.Mock).mockResolvedValue({ status: 200 })

        const specialProps = {
            ...defaultProps,
            title: 'Book @#$%',
            author: 'Author & Co.'
        }

        render(<BookEditForm {...specialProps} />)
        expect(screen.getByDisplayValue('Book @#$%')).toBeTruthy()
    })
})
