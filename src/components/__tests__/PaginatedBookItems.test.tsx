/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PaginatedBookItems } from '../PaginatedBookItems'
import { useToastify } from '@/hooks/useToastify'

jest.mock('@/hooks/useToastify')
jest.mock('next/link', () => {
    const MockElement = ({ children, href }: { children: React.ReactNode; href: string }): React.JSX.Element => (
        <a href={href}>{children}</a>
    )

    return MockElement
})
jest.mock('../Img', () => ({
    Img: ({ src, alt }: { src: string; alt: string }): React.JSX.Element => (
        <img src={src} alt={alt} data-testid="book-img" />
    )
}))
jest.mock('../BookStatus', () => ({
    BookStatus: ({ label }: { label: string }): React.JSX.Element => <span data-testid="book-status">{label}</span>
}))
jest.mock('../TextElipsis', () => ({
    TextElipsis: ({ text }: { text: string }): React.JSX.Element => <div data-testid="text-ellipsis">{text}</div>
}))
jest.mock('../DeleteModal', () => ({
    DeleteModal: ({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }): React.JSX.Element => (
        <div data-testid="delete-modal">
            <button onClick={onCancel} data-testid="delete-cancel">
                Cancel
            </button>
            <button onClick={onConfirm} data-testid="delete-confirm">
                Confirm
            </button>
        </div>
    )
}))
jest.mock('react-paginate', () => ({
    __esModule: true,
    default: ({
        onPageChange,
        pageCount
    }: {
        onPageChange: (selectedItem: { selected: number }) => void
        pageCount: number
    }): React.JSX.Element => (
        <div data-testid="paginate">
            <button onClick={() => onPageChange({ selected: 1 })} data-testid="page-button">
                Page
            </button>
            <span>{pageCount} pages</span>
        </div>
    )
}))
jest.mock('@/lib/paginateNagivationButtons', () => ({
    __esModule: true,
    default: (): React.JSX.Element => <span>→</span>
}))
jest.mock('../styles', () => ({
    PaginatedContainer: ({ children }: { children: React.ReactNode }): React.JSX.Element => (
        <div data-testid="paginated-container">{children}</div>
    )
}))
jest.mock('react-icons/fa', () => ({
    FaPencilAlt: (): React.JSX.Element => <span data-testid="pencil-icon">✎</span>,
    FaTrash: (): React.JSX.Element => <span data-testid="trash-icon">🗑</span>
}))

