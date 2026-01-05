jest.mock('clsx', () => {
    const fn = jest.fn<string, [unknown[]]>()

    return {
        __esModule: true,
        clsx: fn,
        __mock: { fn }
    }
})

jest.mock('tailwind-merge', () => {
    const fn = jest.fn<string, [string]>()

    return {
        __esModule: true,
        twMerge: fn,
        __mock: { fn }
    }
})

import { cn } from '../tailwindMerge'

type ClsxMockModule = {
    __mock: {
        fn: jest.Mock<string, [unknown[]]>
    }
}

type TailwindMergeMockModule = {
    __mock: {
        fn: jest.Mock<string, [string]>
    }
}

const clsxModuleMock = jest.requireMock('clsx') as ClsxMockModule
const twMergeModuleMock = jest.requireMock('tailwind-merge') as TailwindMergeMockModule

const clsxMock = clsxModuleMock.__mock.fn
const twMergeMock = twMergeModuleMock.__mock.fn

describe('cn', () => {
    let consoleErrorSpy: jest.SpyInstance<void, Parameters<typeof console.error>>

    beforeEach(() => {
        clsxMock.mockReset()
        twMergeMock.mockReset()
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    })

    afterEach(() => {
        consoleErrorSpy.mockRestore()
    })

    test('combines class values and merges tailwind conflicts', () => {
        clsxMock.mockReturnValueOnce('bg-red-500 text-white text-red-500 custom')
        twMergeMock.mockReturnValueOnce('bg-red-500 text-white custom')

        const result = cn('bg-red-500', ['text-white'], { 'text-red-500': true }, 'custom')

        expect(clsxMock).toHaveBeenCalledTimes(1)
        expect(clsxMock).toHaveBeenCalledWith(['bg-red-500', ['text-white'], { 'text-red-500': true }, 'custom'])
        expect(twMergeMock).toHaveBeenCalledWith('bg-red-500 text-white text-red-500 custom')
        expect(result).toBe('bg-red-500 text-white custom')
        expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('returns empty string when no class values provided', () => {
        clsxMock.mockReturnValueOnce('')
        twMergeMock.mockReturnValueOnce('')

        const result = cn()

        expect(clsxMock).toHaveBeenCalledTimes(1)
        expect(clsxMock).toHaveBeenCalledWith([])
        expect(twMergeMock).toHaveBeenCalledWith('')
        expect(result).toBe('')
        expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
})
