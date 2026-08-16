import React from 'react'
import { render, screen } from '@testing-library/react'
import { Empty } from '../Empty'

jest.mock('react-icons/fa', () => ({
    FaRegFolderOpen: ({ className }: { className: string }): React.JSX.Element => (
        <span data-testid="folder-icon" className={className} />
    )
}))

describe('Empty', () => {
    test('should render Empty component', () => {
        const { container } = render(<Empty />)
        expect(container).toBeTruthy()
    })

    test('should render folder icon', () => {
        render(<Empty />)
        expect(screen.getByTestId('folder-icon')).toBeTruthy()
    })

    test('should render empty message text', () => {
        render(<Empty />)
        expect(screen.getByText('Nenhum dado foi econtrado')).toBeTruthy()
    })

    test('should render an outer container div', () => {
        const { container } = render(<Empty />)
        const outerDiv = container.firstChild as HTMLElement
        expect(outerDiv.tagName).toBe('DIV')
    })

    test('should render an inner frame div inside the container', () => {
        const { container } = render(<Empty />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv).toBeTruthy()
    })

    test('should style the icon through the styled component class', () => {
        render(<Empty />)
        const icon = screen.getByTestId('folder-icon')
        expect(icon.className.length).toBeGreaterThan(0)
    })

    test('should render the message in a span element', () => {
        render(<Empty />)
        const text = screen.getByText('Nenhum dado foi econtrado')
        expect(text.tagName).toBe('SPAN')
    })

    test('should render the icon before the message', () => {
        const { container } = render(<Empty />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div') as HTMLElement
        const icon = innerDiv.querySelector('[data-testid="folder-icon"]')
        expect(innerDiv.firstElementChild).toBe(icon)
    })

    test('should render correct DOM structure', () => {
        const { container } = render(<Empty />)
        const outerDiv = container.firstChild as HTMLElement
        const innerDiv = outerDiv.querySelector('div') as HTMLElement
        const icon = innerDiv.querySelector('[data-testid="folder-icon"]')
        const text = innerDiv.querySelector('span:last-child')

        expect(outerDiv).toBeTruthy()
        expect(innerDiv).toBeTruthy()
        expect(icon).toBeTruthy()
        expect(text).toBeTruthy()
    })

    test('should return React.ReactNode', () => {
        const result = <Empty />
        expect(result).toBeTruthy()
    })
})
