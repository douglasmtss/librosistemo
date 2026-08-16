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

    return (
        <BackButtonContainer className={classNameContainer} onClick={() => router.back()}>
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
