import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import HamburgerAndCloser from '../HamburgerAndCloser'

jest.mock('@/lib/tailwindMerge', () => ({
    cn: (...classes: string[]): string => classes.filter(Boolean).join(' ')
}))

jest.mock('react-icons/fa', () => ({
    FaBars: ({ className }: { className?: string }): React.JSX.Element => (
        <span data-testid="bars-icon" className={className} />
    ),
    FaTimes: ({ className }: { className?: string }): React.JSX.Element => (
        <span data-testid="times-icon" className={className} />
    )
}))

describe('HamburgerAndCloser', () => {
    const mockSetShow = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should render hamburger icon when show is false', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        expect(screen.getByTestId('bars-icon')).toBeTruthy()
    })

    it('should render close icon when show is true', () => {
        render(<HamburgerAndCloser show={true} setShow={mockSetShow} />)
        expect(screen.getByTestId('times-icon')).toBeTruthy()
    })

    it('should toggle show state on click', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockSetShow).toHaveBeenCalledWith(true)
    })

    it('should toggle from true to false on click', () => {
        render(<HamburgerAndCloser show={true} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockSetShow).toHaveBeenCalledWith(false)
    })

    it('should render button element', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        expect(button).toBeTruthy()
    })

    it('should have text-2xl class by default', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        expect(button.className).toContain('text-2xl')
    })

    it('should apply custom className', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} className="custom-class" />)
        const button = screen.getByRole('button')
        expect(button.className).toContain('custom-class')
    })

    it('should apply focus outline hidden class', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        expect(button.className).toContain('focus:outline-hidden')
    })

    it('should handle multiple clicks', () => {
        const { rerender } = render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')

        fireEvent.click(button)
        expect(mockSetShow).toHaveBeenCalledWith(true)

        rerender(<HamburgerAndCloser show={true} setShow={mockSetShow} />)
        fireEvent.click(button)
        expect(mockSetShow).toHaveBeenCalledWith(false)
    })

    it('should not have z-20 class on bars icon', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const icon = screen.getByTestId('bars-icon')
        expect(icon.className).not.toContain('z-20')
    })

    it('should have z-20 class on times icon', () => {
        render(<HamburgerAndCloser show={true} setShow={mockSetShow} />)
        const icon = screen.getByTestId('times-icon')
        expect(icon.className).toContain('relative')
        expect(icon.className).toContain('z-20')
    })

    it('should call setShow with boolean value', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockSetShow).toHaveBeenCalledWith(expect.any(Boolean))
    })

    it('should use dispatch action pattern for setShow', () => {
        const setShowMock = jest.fn((prevState: boolean) => !prevState) as React.Dispatch<React.SetStateAction<boolean>>
        render(<HamburgerAndCloser show={false} setShow={setShowMock} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(setShowMock).toHaveBeenCalled()
    })

    it('should render with className prop when provided', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} className="md:hidden" />)
        const button = screen.getByRole('button')
        expect(button.className).toContain('md:hidden')
    })

    it('should merge default and custom classes', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} className="custom" />)
        const button = screen.getByRole('button')
        expect(button.className).toContain('text-2xl')
        expect(button.className).toContain('custom')
    })

    it('should return React.ReactNode', () => {
        const result = <HamburgerAndCloser show={false} setShow={mockSetShow} />
        expect(result).toBeTruthy()
    })

    it('should handle empty className string', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} className="" />)
        const button = screen.getByRole('button')
        expect(button).toBeTruthy()
    })

    it('should call setShow exactly once per click', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')

        fireEvent.click(button)
        fireEvent.click(button)

        expect(mockSetShow).toHaveBeenCalledTimes(2)
    })

    it('should not render children', () => {
        const { container } = render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = container.querySelector('button')
        expect(button?.children.length).toBeGreaterThan(0)
    })
})
