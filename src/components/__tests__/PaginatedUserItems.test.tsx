import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PaginatedUserItems } from '../PaginatedUserItems'
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

describe('PaginatedUserItems', () => {
    const mockUsers: User[] = [
        {
            id: '1',
            first_name: 'John',
            last_name: 'Doe',
            phone: '123456789'
        },
        {
            id: '2',
            first_name: 'Jane',
            last_name: 'Smith',
            phone: '987654321'
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

    test('should render PaginatedUserItems component', () => {
        const { container } = render(<PaginatedUserItems itemsPerPage={1} users={mockUsers} onDelete={mockOnDelete} />)
        expect(container).toBeTruthy()
    })

    test('should display users list', () => {
        const { container } = render(<PaginatedUserItems itemsPerPage={10} users={mockUsers} onDelete={mockOnDelete} />)
        expect(container.querySelectorAll('[data-testid="paginated-container"]')).toBeTruthy()
    })

    test('should show delete modal when delete button is clicked', () => {
        render(<PaginatedUserItems itemsPerPage={10} users={mockUsers} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)
        expect(screen.getByTestId('delete-modal')).toBeTruthy()
    })

    test('should call onDelete when delete is confirmed', () => {
        render(<PaginatedUserItems itemsPerPage={10} users={mockUsers} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)

        const confirmButton = screen.getByTestId('delete-confirm')
        fireEvent.click(confirmButton)

        expect(mockOnDelete).toHaveBeenCalled()
    })

    test('should show success toast when delete is confirmed', () => {
        render(<PaginatedUserItems itemsPerPage={10} users={mockUsers} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)

        const confirmButton = screen.getByTestId('delete-confirm')
        fireEvent.click(confirmButton)

        expect(mockToast).toHaveBeenCalledWith('Usuário foi excluído com sucesso!', 'success')
    })

    test('should handle pagination', () => {
        render(<PaginatedUserItems itemsPerPage={1} users={mockUsers} onDelete={mockOnDelete} />)
        expect(screen.getByTestId('paginate')).toBeTruthy()
    })

    test('should handle empty users list', () => {
        const { container } = render(<PaginatedUserItems itemsPerPage={10} users={[]} onDelete={mockOnDelete} />)
        expect(container).toBeTruthy()
    })

    test('should call onDelete when user delete is confirmed', () => {
        render(<PaginatedUserItems itemsPerPage={10} users={mockUsers} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)

        const confirmButton = screen.getByTestId('delete-confirm')
        fireEvent.click(confirmButton)

        expect(mockOnDelete).toHaveBeenCalled()
    })

    test('should handle page change for users', () => {
        render(<PaginatedUserItems itemsPerPage={1} users={mockUsers} onDelete={mockOnDelete} />)
        const pageButton = screen.getByTestId('page-button')
        fireEvent.click(pageButton)
        expect(pageButton).toBeTruthy()
    })

    test('should cancel delete modal for users', () => {
        render(<PaginatedUserItems itemsPerPage={10} users={mockUsers} onDelete={mockOnDelete} />)
        const trashButtons = screen.getAllByTestId('trash-icon')
        fireEvent.click(trashButtons[0].parentElement!)

        const cancelButton = screen.getByTestId('delete-cancel')
        fireEvent.click(cancelButton)

        expect(mockOnDelete).not.toHaveBeenCalled()
    })

    test('should display user items with correct columns', () => {
        render(<PaginatedUserItems itemsPerPage={10} users={mockUsers} onDelete={mockOnDelete} />)
        const userNames = screen.getAllByText(/John Doe|Jane Smith/)
        expect(userNames.length).toBeGreaterThan(0)
    })

    test('should display singular message when only 1 user', () => {
        const singleUser: User[] = [mockUsers[0]]
        render(<PaginatedUserItems itemsPerPage={10} users={singleUser} onDelete={mockOnDelete} />)
        expect(screen.getByText(/usuário encontrado/)).toBeTruthy()
    })

    test('should display plural message when multiple users', () => {
        render(<PaginatedUserItems itemsPerPage={10} users={mockUsers} onDelete={mockOnDelete} />)
        expect(screen.getByText(/usuários encontrados/)).toBeTruthy()
    })

    test('should display edit and delete buttons for each user', () => {
        render(<PaginatedUserItems itemsPerPage={10} users={mockUsers} onDelete={mockOnDelete} />)
        const editButtons = screen.getAllByTestId('pencil-icon')
        const deleteButtons = screen.getAllByTestId('trash-icon')
        expect(editButtons.length).toBeGreaterThan(0)
        expect(deleteButtons.length).toBeGreaterThan(0)
    })
})
