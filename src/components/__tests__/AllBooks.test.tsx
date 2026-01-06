/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AllBooks from '../AllBooks'
import { getBookAmountAndAvailable } from '@/hooks/getBookAmountAndAvailable'

jest.mock('@/hooks/getBookAmountAndAvailable')
jest.mock('../BookModal', (): object => ({
    BookModal: ({ onClose, book }: { onClose: () => void; book: Book }): React.ReactNode => (
        <div data-testid="book-modal" onClick={onClose}>
            Modal for {book.title}
        </div>
    )
}))
jest.mock('../Img', (): object => ({
    Img: ({ src, alt }: { src: string; alt: string }): React.ReactNode => <img src={src} alt={alt} />
}))
jest.mock('../BookStatus', (): object => ({
    BookStatus: ({ label }: { label: string }): React.ReactNode => <span>{label}</span>
}))
jest.mock('../TextElipsis', (): object => ({
    TextElipsis: ({ text }: { text: string }): React.ReactNode => <div>{text}</div>
}))
jest.mock('../BackToTopButton', (): object => ({
    BackToTopButton: (): React.ReactNode => <div data-testid="back-to-top">Back to Top</div>
}))

describe('AllBooks', (): void => {
    const mockGetBookAmountAndAvailable = getBookAmountAndAvailable as jest.Mock

    const mockBooks: Book[] = [
        {
            id: '1',
            isbn: 123456,
            title: 'Book 1',
            subtitle: 'Subtitle 1',
            author: 'Author 1',
            description: 'Description 1',
            image: 'image1.jpg',
            amount: 5,
            category: 'Category 1',
            place: 'Place 1',
            status: 'available'
        },
        {
            id: '2',
            isbn: 789012,
            title: 'Book 2',
            subtitle: 'Subtitle 2',
            author: 'Author 2',
            description: 'Description 2',
            image: 'image2.jpg',
            amount: 3,
            category: 'Category 2',
            place: 'Place 2',
            status: 'borrowed'
        }
    ]

    const mockLends: Lend[] = [
        {
            id: '1',
            book_id: '1',
            user_id: '1',
            first_name: 'string',
            last_name: 'string',
            book_title: 'string',
            created: 'string'
        }
    ]

    beforeEach((): void => {
        jest.clearAllMocks()
        mockGetBookAmountAndAvailable.mockReturnValue({
            booksAvailable: 4,
            booksBorrowed: 1
        })
    })

    afterEach((): void => {
        jest.clearAllMocks()
    })

    test('should render all books', (): void => {
        render(<AllBooks books={mockBooks} lends={mockLends} />)

        expect(screen.getByText('Book 1')).toBeTruthy()
        expect(screen.getByText('Book 2')).toBeTruthy()
    })

    test('should render BackToTopButton', (): void => {
        render(<AllBooks books={mockBooks} lends={mockLends} />)

        expect(screen.getByTestId('back-to-top')).toBeTruthy()
    })

    test('should render book information correctly', (): void => {
        render(<AllBooks books={mockBooks} lends={mockLends} />)

        expect(screen.getByText('Author 1')).toBeTruthy()
        expect(screen.getByText('Author 2')).toBeTruthy()
        expect(screen.getByText('Quantidade: 5')).toBeTruthy()
        expect(screen.getByText('Quantidade: 3')).toBeTruthy()
    })

    test('should display available books count', (): void => {
        const { container } = render(<AllBooks books={mockBooks} lends={mockLends} />)

        // Check if the available count is displayed (appears twice, once for each book)
        const availableTexts = container.querySelectorAll('div')
        let foundAvailable = false
        availableTexts.forEach(el => {
            if (el.textContent?.includes('Disponíveis: 4')) {
                foundAvailable = true
            }
        })
        expect(foundAvailable).toBe(true)
    })

    test('should open modal when book card is clicked', (): void => {
        render(<AllBooks books={mockBooks} lends={mockLends} />)

        const bookTitle = screen.getByText('Book 1')
        const bookCard = bookTitle.closest('h2')?.parentElement?.parentElement

        if (bookCard) {
            fireEvent.click(bookCard)
        }

        const modal = screen.queryByTestId('book-modal')
        expect(modal).toBeTruthy()
    })

    test('should close modal when onClose is called', (): void => {
        render(<AllBooks books={mockBooks} lends={mockLends} />)

        const bookTitle = screen.getByText('Book 1')
        const bookCard = bookTitle.closest('h2')?.parentElement?.parentElement

        if (bookCard) {
            fireEvent.click(bookCard)
        }

        let modal = screen.queryByTestId('book-modal')
        expect(modal).toBeTruthy()

        fireEvent.click(modal as HTMLElement)

        // Modal should not be visible anymore since openModal is reset
        modal = screen.queryByText(/Modal for Book 1/)
        expect(modal).toBeFalsy()
    })

    test('should render empty list when no books provided', (): void => {
        const { container } = render(<AllBooks books={[]} lends={[]} />)

        const bookCards = container.querySelectorAll('[class*="max-w-72"]')
        expect(bookCards.length).toBe(0)
    })

    test('should call getBookAmountAndAvailable for each book', (): void => {
        render(<AllBooks books={mockBooks} lends={mockLends} />)

        expect(mockGetBookAmountAndAvailable).toHaveBeenCalledWith('1', mockBooks, mockLends)
        expect(mockGetBookAmountAndAvailable).toHaveBeenCalledWith('2', mockBooks, mockLends)
        expect(mockGetBookAmountAndAvailable).toHaveBeenCalledTimes(2)
    })

    test('should render book status badge', (): void => {
        render(<AllBooks books={mockBooks} lends={mockLends} />)

        expect(screen.getByText('available')).toBeTruthy()
        expect(screen.getByText('borrowed')).toBeTruthy()
    })

    test('should render images with correct alt text', (): void => {
        render(<AllBooks books={mockBooks} lends={mockLends} />)

        const images = screen.getAllByAltText(/Book/)
        expect(images.length).toBe(2)
        expect((images[0] as HTMLImageElement).alt).toBe('Book 1')
        expect((images[1] as HTMLImageElement).alt).toBe('Book 2')
    })

    test('should handle multiple clicks on different books', (): void => {
        render(<AllBooks books={mockBooks} lends={mockLends} />)

        const firstBookText = screen.getByText('Book 1')
        const firstBookCard = firstBookText.closest('h2')?.parentElement?.parentElement

        if (firstBookCard) {
            fireEvent.click(firstBookCard)
        }

        let modal = screen.queryByTestId('book-modal')
        expect(modal).toBeTruthy()

        fireEvent.click(modal as HTMLElement)

        // After closing, try opening a different book
        const secondBookText = screen.getByText('Book 2')
        const secondBookCard = secondBookText.closest('h2')?.parentElement?.parentElement

        if (secondBookCard) {
            fireEvent.click(secondBookCard)
        }

        modal = screen.queryByTestId('book-modal')
        expect(modal).toBeTruthy()
    })

    test('should render with different book amounts', (): void => {
        const booksWithDifferentAmounts: Book[] = [
            { ...mockBooks[0], amount: 1 },
            { ...mockBooks[1], amount: 10 }
        ]

        render(<AllBooks books={booksWithDifferentAmounts} lends={[]} />)

        expect(screen.getByText('Quantidade: 1')).toBeTruthy()
        expect(screen.getByText('Quantidade: 10')).toBeTruthy()
    })

    test('should render only one book when single book provided', (): void => {
        const singleBook = [mockBooks[0]]
        render(<AllBooks books={singleBook} lends={mockLends} />)

        expect(screen.getByText('Book 1')).toBeTruthy()
        expect(screen.queryByText('Book 2')).toBeFalsy()
    })

    test('should handle book with undefined available amount', (): void => {
        mockGetBookAmountAndAvailable.mockReturnValueOnce({
            booksAvailable: 0,
            booksBorrowed: 5
        })

        render(<AllBooks books={mockBooks} lends={mockLends} />)

        expect(screen.getByText('Disponíveis: 0')).toBeTruthy()
    })
})
