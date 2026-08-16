'use client'
import Link from 'next/link'
import styled from 'styled-components'

export default function Dashboard(): React.ReactNode {
    return (
        <PageContainer>
            <NavigationContainer>
                <NavigationLink href={'/pages/dashboard/books'}>Livros</NavigationLink>
                <NavigationLink href={'/pages/dashboard/users'}>Usuários</NavigationLink>

                <NavigationLink href={'/pages/dashboard/lends'}>Empréstimos</NavigationLink>
            </NavigationContainer>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    width: 100%;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
`

const NavigationContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
`

const NavigationLink = styled(Link)`
    padding: 8px 16px;
    background-color: var(--color-primary);
    color: var(--color-white);
    width: 320px;
    text-align: center;
    margin-top: 32px;
    font-weight: 600;
    text-transform: uppercase;
`
