import { toBase64 } from '../toBase64'

describe('toBase64', () => {
    let mockFileReader: Partial<FileReader>
    let fileReaderConstructorSpy: jest.SpyInstance<FileReader>
    let consoleErrorSpy: jest.SpyInstance<void, Parameters<typeof console.error>>
    const mockBase64String = 'data:application/octet-stream;base64,SGVsbG8gV29ybGQ='
    const mockBlob = new Blob(['Hello World'], { type: 'application/octet-stream' })

    beforeEach(() => {
        mockFileReader = {
            readAsDataURL: jest.fn(),
            onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null,
            onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null,
            result: null as string | ArrayBuffer | null,
            error: null as DOMException | null
        }

        fileReaderConstructorSpy = jest
            .spyOn(global, 'FileReader')
            .mockImplementation(() => mockFileReader as FileReader)

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test('reads file as data URL and resolves with base64 string on success', async () => {
        const promise = toBase64(mockBlob)

        expect(fileReaderConstructorSpy).toHaveBeenCalledTimes(1)
        expect(mockFileReader.readAsDataURL).toHaveBeenCalledTimes(1)
        expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockBlob)

        // @ts-expect-error -- ignore ---
        mockFileReader.result = mockBase64String
        const onloadHandler = mockFileReader.onload
        onloadHandler?.call(mockFileReader as FileReader, new ProgressEvent('load') as ProgressEvent<FileReader>)

        const result = await promise

        expect(result).toBe(mockBase64String)
        expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('rejects promise when FileReader encounters an error', async () => {
        const mockError = new Error('FileReader read failed')
        const promise = toBase64(mockBlob)

        expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockBlob)

        // @ts-expect-error -- ignore ---
        mockFileReader.error = mockError

        const onerrorHandler = mockFileReader.onerror
        onerrorHandler?.call(
            mockFileReader as FileReader,
            new ProgressEvent('FileReader read failed') as ProgressEvent<FileReader>
        )

        await expect(promise).rejects.toEqual(mockError)
        expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('handles multiple blob conversions independently', async () => {
        const blob1 = new Blob(['File 1'], { type: 'text/plain' })
        const blob2 = new Blob(['File 2'], { type: 'text/plain' })
        const base64String1 = 'data:text/plain;base64,RmlsZSAx'
        const base64String2 = 'data:text/plain;base64,RmlsZSAy'

        const promise1 = toBase64(blob1)
        expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(blob1)
        expect(fileReaderConstructorSpy).toHaveBeenCalledTimes(1)

        // @ts-expect-error -- ignore ---
        mockFileReader.result = base64String1
        mockFileReader.onload?.call(
            mockFileReader as FileReader,
            new ProgressEvent('load') as ProgressEvent<FileReader>
        )

        const result1 = await promise1
        expect(result1).toBe(base64String1)

        fileReaderConstructorSpy.mockClear()
        mockFileReader.readAsDataURL = jest.fn()
        mockFileReader.onload = null as ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null

        const promise2 = toBase64(blob2)
        expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(blob2)

        // @ts-expect-error -- ignore ---
        mockFileReader.result = base64String2
        mockFileReader.onload?.call(
            mockFileReader as FileReader,
            new ProgressEvent('load') as ProgressEvent<FileReader>
        )

        const result2 = await promise2
        expect(result2).toBe(base64String2)

        expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
})
