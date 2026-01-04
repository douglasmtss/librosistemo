import { getBookAmountAndAvailable, UseAvailableBooksState } from '@/hooks/getBookAmountAndAvailable'

describe('getBookAmountAndAvailable', () => {
    test('should return correct values when book exists with lends', () => {
        const books: Book[] = [
            {
                id: '1',
                isbn: 123456,
                title: 'Test Book',
                subtitle: 'Subtitle',
                author: 'Author',
                description: 'Description',
                image: 'image.jpg',
                amount: 5,
                category: 'Fiction',
                place: 'Shelf 1'
            }
        ]

        const lends: Lend[] = [
            {
                id: '1',
                user_id: 'user1',
                first_name: 'John',
                last_name: 'Doe',
                book_id: '1',
                book_title: 'Test Book',
                created: '2024-01-01'
            },
            {
                id: '2',
                user_id: 'user2',
                first_name: 'Jane',
                last_name: 'Doe',
                book_id: '1',
                book_title: 'Test Book',
                created: '2024-01-02'
            }
        ]

        const result = getBookAmountAndAvailable('1', books, lends)

        expect(result).toEqual({
            selectedBookAmount: 5,
            booksAvailable: 3
        })
    })

    test('should return correct values when book exists without lends', () => {
        const books: Book[] = [
            {
                id: '1',
                isbn: 123456,
                title: 'Test Book',
                subtitle: 'Subtitle',
                author: 'Author',
                description: 'Description',
                image: 'image.jpg',
                amount: 5,
                category: 'Fiction',
                place: 'Shelf 1'
            }
        ]

        const lends: Lend[] = []

        const result = getBookAmountAndAvailable('1', books, lends)

        expect(result).toEqual({
            selectedBookAmount: 5,
            booksAvailable: 5
        })
    })

    test('should return zero values when book is not found', () => {
        const books: Book[] = [
            {
                id: '1',
                isbn: 123456,
                title: 'Test Book',
                subtitle: 'Subtitle',
                author: 'Author',
                description: 'Description',
                image: 'image.jpg',
                amount: 5,
                category: 'Fiction',
                place: 'Shelf 1'
            }
        ]

        const lends: Lend[] = []

        const result = getBookAmountAndAvailable('999', books, lends)

        expect(result).toEqual({
            selectedBookAmount: 0,
            booksAvailable: 0
        })
    })

    test('should return zero values when books array is empty', () => {
        const books: Book[] = []
        const lends: Lend[] = []

        const result = getBookAmountAndAvailable('1', books, lends)

        expect(result).toEqual({
            selectedBookAmount: 0,
            booksAvailable: 0
        })
    })

    test('should handle all books lent out', () => {
        const books: Book[] = [
            {
                id: '1',
                isbn: 123456,
                title: 'Test Book',
                subtitle: 'Subtitle',
                author: 'Author',
                description: 'Description',
                image: 'image.jpg',
                amount: 3,
                category: 'Fiction',
                place: 'Shelf 1'
            }
        ]

        const lends: Lend[] = [
            {
                id: '1',
                user_id: 'user1',
                first_name: 'John',
                last_name: 'Doe',
                book_id: '1',
                book_title: 'Test Book',
                created: '2024-01-01'
            },
            {
                id: '2',
                user_id: 'user2',
                first_name: 'Jane',
                last_name: 'Doe',
                book_id: '1',
                book_title: 'Test Book',
                created: '2024-01-02'
            },
            {
                id: '3',
                user_id: 'user3',
                first_name: 'Bob',
                last_name: 'Smith',
                book_id: '1',
                book_title: 'Test Book',
                created: '2024-01-03'
            }
        ]

        const result = getBookAmountAndAvailable('1', books, lends)

        expect(result).toEqual({
            selectedBookAmount: 3,
            booksAvailable: 0
        })
    })

    test('should return correct result type', () => {
        const books: Book[] = []
        const lends: Lend[] = []

        const result = getBookAmountAndAvailable('1', books, lends)

        expect(result).toHaveProperty('selectedBookAmount')
        expect(result).toHaveProperty('booksAvailable')
        expect(typeof result.selectedBookAmount).toBe('number')
        expect(typeof result.booksAvailable).toBe('number')
    })

    test('should filter lends by book_id correctly', () => {
        const books: Book[] = [
            {
                id: '1',
                isbn: 123456,
                title: 'Test Book 1',
                subtitle: 'Subtitle',
                author: 'Author',
                description: 'Description',
                image: 'image.jpg',
                amount: 5,
                category: 'Fiction',
                place: 'Shelf 1'
            },
            {
                id: '2',
                isbn: 789012,
                title: 'Test Book 2',
                subtitle: 'Subtitle',
                author: 'Author',
                description: 'Description',
                image: 'image.jpg',
                amount: 3,
                category: 'Fiction',
                place: 'Shelf 2'
            }
        ]

        const lends: Lend[] = [
            {
                id: '1',
                user_id: 'user1',
                first_name: 'John',
                last_name: 'Doe',
                book_id: '1',
                book_title: 'Test Book 1',
                created: '2024-01-01'
            },
            {
                id: '2',
                user_id: 'user2',
                first_name: 'Jane',
                last_name: 'Doe',
                book_id: '2',
                book_title: 'Test Book 2',
                created: '2024-01-02'
            }
        ]

        const result1 = getBookAmountAndAvailable('1', books, lends)
        const result2 = getBookAmountAndAvailable('2', books, lends)

        expect(result1).toEqual({
            selectedBookAmount: 5,
            booksAvailable: 4
        })
        expect(result2).toEqual({
            selectedBookAmount: 3,
            booksAvailable: 2
        })
    })

    test('should handle string book_id comparison', () => {
        const books: Book[] = [
            {
                id: '123',
                isbn: 123456,
                title: 'Test Book',
                subtitle: 'Subtitle',
                author: 'Author',
                description: 'Description',
                image: 'image.jpg',
                amount: 5,
                category: 'Fiction',
                place: 'Shelf 1'
            }
        ]

        const lends: Lend[] = [
            {
                id: '1',
                user_id: 'user1',
                first_name: 'John',
                last_name: 'Doe',
                book_id: '123',
                book_title: 'Test Book',
                created: '2024-01-01'
            }
        ]

        const result = getBookAmountAndAvailable('123', books, lends)

        expect(result).toEqual({
            selectedBookAmount: 5,
            booksAvailable: 4
        })
    })

    test('should return valid UseAvailableBooksState object', () => {
        const books: Book[] = [
            {
                id: '1',
                isbn: 123456,
                title: 'Test Book',
                subtitle: 'Subtitle',
                author: 'Author',
                description: 'Description',
                image: 'image.jpg',
                amount: 5,
                category: 'Fiction',
                place: 'Shelf 1'
            }
        ]

        const lends: Lend[] = []

        const result: UseAvailableBooksState = getBookAmountAndAvailable('1', books, lends)

        expect(result).toBeInstanceOf(Object)
        expect(Object.keys(result).length).toBe(2)
        expect(result.booksAvailable).toBeGreaterThanOrEqual(0)
        expect(result.selectedBookAmount).toBeGreaterThanOrEqual(0)
    })
})
