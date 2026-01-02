'use client'

import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import Link from 'next/link'
import { FaArrowLeft, FaArrowRight, FaTrash } from 'react-icons/fa'
import { useToastify } from '@/hooks/useToastify'
import { TextElipsis } from './TextElipsis'
import { VscOpenPreview } from 'react-icons/vsc'
import { PaginatedContainer } from './styles'
import { DeleteModal } from './DeleteModal'

export const PaginatedLendsItems = ({
    itemsPerPage,
    lends,
    onDelete
}: {
    itemsPerPage: number
    lends: Lend[]
    onDelete: (index: string) => void
}): JSX.Element => {
    const [itemOffset, setItemOffset] = useState(0)
    const [deleting, setDeleting] = useState('')

    const { toast } = useToastify()

    const endOffset = itemOffset + itemsPerPage
    const currentItems = lends.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(lends.length / itemsPerPage)

    const handlePageClick = (event: { selected: number }): void => {
        const newOffset = (event.selected * itemsPerPage) % lends.length
        setItemOffset(newOffset)
    }

    const onConfirm = (): void => {
        onDelete(`${deleting}`)
        setDeleting('')
        toast('Empréstimo foi excluído com sucesso!', 'success')
    }

    const onCancel = (): void => {
        setDeleting('')
    }

    return (
        <PaginatedContainer disabled={currentItems.length <= itemsPerPage}>
            {deleting && <DeleteModal onCancel={onCancel} onConfirm={onConfirm} />}
            <div className="flex flex-col">
                {currentItems?.map((lend, index) => {
                    return (
                        <div
                            key={`${lend.first_name} - ${index}`}
                            className="flex items-center w-full h-12 border-b-2 p-4 even:bg-slate-100 hover:bg-slate-200"
                        >
                            <span className="flex-1 text-gray-500 font-semibold">
                                <TextElipsis width={'100%'} height={16} text={lend.first_name + ' ' + lend.last_name} />
                            </span>

                            <Link href={`/pages/dashboard/lends/${index}`} className="mr-8 text-primary">
                                <VscOpenPreview className="text-xl" />
                            </Link>
                            <button className="text-red-500" onClick={() => setDeleting(`${lend?.id}`)}>
                                <FaTrash />
                            </button>
                        </div>
                    )
                })}
            </div>
            <div className="mx-auto w-full flex justify-center items-center -mb-12 mt-8">
                {lends?.length ? (
                    <span>
                        {lends?.length} {lends?.length > 1 ? 'empréstimos encontrados' : ' empréstimo encontrado'}
                    </span>
                ) : null}
            </div>
            <ReactPaginate
                activeLinkClassName="bg-primary text-white rounded-full px-2"
                breakLabel="..."
                nextLabel={
                    <div className="absolute right-0 top-8 bg-primary text-white rounded-full px-4 py-2">
                        <FaArrowRight />
                    </div>
                }
                nextClassName="relative"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel={
                    <div className="absolute left-0 top-8 bg-primary text-white rounded-full px-4 py-2">
                        <FaArrowLeft />
                    </div>
                }
                previousClassName="relative "
                renderOnZeroPageCount={null}
            />
        </PaginatedContainer>
    )
}
