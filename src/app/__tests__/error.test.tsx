import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import GlobalError from '../error'

describe('GlobalError', (): void => {
    test('exibe recuperação e chama reset', (): void => {
        const reset = jest.fn()
        render(<GlobalError error={new Error('falha')} reset={reset} />)

        expect(screen.getByRole('heading', { name: 'Algo deu errado' })).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

        expect(reset).toHaveBeenCalledTimes(1)
    })
})
