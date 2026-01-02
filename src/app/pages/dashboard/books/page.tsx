'use client'
import { api } from '@/services/api'
import { Empty } from '@/components/Empty'
import { PaginatedBookItems } from '@/components/PaginatedBookItems'
import Link from 'next/link'
import { ChangeEvent, useEffect, useState, useRef } from 'react'
import { BackButton } from '@/components/BackButton'
import { Loading } from '@/components/Loading'

export type FilterBook = {
    label: 'Título' | 'Autor' | 'Categoria' | 'ISBN'
    value: 'title' | 'author' | 'category' | 'isbn'
}

export default function Books(): JSX.Element {
    const [books, setBooks] = useState<Book[]>([])
    const [filteredBooks, setFilteredBooks] = useState<Book[]>(books)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterBook>({ label: 'Título', value: 'title' })
    const [showFilter, setShowFilter] = useState(false)
    const filterRef = useRef<HTMLDivElement>(null)

    const handleDelete = async (id: string): Promise<void> => {
        await api.sheet.books.delete(id).then(() => {
            const filtered = books.filter(book => book?.id !== id)
            setBooks(filtered)
            setFilteredBooks(filtered)
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value

        if (value) {
            setFilteredBooks(books.filter(book => String(book[filter.value]).toLowerCase().match(value.toLowerCase())))
        } else {
            setFilteredBooks(books)
        }
    }

    useEffect(() => {
        api.sheet.books
            .get()
            .then(data => {
                setBooks(data)
                setFilteredBooks(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilter(false)
            }
        }

        if (showFilter) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [showFilter])

    const handleFilterBook = (event: React.MouseEvent<HTMLDivElement>): void => {
        const selectedFilter = event.currentTarget.getAttribute('data-filter')
        const selectedLabel = event.currentTarget.getAttribute('data-label')

        if (selectedFilter && selectedLabel) {
            setFilter({ label: selectedLabel as FilterBook['label'], value: selectedFilter as FilterBook['value'] })
            setShowFilter(false)
        }
    }

    return (
        <div className="w-full max-w-185 mx-auto">
            <div className="w-full flex justify-between items-center mb-8 p-4">
                <BackButton />
                <Link
                    href={'/pages/dashboard/book-registration'}
                    className="py-2 px-4 bg-primary text-white rounded-lg"
                >
                    Cadastrar livro
                </Link>
            </div>
            <div className="px-4">
                <div className="flex flex-col md:flex-row-reverse  mb-8 md:px-8">
                    <div ref={filterRef} className="relative w-full md:w-32 md:ml-4 h-10 mb-2 flex justify-center items-center border cursor-pointer">
                        <div
                            onClick={() => setShowFilter(!showFilter)}
                            className="w-full flex justify-center items-center"
                        >
                            <span>{filter.label}</span>
                        </div>
                        {showFilter ? (
                            <div className="absolute top-full right-0 w-full flex flex-col justify-center items-center border bg-white">
                                <div
                                    onClick={handleFilterBook}
                                    data-filter="title"
                                    data-label="Título"
                                    className={
                                        filter.value === 'title'
                                            ? 'hidden'
                                            : 'w-full flex justify-center items-center p-2  hover:bg-slate-300 odd:bg-slate-100'
                                    }
                                >
                                    Título
                                </div>
                                <div
                                    onClick={handleFilterBook}
                                    data-filter="author"
                                    data-label="Autor"
                                    className={
                                        filter.value === 'author'
                                            ? 'hidden'
                                            : 'w-full flex justify-center items-center p-2 hover:bg-slate-300 odd:bg-slate-100'
                                    }
                                >
                                    Autor
                                </div>
                                <div
                                    onClick={handleFilterBook}
                                    data-filter="category"
                                    data-label="Categoria"
                                    className={
                                        filter.value === 'category'
                                            ? 'hidden'
                                            : 'w-full flex justify-center items-center p-2 hover:bg-slate-300 odd:bg-slate-100'
                                    }
                                >
                                    Categoria
                                </div>
                                <div
                                    onClick={handleFilterBook}
                                    data-filter="isbn"
                                    data-label="ISBN"
                                    className={
                                        filter.value === 'isbn'
                                            ? 'hidden'
                                            : 'w-full flex justify-center items-center p-2 hover:bg-slate-300 odd:bg-slate-100'
                                    }
                                >
                                    ISBN
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquise pelo título do livro"
                        className="border-2 border-gray-300 w-full h-10 p-2"
                        onChange={handleChange}
                    />
                </div>
                {loading ? (
                    <Loading />
                ) : !filteredBooks?.length ? (
                    <Empty />
                ) : (
                    <PaginatedBookItems itemsPerPage={10} books={filteredBooks} onDelete={handleDelete} />
                )}
            </div>
        </div>
    )
}
