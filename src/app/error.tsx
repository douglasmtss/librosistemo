'use client'

import { useEffect } from 'react'

export default function GlobalError({
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}): React.ReactNode {
    useEffect(() => {
        // O erro continua disponível no console para diagnóstico local/observabilidade.
        console.error('Erro inesperado na aplicação')
    }, [])

    return (
        <main>
            <h1>Algo deu errado</h1>
            <p>Não foi possível carregar esta página.</p>
            <button type="button" onClick={reset}>
                Tentar novamente
            </button>
        </main>
    )
}
