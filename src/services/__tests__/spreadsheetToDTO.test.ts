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
            const addRowSpy = jest.fn().mockResolvedValue(undefined)
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const mockDoc = {
                sheetsByTitle: {
                    [Sheet.books]: { getRows: jest.fn().mockResolvedValue(mockRows), addRow: addRowSpy },
                    [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]), addRow: jest.fn() },
                    [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]), addRow: jest.fn() },
                    auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                }
            }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                mockDoc as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            const newRow: Row = { id: 'test-id-3', name: 'Book 3' }
            await result.add.books(newRow)

            expect(addRowSpy).toHaveBeenCalledWith(newRow, { insert: true, raw: true })
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

            const booksSheet = { getRows: jest.fn().mockResolvedValue(mockRows) }
            const usersSheet = { getRows: jest.fn().mockResolvedValue([mockRows[0]]) }
            const lendsSheet = { getRows: jest.fn().mockResolvedValue([mockRows[1]]) }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                {
                    sheetsByTitle: {
                        [Sheet.books]: booksSheet,
                        [Sheet.users]: usersSheet,
                        [Sheet.lends]: lendsSheet,
                        auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                    }
                } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            const initialCallCount = (booksSheet.getRows as jest.Mock).mock.calls.length
            await result.delete.books('test-id-1')

            expect((booksSheet.getRows as jest.Mock)).toHaveBeenCalledTimes(initialCallCount + 2)
            expect(mockRows[0].delete).toHaveBeenCalledTimes(1)
        })

        test('should not delete rows when id is missing', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const booksSheet = { getRows: jest.fn().mockResolvedValue(mockRows) }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                {
                    sheetsByTitle: {
                        [Sheet.books]: booksSheet,
                        [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                        [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                        auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                    }
                } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            const initialCallCount = (booksSheet.getRows as jest.Mock).mock.calls.length
            await result.delete.books('unknown-id')

            expect((booksSheet.getRows as jest.Mock)).toHaveBeenCalledTimes(initialCallCount + 1)
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

            const booksSheet = { getRows: jest.fn().mockResolvedValue(mockRows) }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                {
                    sheetsByTitle: {
                        [Sheet.books]: booksSheet,
                        [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                        [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                        auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                    }
                } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            const updatedRow: Row = { id: 'test-id-1', name: 'Updated Book' }
            const initialCallCount = (booksSheet.getRows as jest.Mock).mock.calls.length
            await result.update.books('test-id-1', updatedRow)

            expect((booksSheet.getRows as jest.Mock)).toHaveBeenCalledTimes(initialCallCount + 2)
            expect(mockRows[0].assign).toHaveBeenCalledWith(updatedRow)
            expect(mockRows[0].save).toHaveBeenCalledTimes(1)
        })

        test('should not update rows when id is missing', async (): Promise<void> => {
            const mockAuthRow = {
                toObject: jest.fn(() => ({ username: 'admin', password: 'secret' }))
            }

            const booksSheet = { getRows: jest.fn().mockResolvedValue(mockRows) }

            mockGetGoogleSpreadsheet.mockResolvedValueOnce(
                {
                    sheetsByTitle: {
                        [Sheet.books]: booksSheet,
                        [Sheet.users]: { getRows: jest.fn().mockResolvedValue([mockRows[0]]) },
                        [Sheet.lends]: { getRows: jest.fn().mockResolvedValue([mockRows[1]]) },
                        auth: { getRows: jest.fn().mockResolvedValue([mockAuthRow]) }
                    }
                } as unknown as ReturnType<typeof googleSpreadsheetModule.getGoogleSpreadsheet>
            )

            const result = await fetchGoogleSheets()

            const initialCallCount = (booksSheet.getRows as jest.Mock).mock.calls.length
            const missingRow: Row = { id: 'unknown-id', name: 'Missing Book' }
            await result.update.books('unknown-id', missingRow)

            expect((booksSheet.getRows as jest.Mock)).toHaveBeenCalledTimes(initialCallCount + 1)
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
            const fallbackRow: Row = { id: 'fallback-id' }
            await expect(result.add.books(fallbackRow)).resolves.toBeUndefined()
            await expect(result.delete.books('any')).resolves.toBeUndefined()
            await expect(result.update.books('any', fallbackRow)).resolves.toBeUndefined()
        })

        test('should log error when getGoogleSpreadsheet fails', async (): Promise<void> => {
            const error = new Error('API error')
            mockGetGoogleSpreadsheet.mockRejectedValueOnce(error)

            await fetchGoogleSheets()

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching Google Sheets data:', error)
        })
    })
})
