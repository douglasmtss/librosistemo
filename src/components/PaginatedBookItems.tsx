'use client'

import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import Link from 'next/link'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
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
            <div className="flex flex-col">
                {currentItems?.map((book, index) => {
                    return (
                        <div
                            key={`${book.title} - ${index}`}
                            className="flex items-center w-full h-12 border-b-2 p-4 even:bg-slate-100 hover:bg-slate-200"
                        >
                            <div className="mr-4">
                                <Img width={20} src={book.image} alt={book.title} />
                            </div>
                            <h2 className="flex-1 text-gray-500 font-semibold">
                                {/* {book.title} */}
                                <TextElipsis text={book?.title} width={'100%'} height={16} />
                            </h2>
                            <BookStatus label={book?.status} className="p-0 mr-2 text-sm md:p-2 md:text-md" />

                            <Link href={`/pages/dashboard/${index}`} className="mr-8 text-primary">
                                <FaPencilAlt />
                            </Link>
                            <button className="text-red-500" onClick={() => setDeleting(`${book?.id}`)}>
                                <FaTrash />
                            </button>
                        </div>
                    )
                })}
            </div>
            <div className="mx-auto w-full flex justify-center items-center -mb-12 mt-8">
                {books?.length ? (
                    <span>
                        {books?.length} {books?.length > 1 ? 'livros encontrados' : 'livro encontrado'}{' '}
                    </span>
                ) : null}
            </div>
            <ReactPaginate
                activeLinkClassName="bg-primary text-white rounded-full px-2"
                breakLabel="..."
                nextLabel={paginateNavigationButtons(books, 'right', itemsPerPage)}
                nextClassName="relative"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel={paginateNavigationButtons(books, 'left', itemsPerPage)}
                previousClassName="relative "
                renderOnZeroPageCount={null}
            />
        </PaginatedContainer>
    )
}
