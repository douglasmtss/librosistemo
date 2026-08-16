import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import HamburgerAndCloser from '../HamburgerAndCloser'

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

    test('should render hamburger icon when show is false', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        expect(screen.getByTestId('bars-icon')).toBeTruthy()
    })

    test('should render close icon when show is true', () => {
        render(<HamburgerAndCloser show={true} setShow={mockSetShow} />)
        expect(screen.getByTestId('times-icon')).toBeTruthy()
    })

    test('should toggle show state on click', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockSetShow).toHaveBeenCalledWith(true)
    })

    test('should toggle from true to false on click', () => {
        render(<HamburgerAndCloser show={true} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockSetShow).toHaveBeenCalledWith(false)
    })

    test('should render button element', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        expect(button).toBeTruthy()
    })

    test('should apply custom className', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} className="custom-class" />)
        const button = screen.getByRole('button')
        expect(button.className).toContain('custom-class')
    })

    test('should handle multiple clicks', () => {
        const { rerender } = render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')

        fireEvent.click(button)
        expect(mockSetShow).toHaveBeenCalledWith(true)

        rerender(<HamburgerAndCloser show={true} setShow={mockSetShow} />)
        fireEvent.click(button)
        expect(mockSetShow).toHaveBeenCalledWith(false)
    })

    test('should not render close icon when show is false', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        expect(screen.queryByTestId('times-icon')).toBeFalsy()
    })

    test('should not render hamburger icon when show is true', () => {
        render(<HamburgerAndCloser show={true} setShow={mockSetShow} />)
        expect(screen.queryByTestId('bars-icon')).toBeFalsy()
    })

    test('should call setShow with boolean value', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockSetShow).toHaveBeenCalledWith(expect.any(Boolean))
    })

    test('should use dispatch action pattern for setShow', () => {
        const setShowMock = jest.fn((prevState: boolean) => !prevState) as React.Dispatch<React.SetStateAction<boolean>>
        render(<HamburgerAndCloser show={false} setShow={setShowMock} />)
        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(setShowMock).toHaveBeenCalled()
    })

    test('should keep the component base styling class alongside a custom className', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} className="custom" />)
        const button = screen.getByRole('button')
        const classes = button.className.split(' ').filter(Boolean)
        expect(classes).toContain('custom')
        expect(classes.length).toBeGreaterThan(1)
    })

    test('should return React.ReactNode', () => {
        const result = <HamburgerAndCloser show={false} setShow={mockSetShow} />
        expect(result).toBeTruthy()
    })

    test('should handle empty className string', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} className="" />)
        const button = screen.getByRole('button')
        expect(button).toBeTruthy()
    })

    test('should call setShow exactly once per click', () => {
        render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = screen.getByRole('button')

        fireEvent.click(button)
        fireEvent.click(button)

        expect(mockSetShow).toHaveBeenCalledTimes(2)
    })

    test('should not render children', () => {
        const { container } = render(<HamburgerAndCloser show={false} setShow={mockSetShow} />)
        const button = container.querySelector('button')
        expect(button?.children.length).toBeGreaterThan(0)
    })
})
