import { render, screen, fireEvent } from '@testing-library/react'
import { DeleteModal } from '../DeleteModal'

describe('DeleteModal', () => {
    const mockOnCancel = jest.fn()
    const mockOnConfirm = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should render DeleteModal component', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        expect(screen.getByText('Cancelar')).toBeTruthy()
        expect(screen.getByText('Confirmar')).toBeTruthy()
    })

    it('should render Cancel button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        expect(cancelButton).toBeTruthy()
    })

    it('should render Confirm button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')
        expect(confirmButton).toBeTruthy()
    })

    it('should call onCancel when Cancel button is clicked', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        fireEvent.click(cancelButton)

        expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onConfirm when Confirm button is clicked', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')
        fireEvent.click(confirmButton)

        expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })

    it('should not call onConfirm when Cancel button is clicked', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        fireEvent.click(cancelButton)

        expect(mockOnConfirm).not.toHaveBeenCalled()
    })

    it('should not call onCancel when Confirm button is clicked', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')
        fireEvent.click(confirmButton)

        expect(mockOnCancel).not.toHaveBeenCalled()
    })

    it('should have correct styling on Cancel button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        expect(cancelButton.className).toContain('px-2')
        expect(cancelButton.className).toContain('py-4')
        expect(cancelButton.className).toContain('rounded-md')
        expect(cancelButton.className).toContain('text-white')
        expect(cancelButton.className).toContain('bg-primary')
        expect(cancelButton.className).toContain('flex-1')
    })

    it('should have correct styling on Confirm button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')
        expect(confirmButton.className).toContain('px-2')
        expect(confirmButton.className).toContain('py-4')
        expect(confirmButton.className).toContain('rounded-md')
        expect(confirmButton.className).toContain('text-white')
        expect(confirmButton.className).toContain('bg-red-500')
        expect(confirmButton.className).toContain('flex-1')
    })

    it('should have correct margin on Confirm button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')
        expect(confirmButton.className).toContain('ml-8')
    })

    it('should have fixed overlay styling', () => {
        const { container } = render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const overlay = container.querySelector('[class*="fixed"]')
        expect(overlay?.className).toContain('z-10')
        expect(overlay?.className).toContain('fixed')
        expect(overlay?.className).toContain('w-screen')
        expect(overlay?.className).toContain('h-screen')
        expect(overlay?.className).toContain('bg-[#0009]')
    })

    it('should have correct positioning and centering', () => {
        const { container } = render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const overlay = container.querySelector('[class*="fixed"]')
        expect(overlay?.className).toContain('flex')
        expect(overlay?.className).toContain('justify-center')
        expect(overlay?.className).toContain('items-center')
    })

    it('should handle multiple clicks on Cancel button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')

        fireEvent.click(cancelButton)
        fireEvent.click(cancelButton)
        fireEvent.click(cancelButton)

        expect(mockOnCancel).toHaveBeenCalledTimes(3)
    })

    it('should handle multiple clicks on Confirm button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')

        fireEvent.click(confirmButton)
        fireEvent.click(confirmButton)
        fireEvent.click(confirmButton)

        expect(mockOnConfirm).toHaveBeenCalledTimes(3)
    })

    it('should render both buttons in the correct order', () => {
        const { container } = render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const buttons = container.querySelectorAll('button')
        expect(buttons.length).toBe(2)
        expect(buttons[0].textContent).toBe('Cancelar')
        expect(buttons[1].textContent).toBe('Confirmar')
    })

    it('should have correct max-width and relative positioning', () => {
        const { container } = render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const contentDiv = container.querySelector('[class*="relative"]')
        expect(contentDiv?.className).toContain('w-[90%]')
        expect(contentDiv?.className).toContain('max-w-125')
    })

    it('should return React.ReactNode', () => {
        const result = <DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />
        expect(result).toBeTruthy()
    })

    it('should have correct flex layout for buttons container', () => {
        const { container } = render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const contentDiv = container.querySelector('[class*="relative"]')
        expect(contentDiv?.className).toContain('flex')
        expect(contentDiv?.className).toContain('overflow-y-auto')
    })
})
