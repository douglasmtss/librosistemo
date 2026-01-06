import React from 'react'
import { render, screen } from '@testing-library/react'
import { Loading } from '../Loading'

jest.mock('react-icons/ai', () => ({
    AiOutlineLoading3Quarters: ({ className }: { className: string }): React.JSX.Element => (
        <span data-testid="loading-icon" className={className} />
    )
}))

describe('Loading', () => {
    test('should render Loading component', () => {
        const { container } = render(<Loading />)
        expect(container).toBeTruthy()
    })

    test('should render loading icon', () => {
        render(<Loading />)
        expect(screen.getByTestId('loading-icon')).toBeTruthy()
    })

    test('should have correct padding on outer div', () => {
        const { container } = render(<Loading />)
        const outerDiv = container.firstChild as HTMLElement
        expect(outerDiv.className).toContain('p-8')
    })

    test('should have correct flex properties on inner div', () => {
        const { container } = render(<Loading />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv?.className).toContain('flex')
        expect(innerDiv?.className).toContain('flex-col')
        expect(innerDiv?.className).toContain('justify-center')
        expect(innerDiv?.className).toContain('items-center')
    })

    test('should have correct border styling', () => {
        const { container } = render(<Loading />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv?.className).toContain('rounded-lg')
        expect(innerDiv?.className).toContain('border-4')
        expect(innerDiv?.className).toContain('border-gray-200')
    })

    test('should have correct icon styling with animation', () => {
        render(<Loading />)
        const icon = screen.getByTestId('loading-icon')
        expect(icon.className).toContain('animate-spin')
        expect(icon.className).toContain('text-primary')
        expect(icon.className).toContain('duration-100')
        expect(icon.className).toContain('text-9xl')
        expect(icon.className).toContain('opacity-60')
    })

    test('should have full width and height', () => {
        const { container } = render(<Loading />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv?.className).toContain('w-full')
        expect(innerDiv?.className).toContain('h-full')
    })

    test('should have minimum dimensions', () => {
        const { container } = render(<Loading />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv?.className).toContain('min-w-62.5')
        expect(innerDiv?.className).toContain('min-h-62.5')
    })

    test('should render correct DOM structure', () => {
        const { container } = render(<Loading />)
        const outerDiv = container.firstChild as HTMLElement
        const innerDiv = outerDiv.querySelector('div') as HTMLElement
        const icon = innerDiv.querySelector('[data-testid="loading-icon"]')

        expect(outerDiv).toBeTruthy()
        expect(innerDiv).toBeTruthy()
        expect(icon).toBeTruthy()
    })

    test('should return React.ReactNode', () => {
        const result = <Loading />
        expect(result).toBeTruthy()
    })

    test('should have opacity set to 60%', () => {
        render(<Loading />)
        const icon = screen.getByTestId('loading-icon')
        expect(icon.className).toContain('opacity-60')
    })
})
