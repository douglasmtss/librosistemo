import { reduceImageFileSize } from '../reduceImageFileSize'

describe('reduceImageFileSize', () => {
    const originalImage = globalThis.Image
    const originalFileReader = globalThis.FileReader
    let createElementSpy: jest.SpyInstance
    let drawImageMock: jest.Mock
    let getContextMock: jest.Mock
    let toBlobMock: jest.Mock
    let createdImages: MockImage[]
    let fileReaderInstances: FileReaderStub[]
    let fileReaderResult: string
    let canvases: Array<
        HTMLCanvasElement & {
            width: number
            height: number
        }
    >

    class MockImage {
        public onload: (() => void) | null = null
        public width = 0
        public height = 0
        private _src = ''

        public constructor() {
            createdImages.push(this)
        }

        public set src(value: string) {
            this._src = value
        }

        public get src(): string {
            return this._src
        }

        public triggerLoad(): void {
            this.onload?.()
        }
    }

    class FileReaderStub {
        public result: string | ArrayBuffer | null = null
        private readonly listeners: Record<string, Array<() => void>> = {
            load: []
        }

        public readAsDataURL = jest.fn(() => {
            this.result = fileReaderResult
            setTimeout(() => {
                this.listeners.load.forEach(listener => listener())
            }, 0)
        })

        public addEventListener = jest.fn((event: string, listener: () => void) => {
            if (!this.listeners[event]) {
                this.listeners[event] = []
            }
            this.listeners[event].push(listener)
        })
    }

    beforeEach(() => {
        createdImages = []
        fileReaderInstances = []
        fileReaderResult = 'data:image/webp;base64,default'
        canvases = []
        drawImageMock = jest.fn()
        getContextMock = jest.fn(() => ({ drawImage: drawImageMock }))
        toBlobMock = jest.fn((callback: (blob: Blob | null) => void, type?: string) => {
            callback(new Blob(['mock'], { type }))
        })

        globalThis.Image = MockImage as unknown as typeof Image

        const fileReaderFactory = jest.fn(() => {
            const instance = new FileReaderStub()
            fileReaderInstances.push(instance)

            return instance as unknown as FileReader
        })
        Object.defineProperty(globalThis, 'FileReader', {
            configurable: true,
            writable: true,
            value: fileReaderFactory
        })

        const originalCreateElement = document.createElement.bind(document)
        createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(tagName => {
            if (tagName === 'canvas') {
                const canvas = {
                    width: 0,
                    height: 0,
                    getContext: getContextMock,
                    toBlob: toBlobMock
                } as unknown as HTMLCanvasElement & {
                    width: number
                    height: number
                }
                canvases.push(canvas)

                return canvas
            }

            return originalCreateElement(tagName)
        })
    })

    afterEach(() => {
        createElementSpy.mockRestore()
        globalThis.Image = originalImage
        Object.defineProperty(globalThis, 'FileReader', {
            configurable: true,
            writable: true,
            value: originalFileReader
        })
        jest.restoreAllMocks()
    })

    test('scales image by width when landscape frame exceeds maximum width', async () => {
        fileReaderResult = 'data:image/webp;base64:landscape'
        const promise = reduceImageFileSize('data:image/png;base64,test', 300, 600)

        const mockImage = createdImages[0]
        mockImage.width = 900
        mockImage.height = 300
        mockImage.triggerLoad()

        const result = await promise
        const canvas = canvases[0]
        const fileReader = fileReaderInstances[0]

        expect(result).toBe('data:image/webp;base64:landscape')
        expect(canvas.width).toBe(300)
        expect(canvas.height).toBe(100)
        expect(drawImageMock).toHaveBeenCalledWith(mockImage, 0, 0, 300, 100)
        expect(toBlobMock).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.5)
        expect(fileReader.readAsDataURL).toHaveBeenCalledWith(expect.any(Blob))
        expect(mockImage.src).toBe('data:image/png;base64,test')
    })

    test('keeps landscape dimensions when within maximum width', async () => {
        fileReaderResult = 'data:image/webp;base64:landscape:unchanged'
        const promise = reduceImageFileSize('data:image/jpeg;base64,abc', 800, 800)

        const mockImage = createdImages[0]
        mockImage.width = 600
        mockImage.height = 200
        mockImage.triggerLoad()

        const result = await promise
        const canvas = canvases[0]

        expect(result).toBe('data:image/webp;base64:landscape:unchanged')
        expect(canvas.width).toBe(600)
        expect(canvas.height).toBe(200)
        expect(drawImageMock).toHaveBeenCalledWith(mockImage, 0, 0, 600, 200)
    })

    test('scales image by height when portrait frame exceeds maximum height', async () => {
        fileReaderResult = 'data:image/webp;base64:portrait'
        const promise = reduceImageFileSize('data:image/png;base64,portrait')

        const mockImage = createdImages[0]
        mockImage.width = 200
        mockImage.height = 900
        mockImage.triggerLoad()

        const result = await promise
        const canvas = canvases[0]

        expect(result).toBe('data:image/webp;base64:portrait')
        expect(canvas.width).toBeCloseTo(100)
        expect(canvas.height).toBe(450)
        expect(drawImageMock).toHaveBeenCalledWith(mockImage, 0, 0, canvas.width, 450)
    })

    test('keeps portrait dimensions when within maximum height', async () => {
        fileReaderResult = 'data:image/webp;base64:portrait:unchanged'
        const promise = reduceImageFileSize('data:image/png;base64,portrait-small')

        const mockImage = createdImages[0]
        mockImage.width = 200
        mockImage.height = 300
        mockImage.triggerLoad()

        const result = await promise
        const canvas = canvases[0]

        expect(result).toBe('data:image/webp;base64:portrait:unchanged')
        expect(canvas.width).toBe(200)
        expect(canvas.height).toBe(300)
        expect(drawImageMock).toHaveBeenCalledWith(mockImage, 0, 0, 200, 300)
    })
})
