import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { Sheet } from '@/enums/sheets'
import { Row } from '@/types/spreadsheet'
import { getRowIndexById, rawRowsToRows, fetchGoogleSheets } from '../spreadsheetToDTO'
import * as googleSpreadsheetModule from '../google-spreadsheet'

jest.mock('../google-spreadsheet')

type MockWorksheet = jest.Mocked<Partial<GoogleSpreadsheetWorksheet>>
type MockRow = {
    rowNumber: number
    get: jest.Mock<string | undefined>
    toObject: jest.Mock<Record<string, unknown>>
    assign: jest.Mock<void>
    save: jest.Mock<Promise<void>>
    delete: jest.Mock<Promise<void>>
}

describe('spreadsheetToDTO', (): void => {
    let mockGetRows: jest.Mock
    let mockWorksheet: MockWorksheet
    let mockRows: MockRow[]
    let consoleErrorSpy: jest.SpyInstance<void, unknown[]>
    const mockGetGoogleSpreadsheet = googleSpreadsheetModule.getGoogleSpreadsheet as jest.MockedFunction<
        typeof googleSpreadsheetModule.getGoogleSpreadsheet
    >

    beforeEach((): void => {
        jest.clearAllMocks()

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

        mockRows = [
            {
                rowNumber: 2,
                get: jest.fn((key: string) => (key === 'id' ? 'test-id-1' : undefined)),
                toObject: jest.fn(() => ({ id: 'test-id-1', name: 'Book 1' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            },
            {
                rowNumber: 3,
                get: jest.fn((key: string) => (key === 'id' ? 'test-id-2' : undefined)),
                toObject: jest.fn(() => ({ id: 'test-id-2', name: 'Book 2' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            }
        ] as MockRow[]

        mockGetRows = jest.fn().mockResolvedValue(mockRows)

        mockWorksheet = {
            getRows: mockGetRows,
            addRow: jest.fn().mockResolvedValue(undefined),
            sheetsByTitle: {}
        } as MockWorksheet
    })

    afterEach((): void => {
        consoleErrorSpy.mockRestore()
        jest.clearAllMocks()
    })

    describe('getRowIndexById', (): void => {
        test('should return row index when id is found', async (): Promise<void> => {
            const result = await getRowIndexById(mockWorksheet as GoogleSpreadsheetWorksheet, 'test-id-1')

            expect(result).toBe('2')
            expect(mockGetRows).toHaveBeenCalledTimes(1)
        })

        test('should return undefined when id is not found', async (): Promise<void> => {
            const result = await getRowIndexById(mockWorksheet as GoogleSpreadsheetWorksheet, 'non-existent-id')

            expect(result).toBeUndefined()
            expect(mockGetRows).toHaveBeenCalledTimes(1)
        })

        test('should call getRows on worksheet', async (): Promise<void> => {
            await getRowIndexById(mockWorksheet as GoogleSpreadsheetWorksheet, 'test-id-1')

            expect(mockGetRows).toHaveBeenCalled()
        })

        test('should return correct row index for second item', async (): Promise<void> => {
            const result = await getRowIndexById(mockWorksheet as GoogleSpreadsheetWorksheet, 'test-id-2')

            expect(result).toBe('3')
        })
    })

    describe('rawRowsToRows', (): void => {
        test('should convert raw rows to objects array', async (): Promise<void> => {
            const result = await rawRowsToRows(mockWorksheet as GoogleSpreadsheetWorksheet)

            expect(result).toEqual([
                { id: 'test-id-1', name: 'Book 1' },
                { id: 'test-id-2', name: 'Book 2' }
            ])
        })

        test('should call toObject on each row', async (): Promise<void> => {
            await rawRowsToRows(mockWorksheet as GoogleSpreadsheetWorksheet)

            expect(mockRows[0].toObject).toHaveBeenCalled()
            expect(mockRows[1].toObject).toHaveBeenCalled()
        })

        test('should call getRows on worksheet', async (): Promise<void> => {
            await rawRowsToRows(mockWorksheet as GoogleSpreadsheetWorksheet)

            expect(mockGetRows).toHaveBeenCalledTimes(1)
        })

        test('should return empty array when no rows exist', async (): Promise<void> => {
            mockGetRows.mockResolvedValueOnce([])

            const result = await rawRowsToRows(mockWorksheet as GoogleSpreadsheetWorksheet)

            expect(result).toEqual([])
        })
    })

    describe('fetchGoogleSheets', (): void => {
        test('should return spreadsheet response with all sheets', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const mockDoc = {
                sheetsByTitle: {
                    [Sheet.books]: { getRows: jest.fn().mockResolvedValue(mockRows) },
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                mockDoc as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            expect(result).toBeDefined()
            expect(result.get).toBeDefined()
            expect(result.get.books).toHaveLength(2)
            expect(result.get.users).toHaveLength(1)
            expect(result.get.lends).toHaveLength(1)
            expect(result.get.auth).toEqual({ username: 'admin', password: 'secret' })
        })

        test('should resolve getRowById handlers correctly', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const mockDoc = {
                sheetsByTitle: {
                    [Sheet.books]: { getRows: jest.fn().mockResolvedValue(mockRows) },
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                mockDoc as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            await expect(result.getRowById.books('test-id-1')).resolves.toEqual({ id: 'test-id-1', name: 'Book 1' })
            await expect(result.getRowById.books('unknown-id')).resolves.toEqual({})
            await expect(result.getRowById.users('test-id-1')).resolves.toEqual({ id: 'test-id-1', name: 'Book 1' })
            await expect(result.getRowById.lends('test-id-2')).resolves.toEqual({ id: 'test-id-2', name: 'Book 2' })
        })

        test('should have getRowById methods for all sheets', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const mockDoc = {
                sheetsByTitle: {
                    [Sheet.books]: { getRows: jest.fn().mockResolvedValue(mockRows) },
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                mockDoc as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            expect(result.getRowById).toBeDefined()
            expect(result.getRowById.books).toBeDefined()
            expect(result.getRowById.users).toBeDefined()
            expect(result.getRowById.lends).toBeDefined()
        })

        test('should have add methods for all sheets', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const mockDoc = {
                sheetsByTitle: {
                    [Sheet.books]: { getRows: jest.fn().mockResolvedValue(mockRows), addRow: jest.fn() },
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]), addRow: jest.fn() },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]), addRow: jest.fn() },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                mockDoc as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            expect(result.add).toBeDefined()
            expect(result.add.books).toBeDefined()
            expect(result.add.users).toBeDefined()
            expect(result.add.lends).toBeDefined()
        })

        test('should add rows with insertion options', async (): Promise<void> => {
            const addRowBooks = jest.fn().mockResolvedValue(undefined)
            const addRowUsers = jest.fn().mockResolvedValue(undefined)
            const addRowLends = jest.fn().mockResolvedValue(undefined)
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const mockDoc = {
                sheetsByTitle: {
                    [Sheet.books]: { getRows: jest.fn().mockResolvedValue(mockRows), addRow: addRowBooks },
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]), addRow: addRowUsers },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]), addRow: addRowLends },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                mockDoc as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            const newBook: Row = { id: 'test-id-3', name: 'Book 3' }
            const newUser: Row = { id: 'test-user-id', name: 'User 1' }
            const newLend: Row = { id: 'test-lend-id', name: 'Lend 1' }

            await result.add.books(newBook)
            await result.add.users(newUser)
            await result.add.lends(newLend)

            expect(addRowBooks).toHaveBeenCalledWith(newBook, { insert: true, raw: true })
            expect(addRowUsers).toHaveBeenCalledWith(newUser, { insert: true, raw: true })
            expect(addRowLends).toHaveBeenCalledWith(newLend, { insert: true, raw: true })
        })

        test('should have delete methods for all sheets', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const mockDoc = {
                sheetsByTitle: {
                    [Sheet.books]: { getRows: jest.fn().mockResolvedValue(mockRows) },
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                mockDoc as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            expect(result.delete).toBeDefined()
            expect(result.delete.books).toBeDefined()
            expect(result.delete.users).toBeDefined()
            expect(result.delete.lends).toBeDefined()
        })

        test('should delete rows when id exists', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const bookRow: MockRow = {
                rowNumber: 4,
                get: jest.fn((key: string) => (key === 'id' ? 'book-id-1' : undefined)),
                toObject: jest.fn(() => ({ id: 'book-id-1', name: 'Book Entry' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            } as MockRow

            const userRow: MockRow = {
                rowNumber: 7,
                get: jest.fn((key: string) => (key === 'id' ? 'user-id-1' : undefined)),
                toObject: jest.fn(() => ({ id: 'user-id-1', name: 'User Entry' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            } as MockRow

            const lendRow: MockRow = {
                rowNumber: 9,
                get: jest.fn((key: string) => (key === 'id' ? 'lend-id-1' : undefined)),
                toObject: jest.fn(() => ({ id: 'lend-id-1', name: 'Lend Entry' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            } as MockRow

            const booksSheet = { getRows: jest.fn().mockResolvedValue([bookRow]) }
            const usersSheet = { getRows: jest.fn().mockResolvedValue([userRow]) }
            const lendsSheet = { getRows: jest.fn().mockResolvedValue([lendRow]) }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce({
                sheetsByTitle: {
                    [Sheet.books]: booksSheet,
                    [Sheet.users]: usersSheet,
                    [Sheet.lends]: lendsSheet,
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>)

            const result = await fetchGoogleSheets()

            await result.delete.books('book-id-1')
            await result.delete.users('user-id-1')
            await result.delete.lends('lend-id-1')

            expect(bookRow.delete).toHaveBeenCalledTimes(1)
            expect(userRow.delete).toHaveBeenCalledTimes(1)
            expect(lendRow.delete).toHaveBeenCalledTimes(1)
        })

        test('should skip deletion when row is missing after index lookup', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const transientRow: MockRow = {
                rowNumber: 5,
                get: jest.fn((key: string) => (key === 'id' ? 'transient-id' : undefined)),
                toObject: jest.fn(() => ({ id: 'transient-id', name: 'Transient Book' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            } as MockRow

            const booksSheet = { getRows: jest.fn() }
            ;(booksSheet.getRows as jest.Mock)
                .mockResolvedValueOnce([transientRow])
                .mockResolvedValueOnce([transientRow])
                .mockResolvedValueOnce([])

            mockGetGoogleSpreadsheet.mockResolvedValueOnce({
                sheetsByTitle: {
                    [Sheet.books]: booksSheet,
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([]) },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([]) },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>)

            const result = await fetchGoogleSheets()

            await result.delete.books('transient-id')

            expect(booksSheet.getRows as jest.Mock).toHaveBeenCalledTimes(3)
            expect(transientRow.delete).not.toHaveBeenCalled()
        })

        test('should not delete rows when id is missing', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const booksSheet = { getRows: jest.fn().mockResolvedValue(mockRows) }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce({
                sheetsByTitle: {
                    [Sheet.books]: booksSheet,
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>)

            const result = await fetchGoogleSheets()

            const initialCallCount = (booksSheet.getRows as jest.Mock).mock.calls.length
            await result.delete.books('unknown-id')

            expect(booksSheet.getRows as jest.Mock).toHaveBeenCalledTimes(initialCallCount + 1)
            expect(mockRows[0].delete).not.toHaveBeenCalled()
            expect(mockRows[1].delete).not.toHaveBeenCalled()
        })

        test('should have update methods for all sheets', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const mockDoc = {
                sheetsByTitle: {
                    [Sheet.books]: { getRows: jest.fn().mockResolvedValue(mockRows) },
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                mockDoc as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            expect(result.update).toBeDefined()
            expect(result.update.books).toBeDefined()
            expect(result.update.users).toBeDefined()
            expect(result.update.lends).toBeDefined()
        })

        test('should update rows when id exists', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const bookRow: MockRow = {
                rowNumber: 4,
                get: jest.fn((key: string) => (key === 'id' ? 'book-id-1' : undefined)),
                toObject: jest.fn(() => ({ id: 'book-id-1', name: 'Book Entry' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            } as MockRow

            const userRow: MockRow = {
                rowNumber: 5,
                get: jest.fn((key: string) => (key === 'id' ? 'user-id-1' : undefined)),
                toObject: jest.fn(() => ({ id: 'user-id-1', name: 'User Entry' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            } as MockRow

            const lendRow: MockRow = {
                rowNumber: 6,
                get: jest.fn((key: string) => (key === 'id' ? 'lend-id-1' : undefined)),
                toObject: jest.fn(() => ({ id: 'lend-id-1', name: 'Lend Entry' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            } as MockRow

            const booksSheet = { getRows: jest.fn().mockResolvedValue([bookRow]) }
            const usersSheet = { getRows: jest.fn().mockResolvedValue([userRow]) }
            const lendsSheet = { getRows: jest.fn().mockResolvedValue([lendRow]) }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce({
                sheetsByTitle: {
                    [Sheet.books]: booksSheet,
                    [Sheet.users]: usersSheet,
                    [Sheet.lends]: lendsSheet,
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>)

            const result = await fetchGoogleSheets()

            const updatedBook: Row = { id: 'book-id-1', name: 'Updated Book' }
            const updatedUser: Row = { id: 'user-id-1', name: 'Updated User' }
            const updatedLend: Row = { id: 'lend-id-1', name: 'Updated Lend' }

            await result.update.books('book-id-1', updatedBook)
            await result.update.users('user-id-1', updatedUser)
            await result.update.lends('lend-id-1', updatedLend)

            expect(bookRow.assign).toHaveBeenCalledWith(updatedBook)
            expect(bookRow.save).toHaveBeenCalledTimes(1)
            expect(userRow.assign).toHaveBeenCalledWith(updatedUser)
            expect(userRow.save).toHaveBeenCalledTimes(1)
            expect(lendRow.assign).toHaveBeenCalledWith(updatedLend)
            expect(lendRow.save).toHaveBeenCalledTimes(1)
        })

        test('should skip update when row is missing after index lookup', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const staleRow: MockRow = {
                rowNumber: 3,
                get: jest.fn((key: string) => (key === 'id' ? 'stale-id' : undefined)),
                toObject: jest.fn(() => ({ id: 'stale-id', name: 'Stale Book' })),
                assign: jest.fn(),
                save: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined)
            } as MockRow

            const booksSheet = { getRows: jest.fn() }
            ;(booksSheet.getRows as jest.Mock)
                .mockResolvedValueOnce([staleRow])
                .mockResolvedValueOnce([staleRow])
                .mockResolvedValueOnce([])

            mockGetGoogleSpreadsheet.mockResolvedValueOnce({
                sheetsByTitle: {
                    [Sheet.books]: booksSheet,
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([]) },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([]) },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>)

            const result = await fetchGoogleSheets()

            await result.update.books('stale-id', { id: 'stale-id', name: 'Any' })

            expect(booksSheet.getRows as jest.Mock).toHaveBeenCalledTimes(3)
            expect(staleRow.assign).not.toHaveBeenCalled()
            expect(staleRow.save).not.toHaveBeenCalled()
        })

        test('should not update rows when id is missing', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const booksSheet = { getRows: jest.fn().mockResolvedValue(mockRows) }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce({
                sheetsByTitle: {
                    [Sheet.books]: booksSheet,
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>)

            const result = await fetchGoogleSheets()

            const initialCallCount = (booksSheet.getRows as jest.Mock).mock.calls.length
            const missingRow: Row = { id: 'unknown-id', name: 'Missing Book' }
            await result.update.books('unknown-id', missingRow)

            expect(booksSheet.getRows as jest.Mock).toHaveBeenCalledTimes(initialCallCount + 1)
            expect(mockRows[0].assign).not.toHaveBeenCalled()
            expect(mockRows[0].save).not.toHaveBeenCalled()
        })

        test('should return default empty response on error', async (): Promise<void> => {
            mockGetGoogleSpreadsheet.mockRejectedValueOnce(new Error('Connection failed'))

            const result = await fetchGoogleSheets()

            expect(result.get.books).toEqual([])
            expect(result.get.users).toEqual([])
            expect(result.get.lends).toEqual([])
            expect(result.get.auth).toEqual({ username: '', password: '' })
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching Google Sheets data:', expect.any(Error))
            await expect(result.getRowById.books('any')).resolves.toEqual({})
            await expect(result.getRowById.users('any')).resolves.toEqual({})
            await expect(result.getRowById.lends('any')).resolves.toEqual({})
            const fallbackRow: Row = { id: 'fallback-id' }
            await expect(result.add.books(fallbackRow)).resolves.toBeUndefined()
            await expect(result.add.users(fallbackRow)).resolves.toBeUndefined()
            await expect(result.add.lends(fallbackRow)).resolves.toBeUndefined()
            await expect(result.delete.books('any')).resolves.toBeUndefined()
            await expect(result.delete.users('any')).resolves.toBeUndefined()
            await expect(result.delete.lends('any')).resolves.toBeUndefined()
            await expect(result.update.books('any', fallbackRow)).resolves.toBeUndefined()
            await expect(result.update.users('any', fallbackRow)).resolves.toBeUndefined()
            await expect(result.update.lends('any', fallbackRow)).resolves.toBeUndefined()
        })

        test('should log error when getGoogleSpreadsheet fails', async (): Promise<void> => {
            const error = new Error('API error')
            mockGetGoogleSpreadsheet.mockRejectedValueOnce(error)

            await fetchGoogleSheets()

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching Google Sheets data:', error)
        })
    })
})
