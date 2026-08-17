'use client'
import { BackButton } from '@/components/BackButton'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'

export default function List(): React.ReactNode {
    const router = useRouter()
    const [inputValue, setInputValue] = useState('')
    const [codes, setCodes] = useState<string[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const codes = e.target.value
            .split(/\r?\n/)
            .map(code => code.trim())
            .filter(Boolean)

        setCodes(codes)
        setInputValue(e.target.value)
    }

    const handleSearch = (): void => {
        router.push(`/pages/dashboard/book-registration/list_isbn?list_isbn=${JSON.stringify(codes)}`)
    }

    return (
        <PageContainer>
            <BackButtonWrapper>
                <BackButton />
            </BackButtonWrapper>
            <h2>Digite ou cole uma lista de códigos ISBN</h2>
            <h3>Deve haver apenas um código por linha</h3>
            <IsbnTextArea
                value={inputValue}
                placeholder={`9788570460097\n9788570460097\n9788570460097`}
                onChange={handleChange}
            />
            <ActionsRow>
                <CancelLink href={`/pages/dashboard/book-registration`}>Cancelar</CancelLink>

                {inputValue ? (
                    <SearchButton onClick={handleSearch}>Pesquisar</SearchButton>
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

const IsbnTextArea = styled.textarea`
    border: 2px solid #9ca3af;
    border-radius: 6px;
    padding: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
    width: 100%;
    height: 192px;
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

const SearchButton = styled.button`
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
