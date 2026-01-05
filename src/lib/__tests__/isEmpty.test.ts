import { isEmpty } from '../isEmpty'

describe('isEmpty', (): void => {
    let emptyArray: unknown[]
    let filledArray: unknown[]
    let emptyRecord: Record<string, never>
    let filledRecord: Record<string, never>

    beforeEach((): void => {
        emptyArray = []
        filledArray = ['item']
        emptyRecord = {} as Record<string, never>
        filledRecord = { entry: 'value' } as unknown as Record<string, never>
    })

    afterEach((): void => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('when value is an array', (): void => {
        test('should return true for an empty array', (): void => {
            const result = isEmpty(emptyArray)

            expect(result).toBe(true)
        })

        test('should return false for an array with items', (): void => {
            const result = isEmpty(filledArray)

            expect(result).toBe(false)
        })
    })

    describe('when value is an object', (): void => {
        test('should return true for an empty object', (): void => {
            const result = isEmpty(emptyRecord)

            expect(result).toBe(true)
        })

        test('should return false for an object with keys', (): void => {
            const result = isEmpty(filledRecord)

            expect(result).toBe(false)
        })
    })
})
