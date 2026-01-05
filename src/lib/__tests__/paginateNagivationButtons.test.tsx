import type { JSX } from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

jest.mock('react-icons/fa', () => ({
    FaArrowLeft: jest.fn(() => <span data-testid="arrow-left" />),
    FaArrowRight: jest.fn(() => <span data-testid="arrow-right" />)
}))

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import paginateNavigationButtons from '../paginateNagivationButtons'

describe('paginateNavigationButtons', () => {
    let sampleList: number[]
    let consoleErrorSpy: jest.SpyInstance<void, Parameters<typeof console.error>>
    type IconMock = jest.Mock<JSX.Element, []>
    let mockedLeftIcon: IconMock
    let mockedRightIcon: IconMock

    beforeEach(() => {
        jest.clearAllMocks()
        sampleList = [1, 2, 3]
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
        mockedLeftIcon = FaArrowLeft as IconMock
        mockedRightIcon = FaArrowRight as IconMock
    })

    afterEach(() => {
        consoleErrorSpy.mockRestore()
    })

    test('renders right arrow when the list exceeds the lengthToShow threshold', () => {
        const { container } = render(paginateNavigationButtons(sampleList, 'right', 1))

        expect(mockedRightIcon).toHaveBeenCalledTimes(1)
        expect(mockedLeftIcon).not.toHaveBeenCalled()
        expect(container.firstChild).toHaveClass('right-0')
        expect(container.querySelector('[data-testid="arrow-right"]')).not.toBeNull()
        expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('renders left arrow when the list exceeds the lengthToShow threshold on the left side', () => {
        const { container } = render(paginateNavigationButtons(sampleList, 'left', 1))

        expect(mockedLeftIcon).toHaveBeenCalledTimes(1)
        expect(mockedRightIcon).not.toHaveBeenCalled()
        expect(container.firstChild).toHaveClass('left-0')
        expect(container.querySelector('[data-testid="arrow-left"]')).not.toBeNull()
        expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('returns an empty fragment when the list does not exceed the threshold', () => {
        sampleList = [1]

        const { container } = render(paginateNavigationButtons(sampleList, 'left'))

        expect(container.firstChild).toBeNull()
        expect(mockedLeftIcon).not.toHaveBeenCalled()
        expect(mockedRightIcon).not.toHaveBeenCalled()
        expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
})
