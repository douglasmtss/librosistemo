import { cn } from '@/lib/tailwindMerge'

interface BookStatusProps {
    label: Book['status'] | 'default'
    className?: string
}
export const BookStatus = ({ label = 'default', className = '' }: BookStatusProps): JSX.Element => {
    const statusLabel = {
        available: 'disponível',
        borrowed: 'emprestado',
        default: ''
    }

    const components = {
        available: (
            <span className={cn('font-semibold border-2 rounded-md p-2 text-green-500 border-green-500', className)}>
                {statusLabel[label]}
            </span>
        ),
        borrowed: (
            <span className={cn('font-semibold border-2 rounded-md p-2 text-red-500 border-red-500', className)}>
                {statusLabel[label]}
            </span>
        ),
        default: <></>
    }

    const renderComponent = components[label]

    return <>{renderComponent}</>
}
