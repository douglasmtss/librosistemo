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

    test('should render DeleteModal component', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        expect(screen.getByText('Cancelar')).toBeTruthy()
        expect(screen.getByText('Confirmar')).toBeTruthy()
    })

    test('should render Cancel button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        expect(cancelButton).toBeTruthy()
    })

    test('should render Confirm button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')
        expect(confirmButton).toBeTruthy()
    })

    test('should call onCancel when Cancel button is clicked', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        fireEvent.click(cancelButton)

        expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    test('should call onConfirm when Confirm button is clicked', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')
        fireEvent.click(confirmButton)

        expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })

    test('should not call onConfirm when Cancel button is clicked', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        fireEvent.click(cancelButton)

        expect(mockOnConfirm).not.toHaveBeenCalled()
    })

    test('should not call onCancel when Confirm button is clicked', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')
        fireEvent.click(confirmButton)

        expect(mockOnCancel).not.toHaveBeenCalled()
    })

    test('should render Cancel button as a button element with a styled class', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        expect(cancelButton.tagName).toBe('BUTTON')
        expect(cancelButton.className).not.toBe('')
    })

    test('should render Confirm button as a button element with a styled class', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')
        expect(confirmButton.tagName).toBe('BUTTON')
        expect(confirmButton.className).not.toBe('')
    })

    test('should style Cancel and Confirm buttons differently', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        const confirmButton = screen.getByText('Confirmar')
        expect(cancelButton.className).not.toBe(confirmButton.className)
    })

    test('should render an overlay as the outermost element wrapping both buttons', () => {
        const { container } = render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const overlay = container.firstChild as HTMLElement
        expect(overlay.tagName).toBe('DIV')
        expect(overlay.contains(screen.getByText('Cancelar'))).toBe(true)
        expect(overlay.contains(screen.getByText('Confirmar'))).toBe(true)
    })

    test('should render both buttons inside the same actions wrapper', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')
        const confirmButton = screen.getByText('Confirmar')
        expect(cancelButton.parentElement).toBe(confirmButton.parentElement)
    })

    test('should handle multiple clicks on Cancel button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const cancelButton = screen.getByText('Cancelar')

        fireEvent.click(cancelButton)
        fireEvent.click(cancelButton)
        fireEvent.click(cancelButton)

        expect(mockOnCancel).toHaveBeenCalledTimes(3)
    })

    test('should handle multiple clicks on Confirm button', () => {
        render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const confirmButton = screen.getByText('Confirmar')

        fireEvent.click(confirmButton)
        fireEvent.click(confirmButton)
        fireEvent.click(confirmButton)

        expect(mockOnConfirm).toHaveBeenCalledTimes(3)
    })

    test('should render both buttons in the correct order', () => {
        const { container } = render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const buttons = container.querySelectorAll('button')
        expect(buttons.length).toBe(2)
        expect(buttons[0].textContent).toBe('Cancelar')
        expect(buttons[1].textContent).toBe('Confirmar')
    })

    test('should render the actions wrapper as the only child of the overlay', () => {
        const { container } = render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const overlay = container.firstChild as HTMLElement
        expect(overlay.children.length).toBe(1)
        expect((overlay.firstChild as HTMLElement).tagName).toBe('DIV')
    })

    test('should return React.ReactNode', () => {
        const result = <DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />
        expect(result).toBeTruthy()
    })

    test('should contain only the two action buttons in the actions wrapper', () => {
        const { container } = render(<DeleteModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} />)
        const actionsWrapper = (container.firstChild as HTMLElement).firstChild as HTMLElement
        expect(actionsWrapper.children.length).toBe(2)
        expect(actionsWrapper.children[0].tagName).toBe('BUTTON')
        expect(actionsWrapper.children[1].tagName).toBe('BUTTON')
    })
})
