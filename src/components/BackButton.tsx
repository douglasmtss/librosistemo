import { cn } from '@/lib/tailwindMerge'
import { useRouter } from 'next/navigation'
import { IoArrowBackCircleOutline } from 'react-icons/io5'

interface BackButtonProps {
    classNameContainer?: string
    classNameIcon?: string
}
export const BackButton = ({ classNameContainer, classNameIcon }: BackButtonProps): React.ReactNode => {
    const router = useRouter()

    return (
        <div className={cn('flex items-center cursor-pointer', classNameContainer)} onClick={() => router.back()}>
            <IoArrowBackCircleOutline className={cn('mr-2', classNameIcon)} />
            Voltar
        </div>
    )
}
