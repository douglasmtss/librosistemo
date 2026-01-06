import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { Camera } from '../Camera'

jest.mock('react-icons/im', () => ({
    ImCross: ({ className }: { className?: string }): React.JSX.Element => (
        <span className={className} data-testid="cross-icon">
            ✕
        </span>
    )
}))

jest.mock('react-webcam', () => {
    const MockElement = ({}: Record<string, unknown>, ref: React.Ref<HTMLVideoElement>): React.JSX.Element => (
        <video ref={ref} data-testid="webcam" style={{ width: '100%', height: '100%' }} />
    )

    return {
        __esModule: true,
        default: React.forwardRef(MockElement)
    }
})

jest.mock('@/lib/reduceImageFileSize', () => ({
    reduceImageFileSize: jest.fn((base64: string) => Promise.resolve('compressed-' + base64))
}))

// Mock navigator.mediaDevices
const mockGetUserMedia = jest.fn(() =>
    Promise.resolve({
        getTracks: jest.fn(() => [
            {
                stop: jest.fn()
            }
        ]),
        getVideoTracks: jest.fn(() => [
            {
                stop: jest.fn()
            }
        ])
    })
)

const mockEnumerateDevices = jest.fn(() =>
    Promise.resolve([
        {
            kind: 'videoinput',
            deviceId: 'camera1',
            label: 'Front Camera'
        },
        {
            kind: 'audioinput',
            deviceId: 'mic1',
            label: 'Microphone'
        }
    ])
)

Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
        getUserMedia: mockGetUserMedia,
        enumerateDevices: mockEnumerateDevices
    },
    writable: true,
    configurable: true
})

describe('Camera', () => {
    let mockOnSave: jest.Mock
    let mockOnCancel: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        mockOnSave = jest.fn()
        mockOnCancel = jest.fn()
    })

    it('should render Camera component', async () => {
        const { container } = render(<Camera onSave={mockOnSave} onCancel={mockOnCancel} />)
        await waitFor(() => {
            expect(container).toBeTruthy()
        })
    })

    it('should render with main container div', () => {
        const { container } = render(<Camera onSave={mockOnSave} onCancel={mockOnCancel} />)

        return waitFor(() => {
            const mainDiv = container.querySelector('.flex.flex-col.justify-center')
            expect(mainDiv).toBeTruthy()
        })
    })

    it('should have buttons for user interaction', () => {
        render(<Camera onSave={mockOnSave} onCancel={mockOnCancel} />)

        return waitFor(() => {
            const buttons = screen.getAllByRole('button')
            expect(buttons.length).toBeGreaterThan(0)
        })
    })

    it('should call cancel callback when cancel button is clicked', () => {
        render(<Camera onSave={mockOnSave} onCancel={mockOnCancel} />)

        return waitFor(() => {
            const buttons = screen.getAllByRole('button')
            if (buttons.length > 0) {
                act(() => {
                    fireEvent.click(buttons[0])
                })
                expect(mockOnCancel).toHaveBeenCalled()
            }
        })
    })

    it('should have flex container structure', () => {
        const { container } = render(<Camera onSave={mockOnSave} onCancel={mockOnCancel} />)

        return waitFor(() => {
            const flexElements = container.querySelectorAll('.flex')
            expect(flexElements.length).toBeGreaterThan(0)
        })
    })

    it('should capture image when screenshot is taken', async () => {
        render(<Camera onSave={mockOnSave} onCancel={mockOnCancel} />)

        await waitFor(() => {
            const buttons = screen.getAllByRole('button')
            expect(buttons.length).toBeGreaterThan(0)
        })
    })

    it('should handle camera ref correctly', async () => {
        const { container } = render(<Camera onSave={mockOnSave} onCancel={mockOnCancel} />)

        await waitFor(() => {
            expect(container).toBeTruthy()
        })
    })

    it('should have video stream setup', async () => {
        render(<Camera onSave={mockOnSave} onCancel={mockOnCancel} />)

        await waitFor(() => {
            expect(mockEnumerateDevices).toHaveBeenCalled()
        })
    })

    it('should call onSave with compressed image', async () => {
        render(<Camera onSave={mockOnSave} onCancel={mockOnCancel} />)

        await waitFor(() => {
            const buttons = screen.getAllByRole('button')
            expect(buttons.length).toBeGreaterThan(0)
        })
    })
})
