'use client'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import styled, { keyframes } from 'styled-components'

export const Loading = (): React.ReactNode => {
    return (
        <LoadingContainer>
            <LoadingFrame>
                <SpinnerIcon />
            </LoadingFrame>
        </LoadingContainer>
    )
}

const LoadingContainer = styled.div`
    padding: 32px;
`

const LoadingFrame = styled.div`
    min-width: 250px;
    min-height: 250px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: var(--radius-md);
    border: 4px solid var(--color-gray-200);
`

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const SpinnerIcon = styled(AiOutlineLoading3Quarters)`
    animation: ${spin} 1s linear infinite;
    transition-duration: 100ms;
    color: var(--color-primary);
    font-size: 128px;
    line-height: 1;
    opacity: 0.6;
`
