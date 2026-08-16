'use client'
import { BackButton } from '@/components/BackButton'
import { Scan } from '@/components/Scan'
import styled from 'styled-components'

export default function Scanner(): React.ReactNode {
    return (
        <PageContainer>
            <BackButtonWrapper>
                <BackButton />
            </BackButtonWrapper>
            <PageTitle>Escanear código ISBN</PageTitle>
            <Scan />
        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const BackButtonWrapper = styled.div`
    margin-bottom: 32px;
`

const PageTitle = styled.h1`
    font-size: 24px;
    line-height: 32px;
`
