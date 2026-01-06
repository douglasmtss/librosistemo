import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookCreateForm from '../BookCreateForm'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useToastify } from '@/hooks/useToastify'

// Mock dependencies
jest.mock('next/link', () => {
    const MockElement = ({ children, href }: { children: React.ReactNode; href: string }): React.JSX.Element => (
        <a href={href}>{children}</a>
    )

    return MockElement
})

jest.mock('next/navigation')
jest.mock('@/services/api')
jest.mock('@/hooks/useToastify')
jest.mock('../SelectPhoto', () => ({
    SelectPhoto: ({
        onCancel,
        onSave
    }: {
        onCancel: () => void
        onSave: (image: string) => void
    }): React.JSX.Element => (
        <div data-testid="select-photo">
            <button onClick={onCancel} data-testid="cancel-photo">
                Cancel
            </button>
            <button onClick={() => onSave('image.jpg')} data-testid="save-photo">
                Save
            </button>
        </div>
    )
}))

jest.mock('react-icons/im', () => ({
    ImCamera: (): React.JSX.Element => <span data-testid="camera-icon">Camera</span>
}))

jest.mock('uuid', () => ({
    v4: (): string => 'test-uuid-123'
}))

describe('BookCreateForm', () => {
    const mockPush = jest.fn()
    const mockToast = jest.fn()
    const mockGetBooks = jest.fn()
    const mockPostBook = jest.fn()

    const mockBook: Book = {
        isbn: 123456,
        title: 'Test Book',
        subtitle: 'Test Subtitle',
        author: 'Test Author',
        description: 'Test Description',
        image: '',
        amount: 5,
        category: 'Test Category',
        place: 'Test Place'
    }

    beforeEach(() => {
        jest.clearAllMocks()
        ;(useRouter as jest.Mock).mockReturnValue({
            push: mockPush
        })
        ;(useToastify as jest.Mock).mockReturnValue({
            toast: mockToast
        })
        ;(api.sheet.books.get as jest.Mock) = mockGetBooks
        ;(api.sheet.books.post as jest.Mock) = mockPostBook

        mockPostBook.mockResolvedValue({ status: 200 })
        mockGetBooks.mockResolvedValue([])
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

test('should render form with all input fields', () => {
        render(<BookCreateForm {...mockBook} />)

        expect(screen.getByLabelText(/ISBN/)).toBeTruthy()
        expect(screen.getByLabelText(/Título/)).toBeTruthy()
        expect(screen.getByLabelText(/Subtítulo/)).toBeTruthy()
        expect(screen.getByLabelText(/Autor/)).toBeTruthy()
        expect(screen.getByLabelText(/Descrição/)).toBeTruthy()
        expect(screen.getByLabelText(/Categoria/)).toBeTruthy()
        expect(screen.getByLabelText(/Imagem/)).toBeTruthy()
        expect(screen.getByLabelText(/Quantidade/)).toBeTruthy()
        expect(screen.getByLabelText(/Local/)).toBeTruthy()
    })

test('should render form title', () => {
        render(<BookCreateForm {...mockBook} />)

        expect(screen.getByText('Formulário de Edição')).toBeTruthy()
    })

test('should initialize form fields with provided props', () => {
        render(<BookCreateForm {...mockBook} />)

        const titleInput = screen.getByDisplayValue('Test Book')
        const authorInput = screen.getByDisplayValue('Test Author')
        const categoryInput = screen.getByDisplayValue('Test Category')

        expect(titleInput).toBeTruthy()
        expect(authorInput).toBeTruthy()
        expect(categoryInput).toBeTruthy()
    })

test('should update title field when user types', () => {
        render(<BookCreateForm {...mockBook} />)

        const titleInput = screen.getByLabelText(/Título/) as HTMLInputElement
        fireEvent.change(titleInput, { target: { value: 'New Title' } })

        expect(titleInput.value).toBe('New Title')
    })

test('should update subtitle field when user types', () => {
        render(<BookCreateForm {...mockBook} />)

        const subtitleInput = screen.getByLabelText(/Subtítulo/) as HTMLInputElement
        fireEvent.change(subtitleInput, { target: { value: 'New Subtitle' } })

        expect(subtitleInput.value).toBe('New Subtitle')
    })

test('should update ISBN field when user types', () => {
        render(<BookCreateForm {...mockBook} />)

        const isbnInput = screen.getByLabelText(/ISBN/) as HTMLInputElement
        fireEvent.change(isbnInput, { target: { value: '789012' } })

        expect(isbnInput.value).toBe('789012')
    })

test('should update author field when user types', () => {
        render(<BookCreateForm {...mockBook} />)

        const authorInput = screen.getByLabelText(/Autor/) as HTMLInputElement
        fireEvent.change(authorInput, { target: { value: 'New Author' } })

        expect(authorInput.value).toBe('New Author')
    })

test('should update description field when user types', () => {
        render(<BookCreateForm {...mockBook} />)

        const descriptionInput = screen.getByLabelText(/Descrição/) as HTMLInputElement
        fireEvent.change(descriptionInput, { target: { value: 'New Description' } })

        expect(descriptionInput.value).toBe('New Description')
    })

test('should update category field when user types', () => {
        render(<BookCreateForm {...mockBook} />)

        const categoryInput = screen.getByLabelText(/Categoria/) as HTMLInputElement
        fireEvent.change(categoryInput, { target: { value: 'New Category' } })

        expect(categoryInput.value).toBe('New Category')
    })

test('should update amount field when user types', () => {
        render(<BookCreateForm {...mockBook} />)

        const amountInput = screen.getByLabelText(/Quantidade/) as HTMLInputElement
        fireEvent.change(amountInput, { target: { value: '10' } })

        expect(amountInput.value).toBe('10')
    })

test('should update image field when user types URL', () => {
        render(<BookCreateForm {...mockBook} />)

        const imageInput = screen.getByLabelText(/Imagem/) as HTMLInputElement
        fireEvent.change(imageInput, { target: { value: 'https://example.com/image.jpg' } })

        expect(imageInput.value).toBe('https://example.com/image.jpg')
    })

test('should update place field when user types', () => {
        render(<BookCreateForm {...mockBook} />)

        const placeInput = screen.getByLabelText(/Local/) as HTMLInputElement
        fireEvent.change(placeInput, { target: { value: 'New Place' } })

        expect(placeInput.value).toBe('New Place')
    })

test('should render Camera button for photo selection', () => {
        render(<BookCreateForm {...mockBook} />)

        const cameraButton = screen.getByTestId('camera-icon')
        expect(cameraButton).toBeTruthy()
    })

test('should show SelectPhoto component when camera button is clicked', () => {
        render(<BookCreateForm {...mockBook} />)

        const cameraButton = screen.getByRole('button', { name: /Camera/ })
        fireEvent.click(cameraButton)

        expect(screen.getByTestId('select-photo')).toBeTruthy()
    })

test('should hide SelectPhoto component when onCancel is called', () => {
        render(<BookCreateForm {...mockBook} />)

        const cameraButton = screen.getByRole('button', { name: /Camera/ })
        fireEvent.click(cameraButton)

        expect(screen.getByTestId('select-photo')).toBeTruthy()

        const cancelButton = screen.getByTestId('cancel-photo')
        fireEvent.click(cancelButton)

        expect(screen.queryByTestId('select-photo')).toBeFalsy()
    })

test('should update image field when onSave is called in SelectPhoto', () => {
        render(<BookCreateForm {...mockBook} />)

        const cameraButton = screen.getByRole('button', { name: /Camera/ })
        fireEvent.click(cameraButton)

        const saveButton = screen.getByTestId('save-photo')
        fireEvent.click(saveButton)

        const imageInput = screen.getByDisplayValue('image.jpg')
        expect(imageInput).toBeTruthy()
    })

test('should show success toast when image is saved', () => {
        render(<BookCreateForm {...mockBook} />)

        const cameraButton = screen.getByRole('button', { name: /Camera/ })
        fireEvent.click(cameraButton)

        const saveButton = screen.getByTestId('save-photo')
        fireEvent.click(saveButton)

        expect(mockToast).toHaveBeenCalledWith('Imagem selecionada com sucesso!', 'info')
    })

test('should render Cancel and Register buttons', () => {
        render(<BookCreateForm {...mockBook} />)

        const cancelLink = screen.getByText('Cancelar')
        const registerButton = screen.getByText('Cadastrar')

        expect(cancelLink).toBeTruthy()
        expect(registerButton).toBeTruthy()
    })

test('should navigate to dashboard on cancel', () => {
        render(<BookCreateForm {...mockBook} />)

        const cancelLink = screen.getByText('Cancelar') as HTMLAnchorElement
        expect(cancelLink.getAttribute('href')).toBe('/pages/dashboard/book-registration')
    })

test('should show error when book with same ISBN already exists', async () => {
        mockGetBooks.mockResolvedValue([
            {
                isbn: 123456,
                title: 'Existing Book'
            }
        ])

        render(<BookCreateForm {...mockBook} />)

        const registerButton = screen.getByText('Cadastrar')
        fireEvent.click(registerButton)

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith('Livro com o mesmo código ISBN já cadastrado!', 'error')
        })
    })

test('should not call post when book already exists', async () => {
        mockGetBooks.mockResolvedValue([
            {
                isbn: 123456,
                title: 'Existing Book'
            }
        ])

        render(<BookCreateForm {...mockBook} />)

        const registerButton = screen.getByText('Cadastrar')
        fireEvent.click(registerButton)

        await waitFor(() => {
            expect(mockPostBook).not.toHaveBeenCalled()
        })
    })

test('should successfully register new book', async () => {
        mockGetBooks.mockResolvedValue([])

        render(<BookCreateForm {...mockBook} />)

        const registerButton = screen.getByText('Cadastrar')
        fireEvent.click(registerButton)

        await waitFor(() => {
            expect(mockPostBook).toHaveBeenCalledWith({
                ...mockBook,
                id: 'test-uuid-123',
                status: 'available'
            })
        })
    })

test('should show success toast and navigate on successful registration', async () => {
        mockGetBooks.mockResolvedValue([])

        render(<BookCreateForm {...mockBook} />)

        const registerButton = screen.getByText('Cadastrar')
        fireEvent.click(registerButton)

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith('Livro cadastrado com sucesso!', 'success')
            expect(mockPush).toHaveBeenCalledWith('/pages/dashboard')
        })
    })

