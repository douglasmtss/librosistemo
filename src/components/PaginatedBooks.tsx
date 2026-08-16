'use client'

import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import styled from 'styled-components'
import AllBooks from './AllBooks'
import { Empty } from './Empty'
import { PaginatedContainer } from './styles'
import { Loading } from './Loading'
import { useEntities } from '@/hooks/useEntities'
import paginateNavigationButtons from '@/lib/paginateNagivationButtons'

export const PaginatedBooks = ({ itemsPerPage }: { itemsPerPage: number }): React.ReactNode => {
    const [itemOffset, setItemOffset] = useState(0)

    const { lends, books, loadingBooks } = useEntities(['lends', 'books'])

    const endOffset = itemOffset + itemsPerPage
    const currentItems = books.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(books.length / itemsPerPage)

    const handlePageClick = (event: { selected: number }): void => {
        const newOffset = (event.selected * itemsPerPage) % books.length
        setItemOffset(newOffset)
    }

    return (
        <PaginatedContainer disabled={currentItems.length <= itemsPerPage}>
            {loadingBooks ? <Loading /> : !books?.length ? <Empty /> : <AllBooks lends={lends} books={currentItems} />}

            <CountRow>{books?.length ? <span>{books?.length} livros encontrados</span> : null}</CountRow>

            <StyledPaginate
                activeLinkClassName="active-page-link"
                breakLabel="..."
                nextLabel={paginateNavigationButtons(books, 'right')}
                nextClassName="paginate-next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={1}
                pageCount={pageCount}
                previousLabel={paginateNavigationButtons(books, 'left')}
                previousClassName="paginate-previous"
                renderOnZeroPageCount={null}
            />
        </PaginatedContainer>
    )
}

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
    position: relative;

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
