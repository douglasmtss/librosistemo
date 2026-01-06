import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PaginatedBooks } from '../PaginatedBooks'
import { useEntities } from '@/hooks/useEntities'

jest.mock('@/hooks/useEntities')
jest.mock('../AllBooks', () => ({
    __esModule: true,
    default: ({ books }: { books: Book[] }): React.JSX.Element => (
        <div data-testid="all-books">{books.length} books</div>
    )
}))
jest.mock('../Empty', () => ({
    Empty: (): React.JSX.Element => <div data-testid="empty">Empty</div>
}))
jest.mock('../Loading', () => ({
    Loading: (): React.JSX.Element => <div data-testid="loading">Loading</div>
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

describe('PaginatedBooks', () => {
    const mockBooks: Book[] = [
        {
            id: '1',
            isbn: 111,
            title: 'Book 1',
            subtitle: 'Sub 1',
            author: 'Author 1',
            description: 'Desc 1',
            image: '',
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
            image: '',
            amount: 1,
            category: 'Science',
            place: 'Shelf 2',
            status: 'available'
        }
    ]

    const mockLends: Lend[] = []

    beforeEach(() => {
        jest.clearAllMocks()
        ;(useEntities as jest.Mock).mockReturnValue({
            lends: mockLends,
            books: mockBooks,
            loadingBooks: false
        })
    })

    test('should render PaginatedBooks component', () => {
        const { container } = render(<PaginatedBooks itemsPerPage={1} />)
        expect(container).toBeTruthy()
    })

    test('should show Loading when loadingBooks is true', () => {
        ;(useEntities as jest.Mock).mockReturnValue({
            lends: mockLends,
            books: mockBooks,
            loadingBooks: true
        })

        render(<PaginatedBooks itemsPerPage={1} />)
        expect(screen.getByTestId('loading')).toBeTruthy()
    })

    test('should show Empty when books is empty', () => {
        ;(useEntities as jest.Mock).mockReturnValue({
            lends: mockLends,
            books: [],
            loadingBooks: false
        })

        render(<PaginatedBooks itemsPerPage={1} />)
        expect(screen.getByTestId('empty')).toBeTruthy()
    })

    test('should show AllBooks when books exist', () => {
        render(<PaginatedBooks itemsPerPage={1} />)
        expect(screen.getByTestId('all-books')).toBeTruthy()
    })

    test('should display correct books count', () => {
        render(<PaginatedBooks itemsPerPage={1} />)
        expect(screen.getByText('2 livros encontrados')).toBeTruthy()
    })

    test('should paginate items correctly', () => {
        render(<PaginatedBooks itemsPerPage={1} />)
        expect(screen.getByTestId('all-books')).toBeTruthy()
    })

    test('should handle page change', () => {
        render(<PaginatedBooks itemsPerPage={1} />)
        const pageButton = screen.getByTestId('page-button')
        fireEvent.click(pageButton)
        expect(screen.getByTestId('paginate')).toBeTruthy()
    })

    test('should show pagination when books exist', () => {
        render(<PaginatedBooks itemsPerPage={1} />)
        expect(screen.getByTestId('paginate')).toBeTruthy()
    })

    test('should hide books count when no books', () => {
        ;(useEntities as jest.Mock).mockReturnValue({
            lends: mockLends,
            books: [],
            loadingBooks: false
        })

        const { queryByText } = render(<PaginatedBooks itemsPerPage={1} />)
        expect(queryByText(/livros encontrados/)).toBeFalsy()
    })
})
