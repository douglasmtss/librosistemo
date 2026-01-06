import { render, screen } from '@testing-library/react'
import { BookStatus } from '../BookStatus'

jest.mock('@/lib/tailwindMerge', () => ({
    cn: (...classes: string[]): string => classes.filter(Boolean).join(' ')
}))

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

    test('should have correct classes for available status', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('font-semibold')
        expect(span.className).toContain('border-2')
        expect(span.className).toContain('rounded-md')
        expect(span.className).toContain('p-2')
        expect(span.className).toContain('text-green-500')
        expect(span.className).toContain('border-green-500')
    })

    test('should have correct classes for borrowed status', () => {
        render(<BookStatus label="borrowed" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('font-semibold')
        expect(span.className).toContain('border-2')
        expect(span.className).toContain('rounded-md')
        expect(span.className).toContain('p-2')
        expect(span.className).toContain('text-red-500')
        expect(span.className).toContain('border-red-500')
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

    test('should merge custom className with default classes for available', () => {
        render(<BookStatus label="available" className="custom-class" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('font-semibold')
        expect(span.className).toContain('custom-class')
    })

    test('should merge custom className with default classes for borrowed', () => {
        render(<BookStatus label="borrowed" className="custom-class" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('font-semibold')
        expect(span.className).toContain('custom-class')
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

    test('should use correct color classes for available', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('text-green-500')
        expect(span.className).not.toContain('text-red-500')
    })

    test('should use correct color classes for borrowed', () => {
        render(<BookStatus label="borrowed" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('text-red-500')
        expect(span.className).not.toContain('text-green-500')
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

    test('should have padding on all sides', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('p-2')
    })

    test('should have rounded corners', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('rounded-md')
    })

    test('should have border-2 thickness for available', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('border-2')
    })

    test('should have border-2 thickness for borrowed', () => {
        render(<BookStatus label="borrowed" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('border-2')
    })
})
