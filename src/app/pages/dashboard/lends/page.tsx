'use client'
import { BackButton } from '@/components/BackButton'
import { Empty } from '@/components/Empty'
import { Loading } from '@/components/Loading'
import { PaginatedLendsItems } from '@/components/PaginatedLendsItems'
import { useEntities } from '@/hooks/useEntities'
import { api } from '@/services/api'
import Link from 'next/link'
import { ChangeEvent } from 'react'
import styled from 'styled-components'

export default function Lends(): React.ReactNode {
    const { books, lends, setLends, filteredLends, setFilteredLends, loadingLends } = useEntities(['books', 'lends'])

    const handleDelete = async (id: string): Promise<void> => {
        await api.sheet.lends.delete(id).then(async () => {
            if (!lends || !setLends || !books || !setFilteredLends) return

            const filtered = lends.filter(lend => lend?.id !== id)
            setFilteredLends(filtered)
            setLends(filtered)

            const lend = lends.find(lend => lend.id === id)
            if (!lend) return

            const remainingLends = await api.sheet.lends.get()
            const hasActiveLend = remainingLends.some(item => item.book_id === lend.book_id)

            if (!hasActiveLend) {
                const book = books.find(b => b.id === lend.book_id)
                const updatedBook = { ...book, status: 'available' } as Book
                await api.sheet.books.put(lend.book_id, updatedBook)
            }
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!lends || !setFilteredLends) return

        const value = e.target.value

        if (value) {
            setFilteredLends(lends.filter(lend => lend.first_name.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredLends(lends)
        }
    }

    return (
        <PageContainer>
            <IndentedBackButton />
            <RegisterLinkContainer>
                <RegisterLendLink href={'/pages/dashboard/lends/lend-registration'}>
                    Registrar um empréstimo
                </RegisterLendLink>
            </RegisterLinkContainer>
            {loadingLends ? (
                <Loading />
            ) : !filteredLends?.length ? (
                <Empty />
            ) : (
                <ListContainer>
                    <SearchContainer>
                        <SearchInput
                            type="text"
                            placeholder="Pesquise pelo primeiro nome do usuário"
                            onChange={handleChange}
                        />
                    </SearchContainer>
                    <PaginatedLendsItems itemsPerPage={10} lends={filteredLends} onDelete={handleDelete} />
                </ListContainer>
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

const IndentedBackButton = styled(BackButton)`
    margin-left: 16px;
    margin-bottom: 32px;
`

const RegisterLinkContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
`

const RegisterLendLink = styled(Link)`
    padding: 8px 16px;
    background-color: var(--color-primary);
    color: var(--color-white);
    border-radius: var(--radius-md);
`

const ListContainer = styled.div`
    padding-left: 16px;
    padding-right: 16px;
`

const SearchContainer = styled.div`
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
