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

    test('should have correct padding on outer div', () => {
        const { container } = render(<Empty />)
        const outerDiv = container.firstChild as HTMLElement
        expect(outerDiv.className).toContain('p-8')
    })

    test('should have correct flex properties on inner div', () => {
        const { container } = render(<Empty />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv?.className).toContain('flex')
        expect(innerDiv?.className).toContain('flex-col')
        expect(innerDiv?.className).toContain('justify-center')
        expect(innerDiv?.className).toContain('items-center')
    })

    test('should have correct border styling', () => {
        const { container } = render(<Empty />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv?.className).toContain('rounded-lg')
        expect(innerDiv?.className).toContain('border-4')
        expect(innerDiv?.className).toContain('border-gray-200')
    })

    test('should have correct icon styling', () => {
        render(<Empty />)
        const icon = screen.getByTestId('folder-icon')
        expect(icon.className).toContain('text-gray-300')
        expect(icon.className).toContain('text-9xl')
    })

    test('should have correct text styling', () => {
        render(<Empty />)
        const text = screen.getByText('Nenhum dado foi econtrado')
        expect(text.className).toContain('text-gray-400')
        expect(text.className).toContain('text-xl')
    })

    test('should have full width and height', () => {
        const { container } = render(<Empty />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv?.className).toContain('w-full')
        expect(innerDiv?.className).toContain('h-full')
    })

    test('should have minimum dimensions', () => {
        const { container } = render(<Empty />)
        const innerDiv = (container.firstChild as HTMLElement).querySelector('div')
        expect(innerDiv?.className).toContain('min-w-62.5')
        expect(innerDiv?.className).toContain('min-h-62.5')
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