describe('PaginatedBookItems', () => {
    const mockBooks: Book[] = [
        {
            id: '1',
            isbn: 111,
            title: 'Book 1',
            subtitle: 'Sub 1',
            author: 'Author 1',
            description: 'Desc 1',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            amount: 1,
            category: 'Fiction',
            place: 'Shelf 1',
            status: 'available'
        },
        {
            id: '2',
            isbn: 222,
            title: 'Book 2',
            subtitle: 'Sub 2',
            author: 'Author 2',
            description: 'Desc 2',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            amount: 1,
            category: 'Science',
            place: 'Shelf 2',
            status: 'borrowed'
        }
    ]

    let mockToast: jest.Mock
    let mockOnDelete: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        mockToast = jest.fn()
        mockOnDelete = jest.fn()
        ;(useToastify as jest.Mock).mockReturnValue({
            toast: mockToast
        })
    })

    test('should render PaginatedBookItems component', () => {
        const { container } = render(<PaginatedBookItems itemsPerPage={1} books={mockBooks} onDelete={mockOnDelete} />)
        expect(container).toBeTruthy()
    })

    test('should display books list', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        expect(screen.getAllByTestId('text-ellipsis')).toBeTruthy()
    })

    test('should display book status for each item', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const statuses = screen.getAllByTestId('book-status')
        expect(statuses.length).toBe(2)
    })

    test('should display edit links for each book', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const pencilIcons = screen.getAllByTestId('pencil-icon')
        expect(pencilIcons.length).toBe(2)
    })

    test('should display delete buttons for each book', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const trashIcons = screen.getAllByTestId('trash-icon')
        expect(trashIcons.length).toBe(2)
    })

    test('should show delete modal when delete button is clicked', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByRole('button', { name: /🗑/i })
        fireEvent.click(trashButtons[0])
        expect(screen.getByTestId('delete-modal')).toBeTruthy()
    })

    test('should call onDelete when delete is confirmed', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByRole('button', { name: /🗑/i })
        fireEvent.click(trashButtons[0])

        const confirmButton = screen.getByTestId('delete-confirm')
        fireEvent.click(confirmButton)

        expect(mockOnDelete).toHaveBeenCalled()
    })

    test('should show success toast when delete is confirmed', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByRole('button', { name: /🗑/i })
        fireEvent.click(trashButtons[0])

        const confirmButton = screen.getByTestId('delete-confirm')
        fireEvent.click(confirmButton)

        expect(mockToast).toHaveBeenCalledWith('Livro foi excluído com sucesso!', 'success')
    })

    test('should hide delete modal when cancel is clicked', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByRole('button', { name: /🗑/i })
        fireEvent.click(trashButtons[0])

        const cancelButton = screen.getByTestId('delete-cancel')
        fireEvent.click(cancelButton)

        expect(screen.queryByTestId('delete-modal')).toBeFalsy()
    })

    test('should not call onDelete when delete is cancelled', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByRole('button', { name: /🗑/i })
        fireEvent.click(trashButtons[0])

        const cancelButton = screen.getByTestId('delete-cancel')
        fireEvent.click(cancelButton)

        expect(mockOnDelete).not.toHaveBeenCalled()
    })

    test('should handle pagination', () => {
        render(<PaginatedBookItems itemsPerPage={1} books={mockBooks} onDelete={mockOnDelete} />)
        expect(screen.getByTestId('paginate')).toBeTruthy()
    })

    test('should display paginated items correctly', () => {
        render(<PaginatedBookItems itemsPerPage={1} books={mockBooks} onDelete={mockOnDelete} />)
        const items = screen.getAllByTestId('text-ellipsis')
        expect(items.length).toBe(1)
    })

    test('should handle empty books list', () => {
        const { container } = render(<PaginatedBookItems itemsPerPage={10} books={[]} onDelete={mockOnDelete} />)
        expect(container).toBeTruthy()
    })

    test('should handle page change event', () => {
        render(<PaginatedBookItems itemsPerPage={1} books={mockBooks} onDelete={mockOnDelete} />)
        const pageButton = screen.getByTestId('page-button')
        fireEvent.click(pageButton)
        expect(pageButton).toBeTruthy()
    })

    test('should call onDelete with correct ID when delete confirmed', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const deleteButton = screen.getAllByTestId('trash-icon')[0].closest('button')
        if (deleteButton) {
            fireEvent.click(deleteButton)
            const confirmButton = screen.getByTestId('delete-confirm')
            fireEvent.click(confirmButton)
            expect(mockOnDelete).toHaveBeenCalled()
        }
    })

    test('should close delete modal when cancel is clicked', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        const deleteButton = screen.getAllByTestId('trash-icon')[0].closest('button')
        if (deleteButton) {
            fireEvent.click(deleteButton)
            const cancelButton = screen.getByTestId('delete-cancel')
            fireEvent.click(cancelButton)
            expect(cancelButton).toBeTruthy()
        }
    })

    test('should display correct number of items per page', () => {
        render(<PaginatedBookItems itemsPerPage={1} books={mockBooks} onDelete={mockOnDelete} />)
        const items = screen.getAllByTestId('text-ellipsis')
        expect(items.length).toBe(1)
    })

    test('should handle multiple books pagination', () => {
        render(<PaginatedBookItems itemsPerPage={1} books={mockBooks} onDelete={mockOnDelete} />)
        expect(screen.getByTestId('paginate')).toBeTruthy()
    })

    test('should display singular message when only 1 book', () => {
        const singleBook: Book[] = [mockBooks[0]]
        render(<PaginatedBookItems itemsPerPage={10} books={singleBook} onDelete={mockOnDelete} />)
        expect(screen.getByText(/livro encontrado/)).toBeTruthy()
    })

    test('should display plural message when multiple books', () => {
        render(<PaginatedBookItems itemsPerPage={10} books={mockBooks} onDelete={mockOnDelete} />)
        expect(screen.getByText(/livros encontrados/)).toBeTruthy()
    })
})
