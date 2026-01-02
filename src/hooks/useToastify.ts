import { ToastOptions, toast } from 'react-toastify'

export function useToastify(): { toast: (message: string, type: ToastOptions['type']) => void } {
    const toastFn = (message: string, type: ToastOptions['type']): void => {
        toast(message, {
            type,
            position: 'bottom-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })
    }

    return {
        toast: toastFn
    }
}
