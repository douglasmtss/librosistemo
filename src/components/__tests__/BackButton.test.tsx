import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BackButton } from '../BackButton'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation')
jest.mock('react-icons/io5', (): object => ({
    IoArrowBackCircleOutline: ({ className }: { className: string }): React.ReactNode => (
        <span data-testid="back-icon" className={className}>
            BackIcon
        </span>
    )
}))
jest.mock('@/lib/tailwindMerge', () => ({
    cn: (...classes: string[]): string => classes.filter(Boolean).join(' ')
}))

describe('BackButton', (): void => {
    const mockBack = jest.fn()
    const mockUseRouter = useRouter as jest.Mock

    beforeEach((): void => {
        jest.clearAllMocks()
        mockUseRouter.mockReturnValue({
            back: mockBack
        })
    })

    afterEach((): void => {
        jest.clearAllMocks()
    })

    test('should render button with text', (): void => {
        render(<BackButton />)

        expect(screen.getByText('Voltar')).toBeTruthy()
    })

    test('should render back icon', (): void => {
        render(<BackButton />)

        expect(screen.getByTestId('back-icon')).toBeTruthy()
    })

    test('should call router.back when clicked', (): void => {
        render(<BackButton />)

        const button = screen.getByText('Voltar').closest('div')
        if (button) {
            fireEvent.click(button)
        }

        expect(mockBack).toHaveBeenCalledTimes(1)
    })

    test('should apply classNameContainer prop', (): void => {
        render(<BackButton classNameContainer="custom-container-class" />)

        const container = screen.getByText('Voltar').closest('div')
        expect(container?.className).toContain('custom-container-class')
    })

    test('should apply classNameIcon prop', (): void => {
        render(<BackButton classNameIcon="custom-icon-class" />)

        const icon = screen.getByTestId('back-icon')
        expect(icon.className).toContain('custom-icon-class')
    })

    test('should apply both className props', (): void => {
        render(<BackButton classNameContainer="container-class" classNameIcon="icon-class" />)

        const container = screen.getByText('Voltar').closest('div')
        const icon = screen.getByTestId('back-icon')

        expect(container?.className).toContain('container-class')
        expect(icon.className).toContain('icon-class')
    })

    test('should have flex items-center classes by default', (): void => {
        render(<BackButton />)

        const container = screen.getByText('Voltar').closest('div')
        expect(container?.className).toContain('flex')
        expect(container?.className).toContain('items-center')
    })

    test('should have cursor-pointer class by default', (): void => {
        render(<BackButton />)

        const container = screen.getByText('Voltar').closest('div')
        expect(container?.className).toContain('cursor-pointer')
    })

    test('should be clickable and responsive to multiple clicks', (): void => {
        render(<BackButton />)

        const button = screen.getByText('Voltar').closest('div')

        if (button) {
            fireEvent.click(button)
            fireEvent.click(button)
            fireEvent.click(button)
        }

        expect(mockBack).toHaveBeenCalledTimes(3)
    })

    test('should maintain functionality with empty className props', (): void => {
        render(<BackButton classNameContainer="" classNameIcon="" />)

        const button = screen.getByText('Voltar').closest('div')
        if (button) {
            fireEvent.click(button)
        }

        expect(mockBack).toHaveBeenCalledTimes(1)
    })

    test('should have mr-2 class on icon', (): void => {
        render(<BackButton />)

        const icon = screen.getByTestId('back-icon')
        expect(icon.className).toContain('mr-2')
    })
})
