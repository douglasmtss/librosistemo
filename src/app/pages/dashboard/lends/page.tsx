'use client'
import { BackButton } from '@/components/BackButton'
import { Empty } from '@/components/Empty'
import { Loading } from '@/components/Loading'
import { PaginatedLendsItems } from '@/components/PaginatedLendsItems'
import { useEntities } from '@/hooks/useEntities'
import { api } from '@/services/api'
import Link from 'next/link'
import { ChangeEvent } from 'react'

export default function Lends(): JSX.Element {
    const { books, lends, setLends, filteredLends, setFilteredLends, loadingLends } = useEntities(['books', 'lends'])

    const handleDelete = async (id: string): Promise<void> => {
        await api.sheet.lends.delete(id).then(() => {
            if (!lends || !setLends || !books || !setFilteredLends) return

            const filtered = lends.filter(lend => lend?.id !== id)
            setFilteredLends(filtered)
            setLends(filtered)

            const lend = lends.find(lend => lend.id === id)
            if (!lend) return

            const bookId = lend.book_id
            const book = books.find(b => b.id === bookId)
            const updatedBook = {
                ...book,
                status: 'available'
            } as Book

            api.sheet.books.put(bookId, updatedBook)
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!lends || !setFilteredLends) return

        const value = e.target.value

        if (value) {
            setFilteredLends(lends.filter(user => user.first_name.toLowerCase().match(value.toLowerCase())))
        } else {
            setFilteredLends(lends)
        }
    }

    return (
        <div className="w-full max-w-[740px] mx-auto">
            <BackButton classNameContainer="ml-4 mb-8" />
            <div className="w-full flex justify-center items-center mb-8">
                <Link
                    href={'/pages/dashboard/lends/lend-registration'}
                    className="py-2 px-4 bg-primary text-white rounded-lg"
                >
                    Registrar um empréstimo
                </Link>
            </div>
            {loadingLends ? (
                <Loading />
            ) : !filteredLends?.length ? (
                <Empty />
            ) : (
                <div className="px-4">
                    <div className="flex justify-between items-center mb-8">
                        <input
                            type="text"
                            placeholder="Pesquise pelo primeiro nome do usuário"
                            className="border-2 border-gray-300 w-full h-10 p-2"
                            onChange={handleChange}
                        />
                    </div>
                    <PaginatedLendsItems itemsPerPage={10} lends={filteredLends} onDelete={handleDelete} />
                </div>
            )}
        </div>
    )
}
