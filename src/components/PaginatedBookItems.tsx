'use client'

import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import Link from 'next/link'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import styled from 'styled-components'
import { useToastify } from '@/hooks/useToastify'
import { Img } from './Img'
import { PaginatedContainer } from './styles'
import { BookStatus } from './BookStatus'
import { TextElipsis } from './TextElipsis'
import { DeleteModal } from './DeleteModal'
import paginateNavigationButtons from '@/lib/paginateNagivationButtons'

export const PaginatedBookItems = ({
    itemsPerPage,
    books,
    onDelete
}: {
    itemsPerPage: number
    books: Book[]
    onDelete: (index: string) => void
}): React.ReactNode => {
    const [itemOffset, setItemOffset] = useState(0)
    const [deleting, setDeleting] = useState('')

    const { toast } = useToastify()

    const endOffset = itemOffset + itemsPerPage
    const currentItems = books.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(books.length / itemsPerPage)

    const handlePageClick = (event: { selected: number }): void => {
        const newOffset = (event.selected * itemsPerPage) % books.length
        setItemOffset(newOffset)
    }

    const onConfirm = (): void => {
        onDelete(`${deleting}`)
        setDeleting('')
        toast('Livro foi excluído com sucesso!', 'success')
    }

    const onCancel = (): void => {
        setDeleting('')
    }

    return (
        <PaginatedContainer disabled={currentItems.length <= itemsPerPage}>
            {deleting && <DeleteModal onCancel={onCancel} onConfirm={onConfirm} />}
            <ItemsList>
                {currentItems?.map((book, index) => {
                    return (
                        <ItemRow key={`${book.title} - ${index}`}>
                            <CoverWrapper>
                                <Img width={20} src={book.image} alt={book.title} />
                            </CoverWrapper>
                            <ItemTitle>
                                {/* {book.title} */}
                                <TextElipsis text={book?.title} width={'100%'} height={16} />
                            </ItemTitle>
                            <StatusBadge label={book?.status} />

                            <EditLink href={`/pages/dashboard/${index}`}>
                                <FaPencilAlt />
                            </EditLink>
                            <DeleteButton onClick={() => setDeleting(`${book?.id}`)}>
                                <FaTrash />
                            </DeleteButton>
                        </ItemRow>
                    )
                })}
            </ItemsList>
            <CountRow>
                {books?.length ? (
                    <span>
                        {books?.length} {books?.length > 1 ? 'livros encontrados' : 'livro encontrado'}{' '}
                    </span>
                ) : null}
            </CountRow>
            <StyledPaginate
                activeLinkClassName="active-page-link"
                breakLabel="..."
                nextLabel={paginateNavigationButtons(books, 'right', itemsPerPage)}
                nextClassName="paginate-next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel={paginateNavigationButtons(books, 'left', itemsPerPage)}
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

const CoverWrapper = styled.div`
    margin-right: 16px;
`

const ItemTitle = styled.h2`
    flex: 1 1 0%;
    color: var(--color-gray-500);
    font-weight: 600;
`

const StatusBadge = styled(BookStatus)`
    padding: 0;
    margin-right: 8px;
    font-size: 14px;
    line-height: 20px;

    @media (min-width: 768px) {
        padding: 8px;
    }
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
