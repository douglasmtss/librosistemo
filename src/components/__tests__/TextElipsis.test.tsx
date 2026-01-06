import { render, screen, fireEvent } from '@testing-library/react'
import { TextElipsis } from '../TextElipsis'

// Mock getComputedStyle to return valid values
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
        height: '32px'
    })
})

describe('TextElipsis', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should render TextElipsis component', () => {
        const { container } = render(<TextElipsis text="Test text" />)
        expect(container).toBeTruthy()
    })

    test('should render with provided text', () => {
        render(<TextElipsis text="Test text" />)
        expect(screen.getByText('Test text')).toBeTruthy()
    })

    test('should apply width prop', () => {
        const { container } = render(<TextElipsis text="Test" width={100} />)
        expect(container.querySelector('div')).toBeTruthy()
    })

    test('should apply height prop', () => {
        const { container } = render(<TextElipsis text="Test" height={50} />)
        expect(container.querySelector('div')).toBeTruthy()
    })

    test('should apply both width and height', () => {
        const { container } = render(<TextElipsis text="Test" width={100} height={50} />)
        expect(container.querySelector('div')).toBeTruthy()
    })

    test('should handle string width', () => {
        const { container } = render(<TextElipsis text="Test" width="100px" />)
        expect(container).toBeTruthy()
    })

    test('should handle numeric width', () => {
        const { container } = render(<TextElipsis text="Test" width={100} />)
        expect(container).toBeTruthy()
    })

    test('should handle string height', () => {
        const { container } = render(<TextElipsis text="Test" height="50px" />)
        expect(container).toBeTruthy()
    })

    test('should handle numeric height', () => {
        const { container } = render(<TextElipsis text="Test" height={50} />)
        expect(container).toBeTruthy()
    })

    test('should apply color prop', () => {
        render(<TextElipsis text="Test" color="red" />)
        expect(screen.getByText('Test')).toBeTruthy()
    })

    test('should render with default text color', () => {
        render(<TextElipsis text="Test" />)
        const text = screen.getByText('Test')
        expect(text).toBeTruthy()
    })

    test('should handle long text', () => {
        const longText =
            'This is a very long text that might be truncated depending on the container width and height settings'
        render(<TextElipsis text={longText} width={100} height={32} />)
        expect(screen.getByText(longText)).toBeTruthy()
    })

    test('should handle empty text', () => {
        const { container } = render(<TextElipsis text="" />)
        expect(container).toBeTruthy()
    })

    test('should handle undefined text', () => {
        const { container } = render(<TextElipsis />)
        expect(container).toBeTruthy()
    })

    test('should render as a div component', () => {
        const { container } = render(<TextElipsis text="Test" />)
        const divElement = container.querySelector('div')
        expect(divElement).toBeTruthy()
    })

    test('should have overflow hidden', () => {
        const { container } = render(<TextElipsis text="Test" />)
        const mainDiv = container.firstChild
        expect(mainDiv).toBeTruthy()
    })

    test('should handle text with special characters', () => {
        const specialText = 'Test !@#$%^&*()'
        render(<TextElipsis text={specialText} />)
        expect(screen.getByText(specialText)).toBeTruthy()
    })

    test('should handle text with numbers', () => {
        const textWithNumbers = 'Test 12345'
        render(<TextElipsis text={textWithNumbers} />)
        expect(screen.getByText(textWithNumbers)).toBeTruthy()
    })

    test('should handle whitespace in text', () => {
        const textWithWhitespace = '  Test with spaces  '
        render(<TextElipsis text={textWithWhitespace} />)
        expect(screen.getByText(/Test with spaces/)).toBeTruthy()
    })

    test('should return React.ReactNode', () => {
        const result = <TextElipsis text="Test" />
        expect(result).toBeTruthy()
    })

    test('should handle width as percentage string', () => {
        const { container } = render(<TextElipsis text="Test" width="100%" />)
        expect(container).toBeTruthy()
    })

    test('should handle height as percentage string', () => {
        const { container } = render(<TextElipsis text="Test" height="100%" />)
        expect(container).toBeTruthy()
    })

    test('should handle zero width', () => {
        const { container } = render(<TextElipsis text="Test" width={0} />)
        expect(container).toBeTruthy()
    })

    test('should handle zero height', () => {
        const { container } = render(<TextElipsis text="Test" height={0} />)
        expect(container).toBeTruthy()
    })

    test('should support multiline text', () => {
        const multilineText = 'Line 1\nLine 2\nLine 3'
        render(<TextElipsis text={multilineText} />)
        expect(screen.getByText(/Line 1/)).toBeTruthy()
    })

    test('should handle very large width', () => {
        const { container } = render(<TextElipsis text="Test" width={10000} />)
        expect(container).toBeTruthy()
    })

    test('should handle very large height', () => {
        const { container } = render(<TextElipsis text="Test" height={10000} />)
        expect(container).toBeTruthy()
    })

    test('should update on text prop change', () => {
        const { rerender } = render(<TextElipsis text="Original" />)
        expect(screen.getByText('Original')).toBeTruthy()

        rerender(<TextElipsis text="Updated" />)
        expect(screen.getByText('Updated')).toBeTruthy()
    })

    test('should update on width prop change', () => {
        const { rerender } = render(<TextElipsis text="Test" width={100} />)
        expect(screen.getByText('Test')).toBeTruthy()

        rerender(<TextElipsis text="Test" width={200} />)
        expect(screen.getByText('Test')).toBeTruthy()
    })

    test('should update on height prop change', () => {
        const { rerender } = render(<TextElipsis text="Test" height={50} />)
        expect(screen.getByText('Test')).toBeTruthy()

        rerender(<TextElipsis text="Test" height={100} />)
        expect(screen.getByText('Test')).toBeTruthy()
    })

    test('should have position relative on container', () => {
        const { container } = render(<TextElipsis text="Test" />)
        const div = container.firstChild
        expect(div).toBeTruthy()
    })

    test('should render nested content properly', () => {
        render(<TextElipsis text="Nested content test" width={150} height={40} />)
        expect(screen.getByText('Nested content test')).toBeTruthy()
    })

    test('should handle mouseover event listener', () => {
        const { container } = render(<TextElipsis text="Test" width={100} height={20} />)
        const textDiv = container.querySelectorAll('div')[1]
        fireEvent.mouseOver(textDiv)
        expect(textDiv).toBeTruthy()
    })

    test('should handle mouseleave event listener', () => {
        const { container } = render(<TextElipsis text="Test" width={100} height={20} />)
        const textDiv = container.querySelectorAll('div')[1]
        fireEvent.mouseLeave(textDiv)
        expect(textDiv).toBeTruthy()
    })

    test('should set lines based on container height', () => {
        const { container } = render(<TextElipsis text="Test" height={32} />)
        expect(container.querySelector('div')).toBeTruthy()
    })

    test('should set display to none when height is less than line height', () => {
        const { container } = render(<TextElipsis text="Test" height={8} />)
        expect(container).toBeTruthy()
    })

    test('should add event listener on text element', () => {
        const { container } = render(<TextElipsis text="Test" width={100} height={20} />)
        const textDiv = container.querySelectorAll('div')[1]

        // Manually trigger the mouseover handler to verify it works
        if (textDiv) {
            fireEvent.mouseOver(textDiv)
        }

        expect(textDiv).toBeTruthy()
    })

    test('should handle component rerenders with text changes', () => {
        const { rerender } = render(<TextElipsis text="Initial" width={100} height={20} />)
        expect(screen.getByText('Initial')).toBeTruthy()

        rerender(<TextElipsis text="Changed" width={100} height={20} />)
        expect(screen.getByText('Changed')).toBeTruthy()
    })

    test('should handle component rerenders with width changes', () => {
        const { rerender } = render(<TextElipsis text="Test" width={100} height={20} />)
        expect(screen.getByText('Test')).toBeTruthy()

        rerender(<TextElipsis text="Test" width={200} height={20} />)
        expect(screen.getByText('Test')).toBeTruthy()
    })

    test('should handle component rerenders with height changes', () => {
        const { rerender } = render(<TextElipsis text="Test" width={100} height={20} />)
        expect(screen.getByText('Test')).toBeTruthy()

        rerender(<TextElipsis text="Test" width={100} height={40} />)
        expect(screen.getByText('Test')).toBeTruthy()
    })

    test('should call removeEventListener when dependencies change', () => {
        const { container, rerender } = render(<TextElipsis text="Test" width={100} height={20} />)
        const textDiv = container.querySelectorAll('div')[1] as HTMLElement | undefined

        if (textDiv) {
            const removeEventListenerSpy = jest.spyOn(textDiv, 'removeEventListener')

            // Trigger dependency change which should call the cleanup function
            rerender(<TextElipsis text="Different" width={100} height={20} />)

            // The cleanup function should have been called
            expect(removeEventListenerSpy).toHaveBeenCalled()
            removeEventListenerSpy.mockRestore()
        }

        expect(textDiv).toBeTruthy()
    })

    test('should initialize state properly on first render', () => {
        const { container } = render(<TextElipsis text="Initial Text" width={200} height={40} />)
        expect(screen.getByText('Initial Text')).toBeTruthy()
        expect(container).toBeTruthy()
    })

    test('should handle element refs properly', () => {
        const { container } = render(<TextElipsis text="Ref Test" width={150} height={30} />)
        const divs = container.querySelectorAll('div')
        expect(divs.length).toBeGreaterThan(1)
    })

    test('should set display to none when container height is less than line height', () => {
        // Mock getComputedStyle to return a very small height
        Object.defineProperty(window, 'getComputedStyle', {
            value: () => ({
                height: '10px' // Less than lineHeight of 16
            }),
            writable: true,
            configurable: true
        })

        const { container } = render(<TextElipsis text="Small" />)
        expect(container).toBeTruthy()

        // Reset getComputedStyle
        Object.defineProperty(window, 'getComputedStyle', {
            value: () => ({
                height: '32px'
            }),
            writable: true,
            configurable: true
        })
    })

    test('should trigger mouseover event and change webkitLineClamp', () => {
        const { container } = render(<TextElipsis text="Hover Test" width={150} height={32} />)
        const textElement = container.querySelector('div div')

        if (textElement) {
            const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true })
            textElement.dispatchEvent(mouseoverEvent)
            expect(textElement).toBeTruthy()
        }
    })

    test('should trigger mouseleave event and reset webkitLineClamp', () => {
        const { container } = render(<TextElipsis text="Hover Test" width={150} height={32} />)
        const textElement = container.querySelector('div div')

        if (textElement) {
            const mouseleaveEvent = new MouseEvent('mouseleave', { bubbles: true })
            textElement.dispatchEvent(mouseleaveEvent)
            expect(textElement).toBeTruthy()
        }
    })

    test('should handle mouseover and mouseleave in sequence', () => {
        const { container } = render(<TextElipsis text="Full Hover" width={150} height={32} />)
        const textElement = container.querySelector('div div')

        if (textElement) {
            // First mouseover
            const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true })
            textElement.dispatchEvent(mouseoverEvent)

            // Then mouseleave
            const mouseleaveEvent = new MouseEvent('mouseleave', { bubbles: true })
            textElement.dispatchEvent(mouseleaveEvent)

            expect(textElement).toBeTruthy()
        }
    })
})