test('should handle empty book list response', async () => {
        mockGetBooks.mockResolvedValue(null)

        render(<BookCreateForm {...mockBook} />)

        const registerButton = screen.getByText('Cadastrar')
        fireEvent.click(registerButton)

        await waitFor(() => {
            expect(mockPostBook).toHaveBeenCalled()
        })
    })

test('should update multiple fields in sequence', () => {
        render(<BookCreateForm {...mockBook} />)

        const titleInput = screen.getByLabelText(/Título/) as HTMLInputElement
        const authorInput = screen.getByLabelText(/Autor/) as HTMLInputElement

        fireEvent.change(titleInput, { target: { value: 'Updated Title' } })
        fireEvent.change(authorInput, { target: { value: 'Updated Author' } })

        expect(titleInput.value).toBe('Updated Title')
        expect(authorInput.value).toBe('Updated Author')
    })

test('should handle zero amount', () => {
        render(<BookCreateForm {...mockBook} />)

        const amountInput = screen.getByLabelText(/Quantidade/) as HTMLInputElement
        fireEvent.change(amountInput, { target: { value: '0' } })

        expect(amountInput.value).toBe('0')
    })

test('should preserve form data across rerenders', async () => {
        const { rerender } = render(<BookCreateForm {...mockBook} />)

        const titleInput = screen.getByLabelText(/Título/) as HTMLInputElement
        fireEvent.change(titleInput, { target: { value: 'Changed Title' } })

        rerender(<BookCreateForm {...mockBook} />)

        expect(titleInput.value).toBe('Changed Title')
    })
})
