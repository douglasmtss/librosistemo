'use client'

import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import Link from 'next/link'
import { FaArrowLeft, FaArrowRight, FaPencilAlt, FaTrash } from 'react-icons/fa'
import { useToastify } from '@/hooks/useToastify'
import { PaginatedContainer } from './styles'
import { DeleteModal } from './DeleteModal'

export const PaginatedUserItems = ({
    itemsPerPage,
    users,
    onDelete
}: {
    itemsPerPage: number
    users: User[]
    onDelete: (index: string) => void
}): JSX.Element => {
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
            <div className="flex flex-col">
                {currentItems?.map((user, index) => {
                    return (
                        <div
                            key={`${user.phone} - ${index}`}
                            className="flex items-center w-full h-12 border-b-2 p-4 even:bg-slate-100 hover:bg-slate-200"
                        >
                            <h2 className="flex-1 text-gray-500 font-semibold">
                                {user.first_name} {user.last_name}
                            </h2>

                            <Link href={`/pages/dashboard/users/${index}`} className="mr-8 text-primary">
                                <FaPencilAlt />
                            </Link>
                            <button className="text-red-500" onClick={() => setDeleting(`${user?.id}`)}>
                                <FaTrash />
                            </button>
                        </div>
                    )
                })}
            </div>
            <div className="mx-auto w-full flex justify-center items-center -mb-12 mt-8">
                {users?.length ? (
                    <span>
                        {users?.length} {users?.length > 1 ? 'usuários encontrados' : 'usuário encontrado'}{' '}
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
