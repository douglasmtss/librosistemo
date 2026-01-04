import { renderHook, act, waitFor } from '@testing-library/react'
import { useEntities } from '@/hooks/useEntities'
import { api } from '@/services/api'

jest.mock('@/services/api')

describe('useEntities', () => {
    const mockBooks: Book[] = [
        {
            id: '1',
            isbn: 9780134685991,
            title: 'Clean Code',
            subtitle: 'A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            description: 'A guide to writing clean code',
            image: 'https://example.com/image.jpg',
            amount: 5,
            category: 'Programming',
            place: 'Shelf A'
        },
        {
            id: '2',
            isbn: 9780596007683,
            title: 'JavaScript: The Good Parts',
            subtitle: 'Unearthing the Excellence in JavaScript',
            author: 'Douglas Crockford',
            description: 'A guide to JavaScript',
            image: 'https://example.com/image2.jpg',
            amount: 3,
            category: 'Programming',
            place: 'Shelf B'
        }
    ]

    const mockUsers: User[] = [
        {
            id: '1',
            first_name: 'John',
            last_name: 'Doe',
            phone: '11999999999'
        },
        {
            id: '2',
            first_name: 'Jane',
            last_name: 'Smith',
            phone: '11888888888'
        }
    ]

    const mockLends: Lend[] = [
        {
            id: '1',
            user_id: 'user1',
            first_name: 'John',
            last_name: 'Doe',
            book_id: 1,
            book_title: 'Clean Code',
            created: '2024-01-01'
        },
        {
            id: '2',
            user_id: 'user2',
            first_name: 'Jane',
            last_name: 'Smith',
            book_id: 2,
            book_title: 'JavaScript: The Good Parts',
            created: '2024-01-02'
        }
    ]

    beforeEach(() => {
        jest.clearAllMocks()
        ;(api.sheet.books.get as jest.Mock).mockResolvedValue(mockBooks)
        ;(api.sheet.users.get as jest.Mock).mockResolvedValue(mockUsers)
        ;(api.sheet.lends.get as jest.Mock).mockResolvedValue(mockLends)
    })

    test('should initialize with empty arrays', () => {
        const { result } = renderHook(() => useEntities([]))

        expect(result.current.books).toEqual([])
        expect(result.current.users).toEqual([])
        expect(result.current.lends).toEqual([])
    })

    test('should initialize with loading states as true', () => {
        const { result } = renderHook(() => useEntities([]))

        expect(result.current.loadingBooks).toBe(true)
        expect(result.current.loadingUsers).toBe(true)
        expect(result.current.loadingLends).toBe(true)
    })

    test('should fetch books when dataType includes "books"', async () => {
        const { result } = renderHook(() => useEntities(['books']))

        await waitFor(() => {
            expect(result.current.loadingBooks).toBe(false)
        })

        expect(api.sheet.books.get).toHaveBeenCalled()
        expect(result.current.books).toEqual(mockBooks)
        expect(result.current.filteredBooks).toEqual(mockBooks)
    })

    test('should fetch users when dataType includes "users"', async () => {
        const { result } = renderHook(() => useEntities(['users']))

        await waitFor(() => {
            expect(result.current.loadingUsers).toBe(false)
        })

        expect(api.sheet.users.get).toHaveBeenCalled()
        expect(result.current.users).toEqual(mockUsers)
        expect(result.current.filteredUsers).toEqual(mockUsers)
    })

    test('should fetch lends when dataType includes "lends"', async () => {
        const { result } = renderHook(() => useEntities(['lends']))

        await waitFor(() => {
            expect(result.current.loadingLends).toBe(false)
        })

        expect(api.sheet.lends.get).toHaveBeenCalled()
        expect(result.current.lends).toEqual(mockLends)
        expect(result.current.filteredLends).toEqual(mockLends)
    })

    test('should fetch all data when dataType includes "all"', async () => {
        const { result } = renderHook(() => useEntities(['all']))

        await waitFor(() => {
            expect(result.current.loadingBooks).toBe(false)
            expect(result.current.loadingUsers).toBe(false)
            expect(result.current.loadingLends).toBe(false)
        })

        expect(api.sheet.books.get).toHaveBeenCalled()
        expect(api.sheet.users.get).toHaveBeenCalled()
        expect(api.sheet.lends.get).toHaveBeenCalled()
        expect(result.current.books).toEqual(mockBooks)
        expect(result.current.users).toEqual(mockUsers)
        expect(result.current.lends).toEqual(mockLends)
    })

    test('should create options for books', async () => {
        const { result } = renderHook(() => useEntities(['books']))

        await waitFor(() => {
            expect(result.current.loadingBooks).toBe(false)
        })

        expect(result.current.optionsBooks).toEqual([
            { label: 'Clean Code', value: '1' },
            { label: 'JavaScript: The Good Parts', value: '2' }
        ])
    })

    test('should create options for users', async () => {
        const { result } = renderHook(() => useEntities(['users']))

        await waitFor(() => {
            expect(result.current.loadingUsers).toBe(false)
        })

        expect(result.current.optionsUsers).toEqual([
            { label: 'John Doe', value: '1' },
            { label: 'Jane Smith', value: '2' }
        ])
    })

    test('should create options for lends', async () => {
        const { result } = renderHook(() => useEntities(['lends']))

        await waitFor(() => {
            expect(result.current.loadingLends).toBe(false)
        })

        expect(result.current.optionsLends).toEqual([
            { label: 'John Doe', value: '1' },
            { label: 'Jane Smith', value: '2' }
        ])
    })

    test('should allow updating books state', async () => {
        const { result } = renderHook(() => useEntities(['books']))

        await waitFor(() => {
            expect(result.current.loadingBooks).toBe(false)
        })

        const newBook: Book = {
            id: '3',
            isbn: 9781491927281,
            title: 'You Don\'t Know JS Yet',
            subtitle: 'Getting Started',
            author: 'Kyle Simpson',
            description: 'A JavaScript book',
            image: 'https://example.com/image3.jpg',
            amount: 2,
            category: 'Programming',
            place: 'Shelf C'
        }

        act(() => {
            result.current.setBooks([...result.current.books, newBook])
        })

        expect(result.current.books).toHaveLength(3)
        expect(result.current.books[2]).toEqual(newBook)
    })

    test('should allow updating filtered books', async () => {
        const { result } = renderHook(() => useEntities(['books']))

        await waitFor(() => {
            expect(result.current.loadingBooks).toBe(false)
        })

        const filtered = [mockBooks[0]]

        act(() => {
            result.current.setFilteredBooks(filtered)
        })

        expect(result.current.filteredBooks).toEqual(filtered)
    })

    test('should allow updating filtered users', async () => {
        const { result } = renderHook(() => useEntities(['users']))

        await waitFor(() => {
            expect(result.current.loadingUsers).toBe(false)
        })

        const filtered = [mockUsers[0]]

        act(() => {
            result.current.setFilteredUsers(filtered)
        })

        expect(result.current.filteredUsers).toEqual(filtered)
    })

    test('should allow updating filtered lends', async () => {
        const { result } = renderHook(() => useEntities(['lends']))

        await waitFor(() => {
            expect(result.current.loadingLends).toBe(false)
        })

        const filtered = [mockLends[0]]

        act(() => {
            result.current.setFilteredLends(filtered)
        })

        expect(result.current.filteredLends).toEqual(filtered)
    })

    test('should handle multiple dataTypes', async () => {
        const { result } = renderHook(() => useEntities(['books', 'users']))

        await waitFor(() => {
            expect(result.current.loadingBooks).toBe(false)
            expect(result.current.loadingUsers).toBe(false)
        })

        expect(result.current.books).toEqual(mockBooks)
        expect(result.current.users).toEqual(mockUsers)
        expect(result.current.lends).toEqual([])
    })

    test('should not fetch when dataType is empty array', async () => {
        const { result } = renderHook(() => useEntities([]))

        expect(api.sheet.books.get).not.toHaveBeenCalled()
        expect(api.sheet.users.get).not.toHaveBeenCalled()
        expect(api.sheet.lends.get).not.toHaveBeenCalled()
        expect(result.current.books).toEqual([])
    })

    test('should set loading states to false after fetching', async () => {
        const { result } = renderHook(() => useEntities(['books', 'users', 'lends']))

        await waitFor(() => {
            expect(result.current.loadingBooks).toBe(false)
            expect(result.current.loadingUsers).toBe(false)
            expect(result.current.loadingLends).toBe(false)
        })

        expect(result.current.loadingBooks).toBe(false)
        expect(result.current.loadingUsers).toBe(false)
        expect(result.current.loadingLends).toBe(false)
    })

    test('should return all setter functions', async () => {
        const { result } = renderHook(() => useEntities([]))

        expect(typeof result.current.setBooks).toBe('function')
        expect(typeof result.current.setUsers).toBe('function')
        expect(typeof result.current.setLends).toBe('function')
        expect(typeof result.current.setFilteredBooks).toBe('function')
        expect(typeof result.current.setFilteredUsers).toBe('function')
        expect(typeof result.current.setFilteredLends).toBe('function')
        expect(typeof result.current.setLoadingBooks).toBe('function')
        expect(typeof result.current.setLoadingUsers).toBe('function')
        expect(typeof result.current.setLoadingLends).toBe('function')
        expect(typeof result.current.setOptionsBooks).toBe('function')
        expect(typeof result.current.setOptionsUsers).toBe('function')
        expect(typeof result.current.setOptionsLends).toBe('function')
    })

    test('should handle API errors gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        ;(api.sheet.books.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

        const { result } = renderHook(() => useEntities(['books']))

        await waitFor(() => {
            expect(result.current.loadingBooks).toBe(false)
        })

        expect(result.current.books).toEqual([])
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching books:', expect.any(Error))
        consoleSpy.mockRestore()
    })
})
