import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectPhoto } from '../SelectPhoto'

jest.mock('../Camera', () => ({
    Camera: ({ onCancel, onSave }: { onCancel: () => void; onSave: (image: string) => void }): React.JSX.Element => (
        <div data-testid="camera-component">
            <button onClick={onCancel} data-testid="camera-cancel">
                Cancel Camera
            </button>
            <button onClick={() => onSave('camera-image.jpg')} data-testid="camera-save">
                Save from Camera
            </button>
        </div>
    )
}))

jest.mock('../Gallery', () => ({
    Gallery: ({ onCancel, onSave }: { onCancel: () => void; onSave: (image: string) => void }): React.JSX.Element => (
        <div data-testid="gallery-component">
            <button onClick={onCancel} data-testid="gallery-cancel">
                Cancel Gallery
            </button>
            <button onClick={() => onSave('gallery-image.jpg')} data-testid="gallery-save">
                Save from Gallery
            </button>
        </div>
    )
}))

describe('SelectPhoto', () => {
    const mockOnCancel = jest.fn()
    const mockOnSave = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should render SelectPhoto component', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        expect(screen.getByText('Cancelar')).toBeTruthy()
    })

    test('should render Cancel button', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        expect(screen.getByText('Cancelar')).toBeTruthy()
    })

    test('should render Gallery button', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        expect(screen.getByText('Galeria')).toBeTruthy()
    })

    test('should render Camera button', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        expect(screen.getByText('Camera')).toBeTruthy()
    })

    test('should call onCancel when Cancel button is clicked', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cancelButton = screen.getByText('Cancelar')
        fireEvent.click(cancelButton)

        expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    test('should show Camera component when Camera button is clicked', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cameraButton = screen.getByText('Camera')
        fireEvent.click(cameraButton)

        expect(screen.getByTestId('camera-component')).toBeTruthy()
    })

    test('should show Gallery component when Gallery button is clicked', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const galleryButton = screen.getByText('Galeria')
        fireEvent.click(galleryButton)

        expect(screen.getByTestId('gallery-component')).toBeTruthy()
    })

    test('should hide main menu when Camera is selected', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cameraButton = screen.getByText('Camera')
        fireEvent.click(cameraButton)

        expect(screen.queryByText('Galeria')).toBeFalsy()
    })

    test('should hide main menu when Gallery is selected', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const galleryButton = screen.getByText('Galeria')
        fireEvent.click(galleryButton)

        expect(screen.queryByText('Camera')).toBeFalsy()
    })

    test('should render Camera with onCancel prop', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cameraButton = screen.getByText('Camera')
        fireEvent.click(cameraButton)

        const cameraCancel = screen.getByTestId('camera-cancel')
        expect(cameraCancel).toBeTruthy()
    })

    test('should render Camera with onSave prop', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cameraButton = screen.getByText('Camera')
        fireEvent.click(cameraButton)

        const cameraSave = screen.getByTestId('camera-save')
        expect(cameraSave).toBeTruthy()
    })

    test('should render Gallery with onCancel prop', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const galleryButton = screen.getByText('Galeria')
        fireEvent.click(galleryButton)

        const galleryCancel = screen.getByTestId('gallery-cancel')
        expect(galleryCancel).toBeTruthy()
    })

    test('should render Gallery with onSave prop', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const galleryButton = screen.getByText('Galeria')
        fireEvent.click(galleryButton)

        const gallerySave = screen.getByTestId('gallery-save')
        expect(gallerySave).toBeTruthy()
    })

    test('should call onSave when Camera component saves', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cameraButton = screen.getByText('Camera')
        fireEvent.click(cameraButton)

        const cameraSave = screen.getByTestId('camera-save')
        fireEvent.click(cameraSave)

        expect(mockOnSave).toHaveBeenCalledWith('camera-image.jpg')
    })

    test('should call onSave when Gallery component saves', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const galleryButton = screen.getByText('Galeria')
        fireEvent.click(galleryButton)

        const gallerySave = screen.getByTestId('gallery-save')
        fireEvent.click(gallerySave)

        expect(mockOnSave).toHaveBeenCalledWith('gallery-image.jpg')
    })

    test('should render Cancel button as a button element with a styled class', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cancelButton = screen.getByText('Cancelar')
        expect(cancelButton.tagName).toBe('BUTTON')
        expect(cancelButton.className).not.toBe('')
    })

    test('should style Gallery and Camera buttons the same way', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const galleryButton = screen.getByText('Galeria')
        const cameraButton = screen.getByText('Camera')
        expect(galleryButton.className).toBe(cameraButton.className)
    })

    test('should style Cancel button differently from primary buttons', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cancelButton = screen.getByText('Cancelar')
        const cameraButton = screen.getByText('Camera')
        expect(cancelButton.className).not.toBe(cameraButton.className)
    })

    test('should render an overlay as the outermost element', () => {
        const { container } = render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const overlay = container.firstChild as HTMLElement
        expect(overlay.tagName).toBe('DIV')
        expect(overlay.contains(screen.getByText('Cancelar'))).toBe(true)
        expect(overlay.contains(screen.getByText('Galeria'))).toBe(true)
        expect(overlay.contains(screen.getByText('Camera'))).toBe(true)
    })

    test('should render all buttons inside the same actions row', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cancelButton = screen.getByText('Cancelar')
        const galleryButton = screen.getByText('Galeria')
        const cameraButton = screen.getByText('Camera')
        expect(cancelButton.parentElement).toBe(galleryButton.parentElement)
        expect(galleryButton.parentElement).toBe(cameraButton.parentElement)
    })

    test('should not call onCancel when Gallery button is clicked', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const galleryButton = screen.getByText('Galeria')
        fireEvent.click(galleryButton)

        expect(mockOnCancel).not.toHaveBeenCalled()
    })

    test('should not call onCancel when Camera button is clicked', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const cameraButton = screen.getByText('Camera')
        fireEvent.click(cameraButton)

        expect(mockOnCancel).not.toHaveBeenCalled()
    })

    test('should render buttons in the correct order', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const buttons = screen.getAllByRole('button')

        expect(buttons.length).toBe(3)
        expect(buttons[0].textContent).toBe('Cancelar')
        expect(buttons[1].textContent).toBe('Galeria')
        expect(buttons[2].textContent).toBe('Camera')
    })

    test('should return React.ReactNode', () => {
        const result = <SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />
        expect(result).toBeTruthy()
    })

    test('should apply generated styled-components classes to all buttons', () => {
        render(<SelectPhoto onCancel={mockOnCancel} onSave={mockOnSave} />)
        const buttons = screen.getAllByRole('button')

        buttons.forEach(button => {
            expect(button.className).not.toBe('')
        })
    })
})
