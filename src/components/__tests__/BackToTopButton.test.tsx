import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { BackToTopButton } from '../BackToTopButton'

// Mock react-icons
jest.mock('react-icons/ai', () => ({
    AiOutlineArrowUp: ({ className }: { className: string }): React.JSX.Element => (
        <span data-testid="arrow-up-icon" className={className} />
    )
}))

describe('BackToTopButton', () => {
    let scrollEventListeners: ((event: Event) => void)[] = []

    beforeEach(() => {
        jest.clearAllMocks()
        scrollEventListeners = []

        // Reset scrollY
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 0
        })

        // Mock document.addEventListener to capture scroll listener
        const originalAddEventListener = document.addEventListener
        document.addEventListener = jest.fn((event: string, handler: (event: Event) => void) => {
            if (event === 'scroll') {
                scrollEventListeners.push(handler)
            }

            return originalAddEventListener.call(document, event, handler)
        })

        // Mock document.removeEventListener
        document.removeEventListener = jest.fn((event: string, handler: (event: Event) => void) => {
            if (event === 'scroll') {
                scrollEventListeners = scrollEventListeners.filter(l => l !== handler)
            }
        })

        // Mock window.scrollTo
        window.scrollTo = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
        scrollEventListeners = []
    })

test('should register scroll event listener on mount', () => {
        render(<BackToTopButton />)

        expect(document.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

test('should remove scroll event listener on unmount', () => {
        const { unmount } = render(<BackToTopButton />)

        unmount()

        expect(document.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

test('should not show button when scrollY is 0', () => {
        render(<BackToTopButton />)

        const button = screen.queryByRole('button')
        expect(button).toBeFalsy()
    })

test('should show button when scrollY is greater than 100', async () => {
        render(<BackToTopButton />)

        // Manually set scrollY and trigger the scroll handler
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 150
        })

        // Call the scroll event listener
        if (scrollEventListeners.length > 0) {
            act(() => {
                scrollEventListeners[0](new Event('scroll'))
            })
        }

        await waitFor(() => {
            const button = screen.queryByRole('button')
            expect(button).toBeTruthy()
        })
    })

test('should scroll to top when button is clicked', async () => {
        render(<BackToTopButton />)

        // Set scrollY > 100 to show button
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 150
        })

        // Trigger scroll listener
        if (scrollEventListeners.length > 0) {
            act(() => {
                scrollEventListeners[0](new Event('scroll'))
            })
        }

        await waitFor(() => {
            const button = screen.getByRole('button')
            expect(button).toBeTruthy()
        })

        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })

test('should render arrow up icon when button is visible', async () => {
        render(<BackToTopButton />)

        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 150
        })

        // Trigger scroll listener
        if (scrollEventListeners.length > 0) {
            act(() => {
                scrollEventListeners[0](new Event('scroll'))
            })
        }

        await waitFor(() => {
            expect(screen.getByTestId('arrow-up-icon')).toBeTruthy()
        })
    })

test('should have correct CSS classes on button', async () => {
        render(<BackToTopButton />)

        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 150
        })

        // Trigger scroll listener
        if (scrollEventListeners.length > 0) {
            act(() => {
                scrollEventListeners[0](new Event('scroll'))
            })
        }

        await waitFor(() => {
            const button = screen.getByRole('button')
            expect(button.className).toContain('fixed')
            expect(button.className).toContain('bottom-8')
            expect(button.className).toContain('right-8')
            expect(button.className).toContain('bg-green-500')
            expect(button.className).toContain('text-white')
        })
    })

test('should have z-10 index', async () => {
        render(<BackToTopButton />)

        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 150
        })

        // Trigger scroll listener
        if (scrollEventListeners.length > 0) {
            act(() => {
                scrollEventListeners[0](new Event('scroll'))
            })
        }

        await waitFor(() => {
            const button = screen.getByRole('button')
            expect(button.className).toContain('z-10')
        })
    })

test('should handle multiple scroll events', async () => {
        render(<BackToTopButton />)

        // Scroll down
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 150
        })

        if (scrollEventListeners.length > 0) {
            act(() => {
                scrollEventListeners[0](new Event('scroll'))
            })
        }

        await waitFor(() => {
            expect(screen.getByRole('button')).toBeTruthy()
        })

        // Scroll up
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 50
        })

        if (scrollEventListeners.length > 0) {
            act(() => {
                scrollEventListeners[0](new Event('scroll'))
            })
        }

        await waitFor(() => {
            const button = screen.queryByRole('button')
            expect(button).toBeFalsy()
        })
    })

test('should have correct icon class', async () => {
        render(<BackToTopButton />)

        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 150
        })

        if (scrollEventListeners.length > 0) {
            act(() => {
                scrollEventListeners[0](new Event('scroll'))
            })
        }

        await waitFor(() => {
            const icon = screen.getByTestId('arrow-up-icon')
            expect(icon.className).toContain('text-white')
            expect(icon.className).toContain('text-2xl')
        })
    })

test('should not show button when scrolling below threshold', async () => {
        render(<BackToTopButton />)

        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 50
        })

        if (scrollEventListeners.length > 0) {
            scrollEventListeners[0](new Event('scroll'))
        }

        // Wait a bit and verify button is not shown
        await new Promise(resolve => setTimeout(resolve, 100))

        const button = screen.queryByRole('button')
        expect(button).toBeFalsy()
    })
})
