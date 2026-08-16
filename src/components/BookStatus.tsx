'use client'
import styled from 'styled-components'

interface BookStatusProps {
    label: Book['status'] | 'default'
    className?: string
}
export const BookStatus = ({ label = 'default', className = '' }: BookStatusProps): React.ReactNode => {
    const statusLabel = {
        available: 'disponível',
        borrowed: 'emprestado',
        default: ''
    }

    const components = {
        available: (
            <StatusBadge $color="var(--color-success)" className={className}>
                {statusLabel[label]}
            </StatusBadge>
        ),
        borrowed: (
            <StatusBadge $color="var(--color-danger)" className={className}>
                {statusLabel[label]}
            </StatusBadge>
        ),
        default: <></>
    }

    const renderComponent = components[label]

    return <>{renderComponent}</>
}

const StatusBadge = styled.span<{ $color: string }>`
    font-weight: 600;
    border: 2px solid ${({ $color }): string => $color};
    border-radius: var(--radius-md);
    padding: 8px;
    color: ${({ $color }): string => $color};
`
