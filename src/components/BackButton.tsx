'use client'
import { useRouter } from 'next/navigation'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import styled from 'styled-components'

interface BackButtonProps {
    classNameContainer?: string
    classNameIcon?: string
}
export const BackButton = ({ classNameContainer, classNameIcon }: BackButtonProps): React.ReactNode => {
    const router = useRouter()

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            router.back()
        }
    }

    return (
        <BackButtonContainer
            className={classNameContainer}
            onClick={() => router.back()}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Voltar"
        >
            <BackIcon className={classNameIcon} />
            Voltar
        </BackButtonContainer>
    )
}

const BackButtonContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`

const BackIcon = styled(IoArrowBackCircleOutline)`
    margin-right: 8px;
`
