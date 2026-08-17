'use client'
import { BackButton } from '@/components/BackButton'
import { Empty } from '@/components/Empty'
import { Loading } from '@/components/Loading'
import { PaginatedUserItems } from '@/components/PaginatedUserItems'
import { api } from '@/services/api'
import Link from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'

export default function Users(): React.ReactNode {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
    const [loading, setLoading] = useState(true)

    const handleDelete = async (id: string): Promise<void> => {
        await api.sheet.users.delete(id).then(() => {
            const filtered = users.filter(user => user.id !== id)
            setUsers(filtered)
            setFilteredUsers(filtered)
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value

        if (value) {
            setFilteredUsers(users.filter(user => user.first_name.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredUsers(users)
        }
    }

    useEffect(() => {
        api.sheet.users
            .get()
            .then(data => {
                setUsers(data)
                setFilteredUsers(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <PageContainer>
            <PositionedBackButton />
            <RegisterLinkRow>
                <RegisterLink href={'/pages/dashboard/users/user-registration'}>Cadastrar usuário</RegisterLink>
            </RegisterLinkRow>
            {loading ? (
                <Loading />
            ) : !filteredUsers?.length ? (
                <Empty />
            ) : (
                <Content>
                    <SearchRow>
                        <SearchInput
                            type="text"
                            placeholder="Pesquise pelo primeiro nome do usuário"
                            onChange={handleChange}
                        />
                    </SearchRow>
                    <PaginatedUserItems itemsPerPage={10} users={filteredUsers} onDelete={handleDelete} />
                </Content>
            )}
        </PageContainer>
    )
}

const PageContainer = styled.div`
    width: 100%;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
`

const BackButtonWithClassName = ({ className }: { className?: string }): React.ReactNode => (
    <BackButton classNameContainer={className} />
)

const PositionedBackButton = styled(BackButtonWithClassName)`
    margin-left: 16px;
    margin-bottom: 32px;
`

const RegisterLinkRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
`

const RegisterLink = styled(Link)`
    padding: 8px 16px;
    background-color: var(--color-primary);
    color: var(--color-white);
    border-radius: var(--radius-md);
`

const Content = styled.div`
    padding-left: 16px;
    padding-right: 16px;
`

const SearchRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
`

const SearchInput = styled.input`
    border: 2px solid var(--color-gray-300);
    width: 100%;
    height: 40px;
    padding: 8px;
`
