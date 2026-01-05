import { calcImageSize } from '../calcImageSize'

const customRound = (value: number): number => (value >= 0 ? Math.floor(value + 0.5) : Math.ceil(value - 0.5))

describe('calcImageSize', (): void => {
    let base64WithoutPadding: string
    let base64WithPadding: string
    let largeBase64: string
    let mathRoundSpy: jest.SpyInstance<number, [number]>

    beforeEach((): void => {
        base64WithoutPadding = 'A'.repeat(16)
        base64WithPadding = `${'B'.repeat(24)}==`
        largeBase64 = 'C'.repeat(2048)
        mathRoundSpy = jest.spyOn(Math, 'round')
    })

    afterEach((): void => {
        jest.clearAllMocks()
        mathRoundSpy.mockRestore()
    })

    test('should calculate size for base64 without padding', (): void => {
        const result = calcImageSize(base64WithoutPadding)

        const rawSize = (base64WithoutPadding.length * 0.75 - 1) / 1024
        const expected = customRound(rawSize)

        expect(result).toBe(expected)
        expect(mathRoundSpy).toHaveBeenCalledTimes(1)
        expect(mathRoundSpy).toHaveBeenCalledWith(rawSize)
    })

    test('should account for double equals padding reduction', (): void => {
        const result = calcImageSize(base64WithPadding)

        const rawSize = (base64WithPadding.length * 0.75 - 2) / 1024
        const expected = customRound(rawSize)

        expect(result).toBe(expected)
        expect(mathRoundSpy).toHaveBeenCalledTimes(1)
        expect(mathRoundSpy).toHaveBeenCalledWith(rawSize)
    })

    test('should round large payload size to nearest kilobyte', (): void => {
        const result = calcImageSize(largeBase64)

        const rawSize = (largeBase64.length * 0.75 - 1) / 1024
        const expected = customRound(rawSize)

        expect(result).toBe(expected)
        expect(mathRoundSpy).toHaveBeenCalledTimes(1)
        expect(mathRoundSpy).toHaveBeenCalledWith(rawSize)
    })
})
