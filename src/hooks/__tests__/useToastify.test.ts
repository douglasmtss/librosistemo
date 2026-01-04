import { renderHook, act } from '@testing-library/react'
import { useToastify } from '@/hooks/useToastify'
import { toast } from 'react-toastify'

jest.mock('react-toastify')

describe('useToastify', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should return an object with toast function', () => {
        const { result } = renderHook(() => useToastify())

        expect(result.current).toBeDefined()
        expect(result.current).toHaveProperty('toast')
        expect(typeof result.current.toast).toBe('function')
    })

    test('should call toast with correct parameters for success type', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Success message', 'success')
        })

        expect(toast).toHaveBeenCalledWith('Success message', {
            type: 'success',
            position: 'bottom-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })
    })

    test('should call toast with correct parameters for error type', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Error message', 'error')
        })

        expect(toast).toHaveBeenCalledWith('Error message', {
            type: 'error',
            position: 'bottom-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })
    })

    test('should call toast with correct parameters for warning type', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Warning message', 'warning')
        })

        expect(toast).toHaveBeenCalledWith('Warning message', {
            type: 'warning',
            position: 'bottom-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })
    })

    test('should call toast with correct parameters for info type', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Info message', 'info')
        })

        expect(toast).toHaveBeenCalledWith('Info message', {
            type: 'info',
            position: 'bottom-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })
    })

    test('should have correct position set to bottom-right', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Test message', 'success')
        })

        const callArgs = (toast as unknown as jest.Mock).mock.calls[0][1]
        expect(callArgs.position).toBe('bottom-right')
    })

    test('should have autoClose set to 4000ms', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Test message', 'success')
        })

        const callArgs = (toast as unknown as jest.Mock).mock.calls[0][1]
        expect(callArgs.autoClose).toBe(4000)
    })

    test('should have hideProgressBar set to false', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Test message', 'success')
        })

        const callArgs = (toast as unknown as jest.Mock).mock.calls[0][1]
        expect(callArgs.hideProgressBar).toBe(false)
    })

    test('should have closeOnClick set to true', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Test message', 'success')
        })

        const callArgs = (toast as unknown as jest.Mock).mock.calls[0][1]
        expect(callArgs.closeOnClick).toBe(true)
    })

    test('should have pauseOnHover set to true', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Test message', 'success')
        })

        const callArgs = (toast as unknown as jest.Mock).mock.calls[0][1]
        expect(callArgs.pauseOnHover).toBe(true)
    })

    test('should have draggable set to true', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('Test message', 'success')
        })

        const callArgs = (toast as unknown as jest.Mock).mock.calls[0][1]
        expect(callArgs.draggable).toBe(true)
    })

    test('should accept different message strings', () => {
        const { result } = renderHook(() => useToastify())

        const messages = ['Message 1', 'Message 2', 'Message 3']

        messages.forEach(message => {
            act(() => {
                result.current.toast(message, 'success')
            })
        })

        expect(toast).toHaveBeenCalledTimes(3)
        expect((toast as unknown as jest.Mock).mock.calls[0][0]).toBe('Message 1')
        expect((toast as unknown as jest.Mock).mock.calls[1][0]).toBe('Message 2')
        expect((toast as unknown as jest.Mock).mock.calls[2][0]).toBe('Message 3')
    })

    test('should call toast multiple times independently', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('First message', 'success')
        })

        act(() => {
            result.current.toast('Second message', 'error')
        })

        act(() => {
            result.current.toast('Third message', 'warning')
        })

        expect(toast).toHaveBeenCalledTimes(3)
        expect((toast as unknown as jest.Mock).mock.calls[0][0]).toBe('First message')
        expect((toast as unknown as jest.Mock).mock.calls[1][0]).toBe('Second message')
        expect((toast as unknown as jest.Mock).mock.calls[2][0]).toBe('Third message')
    })

    test('should handle empty message string', () => {
        const { result } = renderHook(() => useToastify())

        act(() => {
            result.current.toast('', 'success')
        })

        expect(toast).toHaveBeenCalledWith('', expect.any(Object))
    })

    test('should always return the same hook interface', () => {
        const { result: result1 } = renderHook(() => useToastify())
        const { result: result2 } = renderHook(() => useToastify())

        expect(Object.keys(result1.current)).toEqual(Object.keys(result2.current))
    })
})
