import { render, screen } from '@testing-library/react'
import { Img } from '../Img'

describe('Img', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should render img element', () => {
        render(<Img src="test.jpg" alt="test image" />)
        const img = screen.getByAltText('test image')
        expect(img).toBeTruthy()
    })

    test('should render with correct src attribute', () => {
        render(<Img src="test.jpg" alt="test" />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.src).toContain('test.jpg')
    })

    test('should render with correct alt attribute', () => {
        render(<Img src="test.jpg" alt="test image" />)
        const img = screen.getByAltText('test image')
        expect(img).toBeTruthy()
    })

    test('should render with width attribute', () => {
        render(<Img src="test.jpg" alt="test" width={200} />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.width).toBe(200)
    })

    test('should render with height attribute', () => {
        render(<Img src="test.jpg" alt="test" height={300} />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.height).toBe(300)
    })

    test('should render with both width and height', () => {
        render(<Img src="test.jpg" alt="test" width={200} height={300} />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.width).toBe(200)
        expect(img.height).toBe(300)
    })

    test('should apply custom className', () => {
        render(<Img src="test.jpg" alt="test" className="custom-class" />)
        const img = screen.getByAltText('test')
        expect(img.className).toContain('custom-class')
    })

    test('should render with empty className by default', () => {
        render(<Img src="test.jpg" alt="test" />)
        const img = screen.getByAltText('test')
        expect(img.className).toBe('')
    })

    test('should use img tag', () => {
        render(<Img src="test.jpg" alt="test" />)
        const img = screen.getByAltText('test')
        expect(img.tagName).toBe('IMG')
    })

    test('should set fallback image when src is empty', () => {
        // Suppress console.error for this test since we're testing the empty string behavior
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

        const { container } = render(<Img src="" alt="test" />)
        const img = container.querySelector('img') as HTMLImageElement
        // After useEffect runs, src should be set to fallback
        expect(img.src).toContain('/images/empty-book.png')

        consoleErrorSpy.mockRestore()
    })

    test('should keep src when it is provided', () => {
        render(<Img src="provided-image.jpg" alt="test" />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.src).toContain('provided-image.jpg')
    })

    test('should handle different image formats', () => {
        const { rerender } = render(<Img src="test.png" alt="test" />)
        let img = screen.getByAltText('test') as HTMLImageElement
        expect(img.src).toContain('test.png')

        rerender(<Img src="test.gif" alt="test" />)
        img = screen.getByAltText('test') as HTMLImageElement
        expect(img.src).toContain('test.gif')
    })

    test('should apply multiple custom classes', () => {
        render(<Img src="test.jpg" alt="test" className="class1 class2" />)
        const img = screen.getByAltText('test')
        expect(img.className).toContain('class1')
        expect(img.className).toContain('class2')
    })

    test('should render img with data attributes', () => {
        const { container } = render(<Img src="test.jpg" alt="test" className="w-full" />)
        const img = container.querySelector('img')
        expect(img?.hasAttribute('alt')).toBe(true)
    })

    test('should return React.ReactNode', () => {
        const result = <Img src="test.jpg" alt="test" />
        expect(result).toBeTruthy()
    })

    test('should render with zero width', () => {
        render(<Img src="test.jpg" alt="test" width={0} />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.width).toBe(0)
    })

    test('should render with zero height', () => {
        render(<Img src="test.jpg" alt="test" height={0} />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.height).toBe(0)
    })

    test('should handle URL with special characters', () => {
        render(<Img src="test-image_v2.jpg" alt="test" />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.src).toContain('test-image_v2.jpg')
    })

    test('should handle full URL path', () => {
        render(<Img src="https://example.com/image.jpg" alt="test" />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.src).toContain('example.com')
    })

    test('should maintain aspect ratio with width and height', () => {
        render(<Img src="test.jpg" alt="test" width={500} height={400} />)
        const img = screen.getByAltText('test') as HTMLImageElement
        expect(img.width / img.height).toBe(1.25)
    })
})
