import { validateIsbnFromGoogleApiItems } from '../validateIsbnFromGoogleApiItems'

describe('validateIsbnFromGoogleApiItems', () => {
    let mockVolumeInfo: VolumeInfo
    let mockGoogleApiBooksItem: GoogleApiBooksItem
    let testIsbn: string

    beforeEach(() => {
        testIsbn = '978-0-13-110362-7'

        mockVolumeInfo = {
            title: 'Clean Code',
            authors: ['Robert C. Martin'],
            publisher: 'Prentice Hall',
            publishedDate: '2008-08-01',
            description: 'A guide to writing better code',
            industryIdentifiers: [
                {
                    type: 'ISBN_10',
                    identifier: '0-13-110362-0'
                },
                {
                    type: 'ISBN_13',
                    identifier: testIsbn
                }
            ],
            readingModes: {
                text: true,
                image: false
            },
            pageCount: 464,
            printType: 'BOOK',
            categories: ['Computers'],
            maturityRating: 'NOT_MATURE',
            allowAnonLogging: true,
            contentVersion: '1.0.0',
            panelizationSummary: {
                containsEpubBubbles: false,
                containsImageBubbles: false
            },
            imageLinks: {
                smallThumbnail: 'http://example.com/small.jpg',
                thumbnail: 'http://example.com/thumb.jpg'
            },
            language: 'en',
            previewLink: 'http://example.com/preview',
            infoLink: 'http://example.com/info',
            canonicalVolumeLink: 'http://example.com/canonical'
        }

        mockGoogleApiBooksItem = {
            kind: 'books#volume',
            id: 'test-id-1',
            etag: 'test-etag-1',
            selfLink: 'http://example.com/self',
            volumeInfo: mockVolumeInfo,
            saleInfo: {
                country: 'US',
                saleability: 'FOR_SALE',
                isEbook: false
            },
            accessInfo: {
                country: 'US',
                viewability: 'PARTIAL',
                embeddable: true,
                publicDomain: false,
                textToSpeechPermission: 'ALLOWED',
                epub: { isAvailable: true },
                pdf: { isAvailable: true, acsTokenLink: '' },
                webReaderLink: '',
                accessViewStatus: 'SAMPLE',
                quoteSharingAllowed: false
            },
            searchInfo: {
                textSnippet: ''
            }
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return volumeInfo when ISBN is found in a single item', () => {
        const items = [mockGoogleApiBooksItem]
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result).toEqual(mockVolumeInfo)
        expect(result.title).toBe('Clean Code')
        expect(result.industryIdentifiers).toEqual(mockVolumeInfo.industryIdentifiers)
    })

    test('should return empty object when items array is empty', () => {
        const items: GoogleApiBooksItem[] = []
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result).toEqual({})
        expect(Object.keys(result).length).toBe(0)
    })

    test('should return empty object when ISBN is not found in any item', () => {
        const items = [mockGoogleApiBooksItem]
        const nonExistentIsbn = '999-999-999-999'
        const result = validateIsbnFromGoogleApiItems(items, nonExistentIsbn)

        expect(result).toEqual({})
    })

    test('should return volumeInfo when ISBN is found with first industryIdentifier', () => {
        const itemWithIsbnFirst = {
            ...mockGoogleApiBooksItem,
            volumeInfo: {
                ...mockVolumeInfo,
                industryIdentifiers: [
                    {
                        type: 'ISBN_13',
                        identifier: testIsbn
                    },
                    {
                        type: 'ISBN_10',
                        identifier: '0-13-110362-0'
                    }
                ]
            }
        }

        const items = [itemWithIsbnFirst]
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result).toEqual(itemWithIsbnFirst.volumeInfo)
    })

    test('should return volumeInfo when ISBN is found with last industryIdentifier', () => {
        const itemWithManyIdentifiers = {
            ...mockGoogleApiBooksItem,
            volumeInfo: {
                ...mockVolumeInfo,
                industryIdentifiers: [
                    {
                        type: 'ISBN_10',
                        identifier: '0-13-110362-0'
                    },
                    {
                        type: 'OTHER',
                        identifier: '123-456-789'
                    },
                    {
                        type: 'ISBN_13',
                        identifier: testIsbn
                    }
                ]
            }
        }

        const items = [itemWithManyIdentifiers]
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result).toEqual(itemWithManyIdentifiers.volumeInfo)
    })

    test('should return volumeInfo from last matching item when multiple items contain the ISBN', () => {
        const firstItem = {
            ...mockGoogleApiBooksItem,
            id: 'item-1',
            volumeInfo: {
                ...mockVolumeInfo,
                title: 'First Book'
            }
        }

        const secondItem = {
            ...mockGoogleApiBooksItem,
            id: 'item-2',
            volumeInfo: {
                ...mockVolumeInfo,
                title: 'Second Book'
            }
        }

        const items = [firstItem, secondItem]
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result.title).toBe('Second Book')
    })

    test('should merge volumeInfo properties when ISBN matches multiple industryIdentifiers in same item', () => {
        const itemWithDuplicateIsbn = {
            ...mockGoogleApiBooksItem,
            volumeInfo: {
                ...mockVolumeInfo,
                industryIdentifiers: [
                    {
                        type: 'ISBN_13',
                        identifier: testIsbn
                    },
                    {
                        type: 'ISBN_13_ALT',
                        identifier: testIsbn
                    }
                ]
            }
        }

        const items = [itemWithDuplicateIsbn]
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result).toEqual(itemWithDuplicateIsbn.volumeInfo)
    })

    test('should handle items with empty industryIdentifiers array', () => {
        const itemWithEmptyIdentifiers = {
            ...mockGoogleApiBooksItem,
            volumeInfo: {
                ...mockVolumeInfo,
                industryIdentifiers: []
            }
        }

        const items = [itemWithEmptyIdentifiers]
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result).toEqual({})
    })

    test('should handle multiple items with some matching and some not matching', () => {
        const matchingItem = {
            ...mockGoogleApiBooksItem,
            id: 'matching-item',
            volumeInfo: {
                ...mockVolumeInfo,
                title: 'Matching Book'
            }
        }

        const nonMatchingItem = {
            ...mockGoogleApiBooksItem,
            id: 'non-matching-item',
            volumeInfo: {
                ...mockVolumeInfo,
                title: 'Non Matching Book',
                industryIdentifiers: [
                    {
                        type: 'ISBN_13',
                        identifier: '999-999-999-999'
                    }
                ]
            }
        }

        const items = [nonMatchingItem, matchingItem]
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result.title).toBe('Matching Book')
    })

    test('should return object with all volumeInfo properties', () => {
        const items = [mockGoogleApiBooksItem]
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result).toHaveProperty('title')
        expect(result).toHaveProperty('authors')
        expect(result).toHaveProperty('publisher')
        expect(result).toHaveProperty('publishedDate')
        expect(result).toHaveProperty('description')
        expect(result).toHaveProperty('industryIdentifiers')
        expect(result).toHaveProperty('readingModes')
        expect(result).toHaveProperty('pageCount')
        expect(result).toHaveProperty('printType')
        expect(result).toHaveProperty('categories')
        expect(result).toHaveProperty('maturityRating')
        expect(result).toHaveProperty('allowAnonLogging')
        expect(result).toHaveProperty('contentVersion')
        expect(result).toHaveProperty('panelizationSummary')
        expect(result).toHaveProperty('imageLinks')
        expect(result).toHaveProperty('language')
        expect(result).toHaveProperty('previewLink')
        expect(result).toHaveProperty('infoLink')
        expect(result).toHaveProperty('canonicalVolumeLink')
    })

    test('should perform exact case-sensitive ISBN matching', () => {
        const items = [mockGoogleApiBooksItem]
        const lowercaseIsbn = testIsbn.toLowerCase()
        const result = validateIsbnFromGoogleApiItems(items, lowercaseIsbn)

        expect(result).toEqual(mockVolumeInfo)
    })

    test('should not modify original items array', () => {
        const items = [{ ...mockGoogleApiBooksItem }]
        const originalJSON = JSON.stringify(items)

        validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(JSON.stringify(items)).toBe(originalJSON)
    })

    test('should return correct result with complex nested structures', () => {
        const complexItem = {
            ...mockGoogleApiBooksItem,
            volumeInfo: {
                ...mockVolumeInfo,
                authors: ['Author 1', 'Author 2', 'Author 3'],
                categories: ['Category 1', 'Category 2'],
                imageLinks: {
                    smallThumbnail: 'http://example.com/small-complex.jpg',
                    thumbnail: 'http://example.com/thumb-complex.jpg'
                }
            }
        }

        const items = [complexItem]
        const result = validateIsbnFromGoogleApiItems(items, testIsbn)

        expect(result.authors).toHaveLength(3)
        expect(result.categories).toHaveLength(2)
        expect(result.imageLinks.thumbnail).toBe('http://example.com/thumb-complex.jpg')
    })
})
