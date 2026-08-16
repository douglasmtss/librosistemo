'use client'

import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import Link from 'next/link'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import styled from 'styled-components'
import { useToastify } from '@/hooks/useToastify'
import { PaginatedContainer } from './styles'
import { DeleteModal } from './DeleteModal'
import paginateNavigationButtons from '@/lib/paginateNagivationButtons'

export const PaginatedUserItems = ({
    itemsPerPage,
    users,
    onDelete
}: {
    itemsPerPage: number
    users: User[]
    onDelete: (index: string) => void
}): React.ReactNode => {
    const [itemOffset, setItemOffset] = useState(0)
    const [deleting, setDeleting] = useState('')

    const { toast } = useToastify()

    const endOffset = itemOffset + itemsPerPage
    const currentItems = users.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(users.length / itemsPerPage)

    const handlePageClick = (event: { selected: number }): void => {
        const newOffset = (event.selected * itemsPerPage) % users.length
        setItemOffset(newOffset)
    }

    const onConfirm = (): void => {
        onDelete(`${deleting}`)
        setDeleting('')
        toast('Usuário foi excluído com sucesso!', 'success')
    }

    const onCancel = (): void => {
        setDeleting('')
    }

    return (
        <PaginatedContainer disabled={currentItems.length <= itemsPerPage}>
            {deleting && <DeleteModal onCancel={onCancel} onConfirm={onConfirm} />}
            <ItemsList>
                {currentItems?.map((user, index) => {
                    return (
                        <ItemRow key={`${user.phone} - ${index}`}>
                            <ItemName>
                                {user.first_name} {user.last_name}
                            </ItemName>

                            <EditLink href={`/pages/dashboard/users/${index}`}>
                                <FaPencilAlt />
                            </EditLink>
                            <DeleteButton onClick={() => setDeleting(`${user?.id}`)}>
                                <FaTrash />
                            </DeleteButton>
                        </ItemRow>
                    )
                })}
            </ItemsList>
            <CountRow>
                {users?.length ? (
                    <span>
                        {users?.length} {users?.length > 1 ? 'usuários encontrados' : 'usuário encontrado'}{' '}
                    </span>
                ) : null}
            </CountRow>
            <StyledPaginate
                activeLinkClassName="active-page-link"
                breakLabel="..."
                nextLabel={paginateNavigationButtons(users, 'right')}
                nextClassName="paginate-next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel={paginateNavigationButtons(users, 'left')}
                previousClassName="paginate-previous"
                renderOnZeroPageCount={null}
            />
        </PaginatedContainer>
    )
}

const ItemsList = styled.div`
    display: flex;
    flex-direction: column;
`

const ItemRow = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    border-bottom: 2px solid var(--color-gray-200);
    padding: 16px;

    &:nth-child(even) {
        background-color: var(--color-gray-100);
    }

    &:hover {
        background-color: var(--color-gray-200);
    }
`

const ItemName = styled.h2`
    flex: 1 1 0%;
    color: var(--color-gray-500);
    font-weight: 600;
`

const EditLink = styled(Link)`
    margin-right: 32px;
    color: var(--color-primary);
`

const DeleteButton = styled.button`
    color: var(--color-danger);
`

const CountRow = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: -48px;
    margin-top: 32px;
`

const StyledPaginate = styled(ReactPaginate)`
    li.paginate-next,
    li.paginate-previous {
        position: relative;
    }

    a.active-page-link {
        background-color: var(--color-primary);
        color: var(--color-white);
        border-radius: 9999px;
        padding-left: 8px;
        padding-right: 8px;
    }
`
