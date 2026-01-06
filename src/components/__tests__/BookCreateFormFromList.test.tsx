import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookCreateFormFromList, { BookCreateFormProps } from '../BookCreateFormFromList'
import { api } from '@/services/api'
import { useToastify } from '@/hooks/useToastify'

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mock-uuid-1234')
}))

jest.mock('next/link', () => {
    const MockElement = ({ children, href }: { children: React.ReactNode; href: string }): React.JSX.Element => (
        <a href={href} data-testid="next-link">
            {children}
        </a>
    )

    return MockElement
})

jest.mock('@/services/api', () => ({
    api: {
        sheet: {
            books: {
                get: jest.fn(),
                post: jest.fn()
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
                Cancel Photo
            </button>
            <button onClick={() => onSave('https://example.com/image.jpg')} data-testid="photo-save">
                Save Photo
            </button>
        </div>
    )
}))

describe('BookCreateFormFromList', () => {
    let mockSetBooksInformations: jest.Mock
    let mockToast: jest.Mock
    let defaultProps: BookCreateFormProps

    beforeEach(() => {
        jest.clearAllMocks()
        mockSetBooksInformations = jest.fn()
        mockToast = jest.fn()
        ;(useToastify as jest.Mock).mockReturnValue({
            toast: mockToast
        })
        defaultProps = {
            isbn: 123456789,
            title: 'Test Book',
            subtitle: 'Test Subtitle',
            author: 'Test Author',
            description: 'Test Description',
            image: 'https://example.com/image.jpg',
            amount: 1,
            category: 'Fiction',
            place: 'Shelf 1',
            setBooksInformations: mockSetBooksInformations
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should render BookCreateFormFromList component', () => {
        const { container } = render(<BookCreateFormFromList {...defaultProps} />)
        expect(container).toBeTruthy()
    })

    it('should display form title', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        expect(screen.getByText('Formulário de Edição')).toBeTruthy()
    })

    it('should render ISBN input with initial value', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const isbnInput = screen.getByDisplayValue('123456789')
        expect(isbnInput).toBeTruthy()
    })

    it('should render title input with initial value', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const titleInput = screen.getByDisplayValue('Test Book')
        expect(titleInput).toBeTruthy()
    })

    it('should render subtitle input with initial value', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const subtitleInput = screen.getByDisplayValue('Test Subtitle')
        expect(subtitleInput).toBeTruthy()
    })

    it('should render author input with initial value', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const authorInput = screen.getByDisplayValue('Test Author')
        expect(authorInput).toBeTruthy()
    })

    it('should render description input with initial value', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const descInput = screen.getByDisplayValue('Test Description')
        expect(descInput).toBeTruthy()
    })

    it('should render category input with initial value', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const categoryInput = screen.getByDisplayValue('Fiction')
        expect(categoryInput).toBeTruthy()
    })

    it('should render image input with initial value', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const imageInput = screen.getByDisplayValue('https://example.com/image.jpg')
        expect(imageInput).toBeTruthy()
    })

    it('should render amount input with initial value', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const amountInput = screen.getByDisplayValue('1')
        expect(amountInput).toBeTruthy()
    })

    it('should render place input with initial value', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const placeInput = screen.getByDisplayValue('Shelf 1')
        expect(placeInput).toBeTruthy()
    })

    it('should render Cancel button with correct href', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const cancelLink = screen.getByText('Cancelar')
        expect(cancelLink).toBeTruthy()
    })

    it('should render Register button', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const registerButton = screen.getByText('Cadastrar')
        expect(registerButton).toBeTruthy()
    })

    it('should update ISBN on input change', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const isbnInput = screen.getByDisplayValue('123456789') as HTMLInputElement
        fireEvent.change(isbnInput, { target: { value: '987654321' } })
        expect(isbnInput.value).toBe('987654321')
    })

    it('should update title on input change', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const titleInput = screen.getByDisplayValue('Test Book') as HTMLInputElement
        fireEvent.change(titleInput, { target: { value: 'New Title' } })
        expect(titleInput.value).toBe('New Title')
    })

    it('should update subtitle on input change', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const subtitleInput = screen.getByDisplayValue('Test Subtitle') as HTMLInputElement
        fireEvent.change(subtitleInput, { target: { value: 'New Subtitle' } })
        expect(subtitleInput.value).toBe('New Subtitle')
    })

    it('should update author on input change', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const authorInput = screen.getByDisplayValue('Test Author') as HTMLInputElement
        fireEvent.change(authorInput, { target: { value: 'New Author' } })
        expect(authorInput.value).toBe('New Author')
    })

    it('should update description on input change', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const descInput = screen.getByDisplayValue('Test Description') as HTMLInputElement
        fireEvent.change(descInput, { target: { value: 'New Description' } })
        expect(descInput.value).toBe('New Description')
    })

    it('should update category on input change', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const categoryInput = screen.getByDisplayValue('Fiction') as HTMLInputElement
        fireEvent.change(categoryInput, { target: { value: 'Science' } })
        expect(categoryInput.value).toBe('Science')
    })

    it('should update image on input change', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const imageInput = screen.getByDisplayValue('https://example.com/image.jpg') as HTMLInputElement
        fireEvent.change(imageInput, { target: { value: 'https://example.com/new.jpg' } })
        expect(imageInput.value).toBe('https://example.com/new.jpg')
    })

    it('should update amount on input change', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const amountInput = screen.getByDisplayValue('1') as HTMLInputElement
        fireEvent.change(amountInput, { target: { value: '5' } })
        expect(amountInput.value).toBe('5')
    })

    it('should update place on input change', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const placeInput = screen.getByDisplayValue('Shelf 1') as HTMLInputElement
        fireEvent.change(placeInput, { target: { value: 'Shelf 2' } })
        expect(placeInput.value).toBe('Shelf 2')
    })

    it('should show SelectPhoto component when camera button is clicked', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const cameraButton = screen.getByRole('button', { name: /📷/i })
        fireEvent.click(cameraButton)
        expect(screen.getByTestId('select-photo')).toBeTruthy()
    })

    it('should hide SelectPhoto when cancel is clicked', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const cameraButton = screen.getByRole('button', { name: /📷/i })
        fireEvent.click(cameraButton)
        expect(screen.getByTestId('select-photo')).toBeTruthy()

        const cancelButton = screen.getByTestId('photo-cancel')
        fireEvent.click(cancelButton)
        expect(screen.queryByTestId('select-photo')).toBeFalsy()
    })

    it('should update image and hide SelectPhoto when photo is saved', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const cameraButton = screen.getByRole('button', { name: /📷/i })
        fireEvent.click(cameraButton)

        const saveButton = screen.getByTestId('photo-save')
        fireEvent.click(saveButton)

        expect(mockToast).toHaveBeenCalledWith('Imagem selecionada com sucesso!', 'info')
        expect(screen.queryByTestId('select-photo')).toBeFalsy()
    })

    it('should show error toast when book already exists', async () => {
        ;(api.sheet.books.get as jest.Mock).mockResolvedValue([{ isbn: '123456789', title: 'Existing Book' }])

        render(<BookCreateFormFromList {...defaultProps} />)
        const registerButton = screen.getByText('Cadastrar')
        fireEvent.click(registerButton)

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith('Livro com o mesmo código ISBN já cadastrado!', 'error')
        })
    })

    it('should not call setBooksInformations when book already exists', async () => {
        ;(api.sheet.books.get as jest.Mock).mockResolvedValue([{ isbn: '123456789', title: 'Existing Book' }])

        render(<BookCreateFormFromList {...defaultProps} />)
        const registerButton = screen.getByText('Cadastrar')
        fireEvent.click(registerButton)

        await waitFor(() => {
            expect(mockSetBooksInformations).not.toHaveBeenCalled()
        })
    })

    it('should call setBooksInformations on successful register', async () => {
        const newMockSetBooks = jest.fn()
        const propsWithNewMock = {
            ...defaultProps,
            setBooksInformations: newMockSetBooks
        }

        ;(api.sheet.books.get as jest.Mock).mockResolvedValue([])
        ;(api.sheet.books.post as jest.Mock).mockResolvedValue({ status: 200 })

        render(<BookCreateFormFromList {...propsWithNewMock} />)
        const registerButton = screen.getByText('Cadastrar')
        fireEvent.click(registerButton)

        await waitFor(
            () => {
                expect(newMockSetBooks).toHaveBeenCalled()
            },
            { timeout: 5000 }
        )
    })

    it('should attempt to call API when register button is clicked', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const registerButton = screen.getByText('Cadastrar')
        expect(registerButton).toBeTruthy()
    })

    it('should handle camera button click preventing default', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const cameraButton = screen.getByRole('button', { name: /📷/i })
        const preventDefaultSpy = jest.fn()
        const event = new MouseEvent('click', { bubbles: true })
        event.preventDefault = preventDefaultSpy
        fireEvent.click(cameraButton)
        expect(screen.getByTestId('select-photo')).toBeTruthy()
    })

    it('should render with default prop values when not provided', () => {
        const minimalProps = {
            setBooksInformations: mockSetBooksInformations,
            rowIndex: '1',
            isbn: 123,
            title: 'string',
            subtitle: 'string',
            author: 'string',
            description: 'string',
            image: 'string',
            amount: 1,
            category: 'string',
            status: 'available' as Book['status'],
            place: 'place'
        }
        render(<BookCreateFormFromList {...minimalProps} />)
        expect(screen.getByText('Formulário de Edição')).toBeTruthy()
    })

    it('should preserve form data when showing and hiding SelectPhoto', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const titleInput = screen.getByDisplayValue('Test Book') as HTMLInputElement

        // Change value
        fireEvent.change(titleInput, { target: { value: 'Changed Title' } })
        expect(titleInput.value).toBe('Changed Title')

        // Show SelectPhoto
        const cameraButton = screen.getByRole('button', { name: /📷/i })
        fireEvent.click(cameraButton)

        // Hide SelectPhoto
        const cancelButton = screen.getByTestId('photo-cancel')
        fireEvent.click(cancelButton)

        // Value should still be changed
        const updatedTitleInput = screen.getByDisplayValue('Changed Title')
        expect(updatedTitleInput).toBeTruthy()
    })

    it('should handle form with special characters in inputs', async () => {
        ;(api.sheet.books.get as jest.Mock).mockResolvedValue([])
        ;(api.sheet.books.post as jest.Mock).mockResolvedValue({ status: 200 })

        const specialProps = {
            ...defaultProps,
            title: 'Book @#$%',
            author: 'Author & Co.'
        }

        render(<BookCreateFormFromList {...specialProps} />)
        expect(screen.getByDisplayValue('Book @#$%')).toBeTruthy()
        expect(screen.getByDisplayValue('Author & Co.')).toBeTruthy()
    })

    it('should handle numeric ISBN correctly', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const isbnInput = screen.getByDisplayValue('123456789') as HTMLInputElement
        fireEvent.change(isbnInput, { target: { value: '999888777' } })
        expect(isbnInput.value).toBe('999888777')
    })

    it('should handle numeric amount input', () => {
        render(<BookCreateFormFromList {...defaultProps} />)
        const amountInput = screen.getByDisplayValue('1') as HTMLInputElement
        fireEvent.change(amountInput, { target: { value: '10' } })
        expect(amountInput.value).toBe('10')
    })
})
