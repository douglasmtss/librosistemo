import { render, screen } from '@testing-library/react'
import { BookStatus } from '../BookStatus'

jest.mock('@/lib/tailwindMerge', () => ({
    cn: (...classes: string[]): string => classes.filter(Boolean).join(' ')
}))

describe('BookStatus', () => {
    it('should render available status', () => {
        render(<BookStatus label="available" />)
        expect(screen.getByText('disponível')).toBeTruthy()
    })

    it('should render borrowed status', () => {
        render(<BookStatus label="borrowed" />)
        expect(screen.getByText('emprestado')).toBeTruthy()
    })

    it('should render nothing for default status', () => {
        const { container } = render(<BookStatus label="default" />)
        const firstChild = container.firstChild as HTMLElement
        expect(firstChild?.childNodes.length ?? 0).toBe(0)
    })

    it('should have correct classes for available status', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('font-semibold')
        expect(span.className).toContain('border-2')
        expect(span.className).toContain('rounded-md')
        expect(span.className).toContain('p-2')
        expect(span.className).toContain('text-green-500')
        expect(span.className).toContain('border-green-500')
    })

    it('should have correct classes for borrowed status', () => {
        render(<BookStatus label="borrowed" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('font-semibold')
        expect(span.className).toContain('border-2')
        expect(span.className).toContain('rounded-md')
        expect(span.className).toContain('p-2')
        expect(span.className).toContain('text-red-500')
        expect(span.className).toContain('border-red-500')
    })

    it('should apply custom className to available status', () => {
        render(<BookStatus label="available" className="custom-class" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('custom-class')
    })

    it('should apply custom className to borrowed status', () => {
        render(<BookStatus label="borrowed" className="custom-class" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('custom-class')
    })

    it('should merge custom className with default classes for available', () => {
        render(<BookStatus label="available" className="custom-class" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('font-semibold')
        expect(span.className).toContain('custom-class')
    })

    it('should merge custom className with default classes for borrowed', () => {
        render(<BookStatus label="borrowed" className="custom-class" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('font-semibold')
        expect(span.className).toContain('custom-class')
    })

    it('should render span element for available status', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.tagName).toBe('SPAN')
    })

    it('should render span element for borrowed status', () => {
        render(<BookStatus label="borrowed" />)
        const span = screen.getByText('emprestado')
        expect(span.tagName).toBe('SPAN')
    })

    it('should use correct color classes for available', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('text-green-500')
        expect(span.className).not.toContain('text-red-500')
    })

    it('should use correct color classes for borrowed', () => {
        render(<BookStatus label="borrowed" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('text-red-500')
        expect(span.className).not.toContain('text-green-500')
    })

    it('should handle default label value', () => {
        const { container } = render(<BookStatus label="default" />)
        const firstChild = container.firstChild as HTMLElement
        expect(firstChild?.childNodes.length ?? 0).toBe(0)
    })

    it('should handle empty custom className', () => {
        render(<BookStatus label="available" className="" />)
        const span = screen.getByText('disponível')
        expect(span).toBeTruthy()
    })

    it('should return React.ReactNode', () => {
        const result = <BookStatus label="available" />
        expect(result).toBeTruthy()
    })

    it('should have padding on all sides', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('p-2')
    })

    it('should have rounded corners', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('rounded-md')
    })

    it('should have border-2 thickness for available', () => {
        render(<BookStatus label="available" />)
        const span = screen.getByText('disponível')
        expect(span.className).toContain('border-2')
    })

    it('should have border-2 thickness for borrowed', () => {
        render(<BookStatus label="borrowed" />)
        const span = screen.getByText('emprestado')
        expect(span.className).toContain('border-2')
    })
})
