import { render, screen } from '@testing-library/react'
import { BookStatus } from '../BookStatus'

describe('BookStatus', () => {
    test('should render available status', () => {
        render(<BookStatus label="available" />)
        expect(screen.getByText('disponível')).toBeTruthy()
    })

    test('should render borrowed status', () => {
        render(<BookStatus label="borrowed" />)
        expect(screen.getByText('emprestado')).toBeTruthy()
    })

    test('should render nothing for default status', () => {
        const { container } = render(<BookStatus label="default" />)
        const firstChild = container.firstChild as HTMLElement
        expect(firstChild?.childNodes.length ?? 0).toBe(0)
    })

    test('should apply custom className to available status', () => {
        render(<BookStatus label="available" className="custom-class" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('custom-class')
    })

    test('should apply custom className to borrowed status', () => {
        render(<BookStatus label="borrowed" className="custom-class" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('custom-class')
    })

    test('should keep the component base styling class alongside a custom className for available', () => {
        render(<BookStatus label="available" className="custom-class" />)
        const span = screen.getByText('disponível')
        const classes = span.className.split(' ').filter(Boolean)
        expect(classes).toContain('custom-class')
        expect(classes.length).toBeGreaterThan(1)
    })

    test('should keep the component base styling class alongside a custom className for borrowed', () => {
        render(<BookStatus label="borrowed" className="custom-class" />)
        const span = screen.getByText('emprestado')
        const classes = span.className.split(' ').filter(Boolean)
        expect(classes).toContain('custom-class')
        expect(classes.length).toBeGreaterThan(1)
    })

    test('should render span element for available status', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.tagName).toBe('SPAN')
    })

    test('should render span element for borrowed status', () => {
        render(<BookStatus label="borrowed" />)
        const span = screen.getByText('emprestado')
        expect(span.tagName).toBe('SPAN')
    })

    test('should not render the available label for borrowed status', () => {
        render(<BookStatus label="borrowed" />)
        expect(screen.queryByText('disponível')).toBeFalsy()
    })

    test('should not render the borrowed label for available status', () => {
        render(<BookStatus label="available" />)
        expect(screen.queryByText('emprestado')).toBeFalsy()
    })

    test('should handle default label value', () => {
        const { container } = render(<BookStatus label="default" />)
        const firstChild = container.firstChild as HTMLElement
        expect(firstChild?.childNodes.length ?? 0).toBe(0)
    })

    test('should handle empty custom className', () => {
        render(<BookStatus label="available" className="" />)
        const span = screen.getByText('disponível')
        expect(span).toBeTruthy()
    })

    test('should return React.ReactNode', () => {
        const result = <BookStatus label="available" />
        expect(result).toBeTruthy()
    })
})
