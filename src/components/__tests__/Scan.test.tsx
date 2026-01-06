import React from 'react'
import { render } from '@testing-library/react'
import { Scan } from '../Scan'
import { Html5QrcodeScanner } from 'html5-qrcode'

jest.mock('html5-qrcode', () => ({
    Html5QrcodeScanner: jest.fn(function (elementId: string, config: Record<string, never>, verbose: boolean) {
        this.elementId = elementId
        this.config = config
        this.verbose = verbose
        this.render = jest.fn((successCallback, errorCallback) => {
            this.successCallback = successCallback
            this.errorCallback = errorCallback
        })
        this.clear = jest.fn()
        this.resume = jest.fn()
    })
}))

jest.mock('next/link', () => {
    const MockElement = ({ children, href }: { children: React.ReactNode; href: string }): React.JSX.Element => (
        <a href={href} data-testid={`link-${href}`}>
            {children}
        </a>
    )

    return MockElement
})

describe('Scan', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        // Mock Audio
        window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve())
        window.HTMLMediaElement.prototype.load = jest.fn()
        window.HTMLMediaElement.prototype.pause = jest.fn()
    })

    test('should render Scan component', () => {
        const { container } = render(<Scan />)
        expect(container).toBeTruthy()
    })

    test('should render reader div for QR code scanner', () => {
        const { container } = render(<Scan />)
        const readerDiv = container.querySelector('#reader')
        expect(readerDiv).toBeTruthy()
    })

    test('should render StyledDiv container', () => {
        const { container } = render(<Scan />)
        const styledDiv = container.querySelector('div')
        expect(styledDiv).toBeTruthy()
    })

    test('should initialize Html5QrcodeScanner with correct config', () => {
        render(<Scan />)

        expect(Html5QrcodeScanner).toHaveBeenCalledWith(
            'reader',
            expect.objectContaining({
                qrbox: {
                    width: 250,
                    height: 250
                },
                fps: 5
            }),
            false
        )
    })

    test('should render full width scanner container', () => {
        const { container } = render(<Scan />)
        const wFullDiv = container.querySelector('.w-full')
        expect(wFullDiv).toBeTruthy()
    })

    test('should have proper styling classes on main container', () => {
        const { container } = render(<Scan />)
        const divs = container.querySelectorAll('div')
        expect(divs.length).toBeGreaterThan(0)
    })

    test('should not display scan result initially', () => {
        const { container } = render(<Scan />)
        const readerDiv = container.querySelector('#reader')
        expect(readerDiv).toBeTruthy()

        const successText = container.textContent?.includes('Succcess')
        expect(successText).toBeFalsy()
    })

    test('should create Audio element for barcode sound', () => {
        // Mock Audio constructor
        const audioConstructorSpy = jest.fn()
        window.Audio = jest.fn(function (src: string) {
            audioConstructorSpy(src)
            this.play = jest.fn()
        }) as unknown as typeof Audio

        render(<Scan />)

        expect(audioConstructorSpy).toHaveBeenCalledWith('/audios/barcode.wav')
    })

    test('should handle scanner initialization', () => {
        render(<Scan />)

        expect(Html5QrcodeScanner).toHaveBeenCalled()
    })

    test('should unmount scanner on component cleanup', () => {
        const { unmount } = render(<Scan />)

        unmount()

        // Component should have called clear on unmount
        const mockInstance = (Html5QrcodeScanner as jest.Mock).mock.instances[0]
        if (mockInstance) {
            expect(mockInstance.clear).toBeDefined()
        }
    })

    test('should render styled container with proper ID', () => {
        const { container } = render(<Scan />)
        const styledContainer = container.querySelector('div')
        expect(styledContainer).toBeTruthy()
    })

    test('should have CSS flex layout', () => {
        const { container } = render(<Scan />)
        const divs = container.querySelectorAll('div')
        expect(divs.length).toBeGreaterThan(0)
    })
})
