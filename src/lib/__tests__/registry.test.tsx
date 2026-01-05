import React from 'react'
import { render } from '@testing-library/react'

const mockedUseServerInsertedHTML = jest.fn()

jest.mock('styled-components', () => {
    const clearTag = jest.fn()
    const getStyleElement = jest.fn(() => <style data-testid="styled-components" />)
    const serverStyleSheet = jest.fn(() => ({
        getStyleElement,
        instance: { clearTag }
    }))

    const StyleSheetManager = ({ children }: { children: React.ReactNode }): React.ReactNode => (
        <div data-testid="style-manager">{children}</div>
    )

    return {
        __esModule: true,
        ServerStyleSheet: serverStyleSheet,
        StyleSheetManager,
        __mock: {
            clearTag,
            getStyleElement,
            serverStyleSheet
        }
    }
})

jest.mock('next/navigation', () => ({
    useServerInsertedHTML: (callback: () => React.ReactNode): React.ReactNode => mockedUseServerInsertedHTML(callback)
}))

import StyledComponentsRegistry from '../registry'

type StyledComponentsMock = typeof import('styled-components') & {
    __mock: {
        clearTag: jest.Mock
        getStyleElement: jest.Mock
        serverStyleSheet: jest.Mock
    }
}

const styledComponentsMock = jest.requireMock('styled-components') as StyledComponentsMock

describe('StyledComponentsRegistry', () => {
    let consoleErrorSpy: jest.SpyInstance<void, Parameters<typeof console.error>>

    beforeEach(() => {
        jest.clearAllMocks()
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    })

    afterEach(() => {
        consoleErrorSpy.mockRestore()
    })

    test('registers server inserted HTML callback and returns style manager with children', () => {
        const childContent = <span data-testid="child">Hello</span>
        const rendered = render(<StyledComponentsRegistry>{childContent}</StyledComponentsRegistry>)

        expect(mockedUseServerInsertedHTML).toHaveBeenCalledTimes(1)

        const callback = mockedUseServerInsertedHTML.mock.calls[0][0] as () => React.JSX.Element
        const styles = callback()
        const renderedStyles = React.Children.toArray(styles.props.children)

        expect(styledComponentsMock.__mock.getStyleElement).toHaveBeenCalledTimes(1)
        expect(styledComponentsMock.__mock.clearTag).toHaveBeenCalledTimes(1)
        expect(renderedStyles).toHaveLength(1)
        const styleElement = renderedStyles[0] as React.JSX.Element
        expect(styleElement.props['data-testid']).toBe('styled-components')
        const styleManager = rendered.getByTestId('style-manager')
        const childNode = rendered.getByTestId('child')
        expect(styleManager.contains(childNode)).toBe(true)
        expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('uses memoized ServerStyleSheet instance across renders', () => {
        const { rerender } = render(
            <StyledComponentsRegistry>
                <span data-testid="initial">Initial</span>
            </StyledComponentsRegistry>
        )

        rerender(
            <StyledComponentsRegistry>
                <span data-testid="updated">Updated</span>
            </StyledComponentsRegistry>
        )

        expect(mockedUseServerInsertedHTML).toHaveBeenCalledTimes(2)
        const firstCallback = mockedUseServerInsertedHTML.mock.calls[0][0]
        const secondCallback = mockedUseServerInsertedHTML.mock.calls[1][0]
        firstCallback()
        secondCallback()

        expect(styledComponentsMock.__mock.serverStyleSheet).toHaveBeenCalledTimes(1)
        expect(styledComponentsMock.__mock.getStyleElement).toHaveBeenCalledTimes(2)
        expect(styledComponentsMock.__mock.clearTag).toHaveBeenCalledTimes(2)
    })
})
