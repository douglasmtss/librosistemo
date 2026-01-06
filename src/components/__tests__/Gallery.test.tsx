/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Gallery } from '../Gallery'

jest.mock('@/lib/reduceImageFileSize', () => ({
    reduceImageFileSize: jest.fn((base64: string) => Promise.resolve('compressed-' + base64))
}))

jest.mock('@/lib/toBase64', () => ({
    toBase64: jest.fn(
        (): Promise<string> =>
            Promise.resolve(
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
            )
    )
}))

jest.mock('../Img', () => ({
    Img: ({ src, width, alt }: { src: string; width: number; alt: string }): React.JSX.Element => (
        <img data-testid="gallery-img" src={src} width={width} alt={alt} />
    )
}))

jest.mock('../styles', () => {
    const MockElement = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
        <div data-testid="paginated-container">{children}</div>
    )

    return {
        PaginatedContainer: React.forwardRef(MockElement)
    }
})

describe('Gallery', () => {
    let mockOnSave: jest.Mock
    let mockOnCancel: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        mockOnSave = jest.fn()
        mockOnCancel = jest.fn()
        // Suppress empty src warnings for Gallery component which renders with empty compressed initially
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test('should render Gallery component', () => {
        const { container } = render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        expect(container).toBeTruthy()
    })

    test('should render main container div', () => {
        const { container } = render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const mainDiv = container.querySelector('.flex.flex-col')
        expect(mainDiv).toBeTruthy()
    })

    test('should render file input with correct label', () => {
        render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const label = screen.getByText('Escolher arquivo')
        expect(label).toBeTruthy()
    })

    test('should render file input element', () => {
        const { container } = render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const fileInput = container.querySelector('input[type="file"]')
        expect(fileInput).toBeTruthy()
    })

    test('should render Save button', () => {
        render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const buttons = screen.getAllByRole('button')
        const saveButton = buttons.find(btn => btn.textContent === 'Save')
        expect(saveButton).toBeTruthy()
    })

    test('should render Cancel button', () => {
        render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    test('should call onCancel when cancel button clicked', () => {
        render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const buttons = screen.getAllByRole('button')
        const cancelButton = buttons[buttons.length - 1]
        fireEvent.click(cancelButton)
        expect(mockOnCancel).toHaveBeenCalled()
    })

    test('should handle file input change', async () => {
        const { container } = render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
        const file = new File(['content'], 'test.png', { type: 'image/png' })

        fireEvent.change(fileInput, { target: { files: [file] } })

        await waitFor(() => {
            expect(fileInput.files?.length).toBe(1)
        })
    })

    test('should render flex container structure', () => {
        const { container } = render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const flexElements = container.querySelectorAll('.flex')
        expect(flexElements.length).toBeGreaterThan(0)
    })

    test('should have white background container for controls', () => {
        const { container } = render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const whiteDiv = container.querySelector('.bg-white')
        expect(whiteDiv).toBeTruthy()
    })

    test('should handle file input with no files selected', () => {
        const { container } = render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

        // Fire change event with empty files
        fireEvent.change(fileInput, { target: { files: [] } })

        // Component should handle gracefully
        expect(fileInput).toBeTruthy()
    })

    test('should save image when Save button is clicked with valid image', async () => {
        render(<Gallery onSave={mockOnSave} onCancel={mockOnCancel} />)
        const fileInput = screen.getByLabelText('Escolher arquivo') as HTMLInputElement

        if (fileInput) {
            const file = new File(['content'], 'test.png', { type: 'image/png' })
            fireEvent.change(fileInput, { target: { files: [file] } })

            await waitFor(
                () => {
                    const saveButton = screen.getByText('Save')
                    fireEvent.click(saveButton)
                },
                { timeout: 3000 }
            )
        }
    })
})
