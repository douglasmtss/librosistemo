import { checkIfBookAlreadyExists } from '../checkIfBookAlreadyExists'

describe('checkIfBookAlreadyExists', (): void => {
    let libraryBooks: Book[]
    let incomingBooks: BrasilapiBook[]

    beforeEach((): void => {
        libraryBooks = [
            {
                isbn: 978000000001,
                title: 'Existing Book',
                subtitle: 'First Edition',
                author: 'Author A',
                description: 'Already catalogued book',
                image: 'image-a',
                amount: 1,
                category: 'Fiction'
            },
            {
                isbn: 978000000002,
                title: 'Another Existing Book',
                subtitle: 'Collector Edition',
                author: 'Author B',
                description: 'Second book in library',
                image: 'image-b',
                amount: 2,
                category: 'Non-fiction'
            }
        ]

        incomingBooks = [
            {
                isbn: '978000000001',
                title: 'Existing Book',
                subtitle: 'First Edition',
                authors: ['Author A'],
                publisher: 'Publisher A',
                synopsis: 'Synopsis A',
                dimensions: '10x10',
                year: '2020',
                format: 'Paperback',
                page_count: '321',
                subjects: ['Fiction'],
                location: 'Shelf A',
                retail_price: '19.90',
                cover_url: 'cover-a',
                provider: 'BrasilAPI'
            },
            {
                isbn: '978000000003',
                title: 'New Arrival',
                subtitle: 'Limited Edition',
                authors: ['Author C'],
                publisher: 'Publisher C',
                synopsis: 'Synopsis C',
                dimensions: '15x10',
                year: '2022',
                format: 'Hardcover',
                page_count: '250',
                subjects: ['Adventure'],
                location: 'Shelf B',
                retail_price: '29.90',
                cover_url: 'cover-c',
                provider: 'BrasilAPI'
            }
        ]
    })

    afterEach((): void => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('when there are no registered books', (): void => {
        test('should return all incoming books as filtered with no duplicates', async (): Promise<void> => {
            const result = await checkIfBookAlreadyExists([], incomingBooks)

            expect(result.alreadyExists).toEqual([])
            expect(result.filteredBooks).toEqual(incomingBooks)
        })
    })

    describe('handling duplicates without callback', (): void => {
        test('should collect existing ISBNs and exclude them from filtered list', async (): Promise<void> => {
            const result = await checkIfBookAlreadyExists(libraryBooks, incomingBooks)

            expect(result.alreadyExists).toEqual(['978000000001'])
            expect(result.filteredBooks).toHaveLength(1)
            expect(result.filteredBooks[0].isbn).toBe('978000000003')
        })
    })

    describe('handling duplicates with callback', (): void => {
        test('should invoke callback for each duplicate and include remaining books', async (): Promise<void> => {
            const callbacks = {
                onAlreadyExists: jest.fn()
            }
            const callbackSpy = jest.spyOn(callbacks, 'onAlreadyExists')

            const result = await checkIfBookAlreadyExists(libraryBooks, incomingBooks, callbacks.onAlreadyExists)

            expect(callbackSpy).toHaveBeenCalledTimes(1)
            expect(callbackSpy).toHaveBeenCalledWith('978000000001')
            expect(result.alreadyExists).toEqual(['978000000001'])
            expect(result.filteredBooks).toHaveLength(1)
            expect(result.filteredBooks[0].isbn).toBe('978000000003')
        })
    })

    describe('mixed catalogue scenario', (): void => {
        test('should flag multiple duplicates and keep entirely new entries', async (): Promise<void> => {
            const extendedIncoming: BrasilapiBook[] = [
                ...incomingBooks,
                {
                    isbn: '978000000002',
                    title: 'Another Existing Book',
                    subtitle: 'Collector Edition',
                    authors: ['Author B'],
                    publisher: 'Publisher B',
                    synopsis: 'Synopsis B',
                    dimensions: '12x8',
                    year: '2019',
                    format: 'Digital',
                    page_count: '410',
                    subjects: ['Biography'],
                    location: 'Shelf C',
                    retail_price: '15.00',
                    cover_url: 'cover-b',
                    provider: 'BrasilAPI'
                }
            ]

            const result = await checkIfBookAlreadyExists(libraryBooks, extendedIncoming)

            expect(result.alreadyExists).toEqual(['978000000001', '978000000002'])
            expect(result.filteredBooks).toHaveLength(1)
            expect(result.filteredBooks[0].isbn).toBe('978000000003')
        })
    })
})
