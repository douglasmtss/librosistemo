'use client'
import { BackButton } from '@/components/BackButton'
import Link from 'next/link'
import styled from 'styled-components'

export default function BookRegistration(): React.ReactNode {
    return (
        <PageContainer>
            <BackButton />
            <MenuContainer>
                <MenuLink href={'/pages/dashboard/book-registration/manual'}>Cadastro manual</MenuLink>
                <MenuLink href={'/pages/dashboard/book-registration/typing'}>Digitar código ISBN</MenuLink>
                <MenuLink href={'/pages/dashboard/book-registration/scanner'}>Escanear código ISBN</MenuLink>
                <MenuLink href={'/pages/dashboard/book-registration/list'}>Carregar lista de códigos ISBN</MenuLink>
            </MenuContainer>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: max-content;
`

const MenuLink = styled(Link)`
    padding: 8px 16px;
    background-color: var(--color-primary);
    color: var(--color-white);
    border-radius: 6px;
    text-align: center;
    width: 100%;
    margin-top: 32px;
`
