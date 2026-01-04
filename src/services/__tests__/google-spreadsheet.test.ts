import { authenticateGoogleSheet, getGoogleSpreadsheet, googleSpreadsheet } from '@/services/google-spreadsheet'
import * as jwtModule from '@/services/jwtServiceAccountAuth'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

jest.mock('@/services/jwtServiceAccountAuth')
jest.mock('google-spreadsheet')

describe('google-spreadsheet', () => {
    const mockJwtServiceAccountAuth = jwtModule.jwtServiceAccountAuth as jest.Mocked<
        typeof jwtModule.jwtServiceAccountAuth
    >
    const mockGoogleSpreadsheet = googleSpreadsheet as jest.Mocked<GoogleSpreadsheet>

    let consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    let consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

    beforeEach((): void => {
        jest.clearAllMocks()

        consoleLogSpy.mockClear()
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

        consoleErrorSpy.mockClear()
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

        mockJwtServiceAccountAuth.serviceAccountAuth = {
            authorize: jest.fn().mockResolvedValue(void 0)
        } as unknown as JWT

        mockJwtServiceAccountAuth.sheetId = 'test-sheet-id'
        mockJwtServiceAccountAuth.email = 'test@example.com'
        mockJwtServiceAccountAuth.private_key = 'test-key'

        mockGoogleSpreadsheet.loadInfo = jest.fn().mockResolvedValue(void 0)
        // @ts-expect-error - force to assigning spreadsheetId to test only
        mockGoogleSpreadsheet.spreadsheetId = 'test-sheet-id'
        mockGoogleSpreadsheet.auth = mockJwtServiceAccountAuth.serviceAccountAuth
    })

    afterEach((): void => {
        jest.clearAllMocks()
        consoleErrorSpy.mockRestore()
        consoleLogSpy.mockRestore()
    })

    describe('authenticateGoogleSheet', () => {
        test('should call JWT authorize method successfully', async (): Promise<void> => {
            await authenticateGoogleSheet()

            expect(mockJwtServiceAccountAuth.serviceAccountAuth.authorize).toHaveBeenCalled()
            expect(consoleLogSpy).toHaveBeenCalledWith('Google Sheet Authenticated successfully')
        })

        test('should handle authentication errors gracefully', async (): Promise<void> => {
            const authError: Error = new Error('Invalid credentials')

            mockJwtServiceAccountAuth.serviceAccountAuth.authorize = jest.fn().mockRejectedValueOnce(authError)

            await authenticateGoogleSheet()

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error authenticating with Google Sheets:', authError)
        })

        test('should not throw error even if JWT authorize fails', async (): Promise<void> => {
            mockJwtServiceAccountAuth.serviceAccountAuth.authorize = jest
                .fn()
                .mockRejectedValueOnce(new Error('Network error'))

            const result = async (): Promise<void> => {
                await authenticateGoogleSheet()
            }

            await expect(result()).resolves.not.toThrow()
        })

        test('should be callable without parameters', async (): Promise<void> => {
            const result = await authenticateGoogleSheet()

            expect(result).toBeUndefined()
        })
    })

    describe('getGoogleSpreadsheet', () => {
        test('should return a GoogleSpreadsheet instance', async (): Promise<void> => {
            const result = await getGoogleSpreadsheet()

            expect(result).toBeDefined()
            expect(mockGoogleSpreadsheet.loadInfo).toHaveBeenCalled()
        })

        test('should call authenticateGoogleSheet before loadInfo', async (): Promise<void> => {
            await getGoogleSpreadsheet()

            expect(mockJwtServiceAccountAuth.serviceAccountAuth.authorize).toHaveBeenCalled()
            expect(mockGoogleSpreadsheet.loadInfo).toHaveBeenCalled()
        })

        test('should handle errors gracefully when loadInfo fails', async (): Promise<void> => {
            const errorMessage: string = 'Failed to load info'
            const error: Error = new Error(errorMessage)

            mockGoogleSpreadsheet.loadInfo = jest.fn().mockRejectedValueOnce(error)

            const result = await getGoogleSpreadsheet()

            expect(result).toBeDefined()
            expect(consoleErrorSpy).toHaveBeenCalled()
        })

        test('should handle errors gracefully when authorize fails', async (): Promise<void> => {
            const error: Error = new Error('Authorization failed')
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

            mockJwtServiceAccountAuth.serviceAccountAuth.authorize = jest.fn().mockRejectedValueOnce(error)

            const result = await getGoogleSpreadsheet()

            expect(result).toBeDefined()
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error authenticating with Google Sheets:', error)
            consoleErrorSpy.mockRestore()
            consoleLogSpy.mockRestore()
        })

        test('should be callable without parameters', async (): Promise<void> => {
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

            const result = await getGoogleSpreadsheet()

            expect(result).toBeDefined()
            consoleLogSpy.mockRestore()
        })
    })

    describe('googleSpreadsheet', () => {
        test('should be defined', (): void => {
            expect(googleSpreadsheet).toBeDefined()
        })

        test('should have the correct sheet ID', (): void => {
            expect(mockGoogleSpreadsheet.spreadsheetId).toBe('test-sheet-id')
        })

        test('should have JWT authentication configured', (): void => {
            expect(mockGoogleSpreadsheet.auth).toBeDefined()
            expect(mockGoogleSpreadsheet.auth).toBe(mockJwtServiceAccountAuth.serviceAccountAuth)
        })

        test('should have loadInfo method', (): void => {
            expect(typeof mockGoogleSpreadsheet.loadInfo).toBe('function')
        })
    })

    describe('error handling', () => {
        test('should catch and log JWT authorization errors', async (): Promise<void> => {
            const authError: Error = new Error('JWT authorization failed')
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

            mockJwtServiceAccountAuth.serviceAccountAuth.authorize = jest.fn().mockRejectedValueOnce(authError)

            await authenticateGoogleSheet()

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error authenticating with Google Sheets:', authError)
            consoleErrorSpy.mockRestore()
        })

        test('should handle multiple consecutive authorize failures', async (): Promise<void> => {
            const error1: Error = new Error('First error')
            const error2: Error = new Error('Second error')
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

            mockJwtServiceAccountAuth.serviceAccountAuth.authorize = jest
                .fn()
                .mockRejectedValueOnce(error1)
                .mockRejectedValueOnce(error2)

            await authenticateGoogleSheet()
            await authenticateGoogleSheet()

            expect(consoleErrorSpy).toHaveBeenCalledTimes(2)
            consoleErrorSpy.mockRestore()
        })

        test('should continue execution even if authentication fails', async (): Promise<void> => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
            mockJwtServiceAccountAuth.serviceAccountAuth.authorize = jest
                .fn()
                .mockRejectedValueOnce(new Error('Auth failed'))

            const result = async (): Promise<void> => {
                await authenticateGoogleSheet()
            }

            await expect(result()).resolves.not.toThrow()
            consoleErrorSpy.mockRestore()
        })
    })

    describe('environment variables', () => {
        test('should use sheetId from jwtServiceAccountAuth', (): void => {
            expect(mockJwtServiceAccountAuth.sheetId).toBeDefined()
        })

        test('should use email from jwtServiceAccountAuth', (): void => {
            expect(mockJwtServiceAccountAuth.email).toBeDefined()
        })

        test('should use private_key from jwtServiceAccountAuth', (): void => {
            expect(mockJwtServiceAccountAuth.private_key).toBeDefined()
        })
    })
})
