import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PaginatedLendsItems } from '../PaginatedLendsItems'
import { useToastify } from '@/hooks/useToastify'

jest.mock('@/hooks/useToastify')
jest.mock('next/link', () => {
    const MockElement = ({ children, href }: { children: React.ReactNode; href: string }): React.JSX.Element => (
        <a href={href}>{children}</a>
    )

    return MockElement
})
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

describe('PaginatedLendsItems', () => {
    const mockLends: Lend[] = [
        {
            id: '1',
            book_id: '1',
            user_id: '1',
            first_name: 'string',
            last_name: 'string',
            book_title: 'string',
            created: 'string'
        },
        {
            id: '2',
            book_id: '2',
            user_id: '2',
            first_name: 'string',
            last_name: 'string',
            book_title: 'string',
            created: 'string'
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

    test('should render PaginatedLendsItems component', () => {
        const { container } = render(<PaginatedLendsItems itemsPerPage={1} lends={mockLends} onDelete={mockOnDelete} />)
        expect(container).toBeTruthy()
    })

    test('should display lends list', () => {
        const { container } = render(
            <PaginatedLendsItems itemsPerPage={10} lends={mockLends} onDelete={mockOnDelete} />
        )
        expect(container.querySelectorAll('[data-testid="paginated-container"]')).toBeTruthy()
    })

    test('should show delete modal when delete button is clicked', () => {
        render(<PaginatedLendsItems itemsPerPage={10} lends={mockLends} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)
        expect(screen.getByTestId('delete-modal')).toBeTruthy()
    })

    test('should call onDelete when delete is confirmed', () => {
        render(<PaginatedLendsItems itemsPerPage={10} lends={mockLends} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)

        const confirmButton = screen.getByTestId('delete-confirm')
        fireEvent.click(confirmButton)

        expect(mockOnDelete).toHaveBeenCalled()
    })

    test('should show success toast when delete is confirmed', () => {
        render(<PaginatedLendsItems itemsPerPage={10} lends={mockLends} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)

        const confirmButton = screen.getByTestId('delete-confirm')
        fireEvent.click(confirmButton)

        expect(mockToast).toHaveBeenCalledWith('Empréstimo foi excluído com sucesso!', 'success')
    })

    test('should handle pagination', () => {
        render(<PaginatedLendsItems itemsPerPage={1} lends={mockLends} onDelete={mockOnDelete} />)
        expect(screen.getByTestId('paginate')).toBeTruthy()
    })

    test('should handle empty lends list', () => {
        const { container } = render(<PaginatedLendsItems itemsPerPage={10} lends={[]} onDelete={mockOnDelete} />)
        expect(container).toBeTruthy()
    })

    test('should call onDelete when delete is confirmed', () => {
        render(<PaginatedLendsItems itemsPerPage={10} lends={mockLends} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)

        const confirmButton = screen.getByTestId('delete-confirm')
        fireEvent.click(confirmButton)

        expect(mockOnDelete).toHaveBeenCalled()
    })

    test('should handle page change for lends', () => {
        render(<PaginatedLendsItems itemsPerPage={1} lends={mockLends} onDelete={mockOnDelete} />)
        const pageButton = screen.getByTestId('page-button')
        fireEvent.click(pageButton)
        expect(pageButton).toBeTruthy()
    })

    test('should cancel delete modal when cancel button is clicked', () => {
        render(<PaginatedLendsItems itemsPerPage={10} lends={mockLends} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)

        const cancelButton = screen.getByTestId('delete-cancel')
        fireEvent.click(cancelButton)

        expect(mockOnDelete).not.toHaveBeenCalled()
    })

    test('should display lend items in correct format', () => {
        render(<PaginatedLendsItems itemsPerPage={10} lends={mockLends} onDelete={mockOnDelete} />)
        const lendItems = screen.getAllByRole('link')
        expect(lendItems.length).toBeGreaterThan(0)
    })

    test('should display singular message when only 1 lend', () => {
        const singleLend: Lend[] = [mockLends[0]]
        render(<PaginatedLendsItems itemsPerPage={10} lends={singleLend} onDelete={mockOnDelete} />)
        expect(screen.getByText(/empréstimo encontrado/)).toBeTruthy()
    })

    test('should display plural message when multiple lends', () => {
        render(<PaginatedLendsItems itemsPerPage={10} lends={mockLends} onDelete={mockOnDelete} />)
        expect(screen.getByText(/empréstimos encontrados/)).toBeTruthy()
    })
})
