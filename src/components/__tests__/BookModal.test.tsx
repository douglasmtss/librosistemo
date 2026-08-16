/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent } from '@testing-library/react'
import { BookModal } from '../BookModal'

jest.mock('react-icons/io', () => ({
    IoMdClose: ({ className }: { className?: string }): React.JSX.Element => (
        <span data-testid="close-icon" className={className} />
    )
}))

jest.mock('../Img', () => ({
    Img: ({
        src,
        alt,
        width,
        height
    }: {
        src: string
        alt: string
        width?: number
        height?: number
    }): React.JSX.Element => <img data-testid="book-image" src={src} alt={alt} width={width} height={height} />
}))

jest.mock('../BookStatus', () => ({
    BookStatus: ({ label }: { label: string }): React.JSX.Element => <div data-testid="book-status">{label}</div>
}))

describe('BookModal', () => {
    const mockOnClose = jest.fn()
    const mockBook: Book = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        category: 'Test Category',
        place: 'Test Place',
        amount: 5,
        status: 'available' as const,
        isbn: 123456,
        image: 'test-image.jpg',
        subtitle: 'Test Subtitle',
        description: 'Test Description'
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should render BookModal component', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('Test Book')).toBeTruthy()
    })

    test('should render book title', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('Test Book')).toBeTruthy()
    })

    test('should render book author', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('Test Author')).toBeTruthy()
    })

    test('should render book category', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('Test Category')).toBeTruthy()
    })

    test('should render book place', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('Test Place')).toBeTruthy()
    })

    test('should render book amount', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('5')).toBeTruthy()
    })

    test('should render close button', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByTestId('close-icon')).toBeTruthy()
    })

    test('should render book image', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByTestId('book-image')).toBeTruthy()
    })

    test('should render BookStatus component', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByTestId('book-status')).toBeTruthy()
    })

    test('should call onClose when close button is clicked', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        const closeButton = screen.getByTestId('close-icon').closest('button')

        if (closeButton) {
            fireEvent.click(closeButton)
        }

        expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('should render "Por:" label before author', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('Por:')).toBeTruthy()
    })

    test('should render "Categoria:" label before category', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('Categoria:')).toBeTruthy()
    })

    test('should render "Local:" label before place', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('Local:')).toBeTruthy()
    })

    test('should render "Quantidade:" label before amount', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        expect(screen.getByText('Quantidade:')).toBeTruthy()
    })

    test('should pass correct props to Img component', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        const image = screen.getByTestId('book-image') as HTMLImageElement
        expect(image.src).toContain('test-image.jpg')
        expect(image.alt).toBe('Test Book')
        expect(image.width).toBe(250)
        expect(image.height).toBe(350)
    })

    test('should render an overlay as the outermost element wrapping all content', () => {
        const { container } = render(<BookModal book={mockBook} onClose={mockOnClose} />)
        const overlay = container.firstChild as HTMLElement
        expect(overlay.tagName).toBe('DIV')
        expect(overlay.contains(screen.getByText('Test Book'))).toBe(true)
        expect(overlay.contains(screen.getByTestId('book-image'))).toBe(true)
    })

    test('should render a single modal content wrapper inside the overlay', () => {
        const { container } = render(<BookModal book={mockBook} onClose={mockOnClose} />)
        const overlay = container.firstChild as HTMLElement
        expect(overlay.children.length).toBe(1)
        expect((overlay.firstChild as HTMLElement).tagName).toBe('DIV')
    })

    test('should render close button as the first element of the modal content', () => {
        const { container } = render(<BookModal book={mockBook} onClose={mockOnClose} />)
        const content = (container.firstChild as HTMLElement).firstChild as HTMLElement
        const closeButton = content.firstChild as HTMLElement
        expect(closeButton.tagName).toBe('BUTTON')
        expect(closeButton.contains(screen.getByTestId('close-icon'))).toBe(true)
    })

    test('should render image section before details section', () => {
        const { container } = render(<BookModal book={mockBook} onClose={mockOnClose} />)
        const content = (container.firstChild as HTMLElement).firstChild as HTMLElement
        const [, imageSection, detailsSection] = Array.from(content.children) as HTMLElement[]
        expect(imageSection.contains(screen.getByTestId('book-image'))).toBe(true)
        expect(detailsSection.contains(screen.getByText('Test Book'))).toBe(true)
    })

    test('should apply generated styled-components classes to overlay and content', () => {
        const { container } = render(<BookModal book={mockBook} onClose={mockOnClose} />)
        const overlay = container.firstChild as HTMLElement
        const content = overlay.firstChild as HTMLElement
        expect(overlay.className).not.toBe('')
        expect(content.className).not.toBe('')
    })

    test('should render empty book object without errors', () => {
        const emptyBook = {}
        render(<BookModal book={emptyBook} onClose={mockOnClose} />)
        expect(screen.getByTestId('book-image')).toBeTruthy()
    })

    test('should handle book with undefined fields', () => {
        const bookWithUndefined = {
            ...mockBook,
            author: undefined as unknown as string
        }
        render(<BookModal book={bookWithUndefined} onClose={mockOnClose} />)
        expect(screen.getByTestId('close-icon')).toBeTruthy()
    })

    test('should return React.ReactNode', () => {
        const result = <BookModal book={mockBook} onClose={mockOnClose} />
        expect(result).toBeTruthy()
    })

    test('should render heading element for title', () => {
        render(<BookModal book={mockBook} onClose={mockOnClose} />)
        const title = screen.getByText('Test Book')
        expect(title.tagName).toBe('H1')
    })

    test('should render h4 element for status section', () => {
        const { container } = render(<BookModal book={mockBook} onClose={mockOnClose} />)
        const h4Elements = container.querySelectorAll('h4')
        expect(h4Elements.length).toBeGreaterThan(0)
    })
})
