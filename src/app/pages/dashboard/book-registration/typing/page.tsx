'use client'
import { BackButton } from '@/components/BackButton'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

export default function Typing(): React.ReactNode {
    const [inputValue, setInputValue] = useState('')

    return (
        <PageContainer>
            <BackButtonWrapper>
                <BackButton />
            </BackButtonWrapper>
            <h2>Digite o código ISBN</h2>
            <IsbnInput
                type="number"
                value={inputValue}
                placeholder="123.45.678.912-3"
                onChange={e => setInputValue(e.target.value)}
            />
            <ActionsRow>
                <CancelLink href={`/pages/dashboard/book-registration`}>Cancelar</CancelLink>

                {inputValue ? (
                    <SearchLink href={`/pages/dashboard/book-registration/${inputValue}`}>Pesquisar</SearchLink>
                ) : (
                    <DisabledSearchButton disabled>Pesquisar</DisabledSearchButton>
                )}
            </ActionsRow>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32px;
    width: 100%;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
`

const BackButtonWrapper = styled.div`
    margin-bottom: 32px;
`

const IsbnInput = styled.input`
    border: 2px solid #9ca3af;
    border-radius: 6px;
    padding: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
    width: 100%;
`

const ActionsRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const CancelLink = styled(Link)`
    padding: 16px 32px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    color: var(--color-white);
    font-weight: 600;
`

const SearchLink = styled(Link)`
    padding: 16px 32px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    color: var(--color-white);
    font-weight: 600;
    border: none;
`

const DisabledSearchButton = styled.button`
    padding: 16px 32px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    color: var(--color-white);
    font-weight: 600;
    opacity: 0.45;
`
