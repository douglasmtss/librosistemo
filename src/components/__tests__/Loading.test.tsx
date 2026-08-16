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

    test('should render an outer container div', () => {
        const { container } = render(<Loading />)
        const outerDiv = container.firstChild as HTMLElement
        expect(outerDiv.tagName).toBe('DIV')
    })

    test('should render an inner frame div inside the container', () => {
        const { container } = render(<Loading />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv).toBeTruthy()
    })

    test('should render the icon inside the inner frame', () => {
        const { container } = render(<Loading />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div') as HTMLElement
        const icon = innerDiv.querySelector('[data-testid="loading-icon"]')
        expect(icon).toBeTruthy()
    })

    test('should style the icon through the styled component class', () => {
        render(<Loading />)
        const icon = screen.getByTestId('loading-icon')
        expect(icon.className.length).toBeGreaterThan(0)
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

    test('should not render any text content', () => {
        const { container } = render(<Loading />)
        expect(container.textContent).toBe('')
    })

    test('should return React.ReactNode', () => {
        const result = <Loading />
        expect(result).toBeTruthy()
    })
})
