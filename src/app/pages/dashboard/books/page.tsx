'use client'
import { api } from '@/services/api'
import { Empty } from '@/components/Empty'
import { PaginatedBookItems } from '@/components/PaginatedBookItems'
import Link from 'next/link'
import { ChangeEvent, useEffect, useState, useRef } from 'react'
import { BackButton } from '@/components/BackButton'
import { Loading } from '@/components/Loading'
import styled from 'styled-components'

export type FilterBook = {
    label: 'Título' | 'Autor' | 'Categoria' | 'ISBN'
    value: 'title' | 'author' | 'category' | 'isbn'
}

export default function Books(): React.ReactNode {
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
            setFilteredBooks(
                books.filter(book => String(book[filter.value]).toLowerCase().includes(value.toLowerCase()))
            )
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

            return (): void => {
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
        <PageContainer>
            <Header>
                <BackButton />
                <RegisterLink href={'/pages/dashboard/book-registration'}>Cadastrar livro</RegisterLink>
            </Header>
            <Content>
                <SearchRow>
                    <FilterSelector ref={filterRef}>
                        <FilterToggle onClick={() => setShowFilter(!showFilter)}>
                            <span>{filter.label}</span>
                        </FilterToggle>
                        {showFilter ? (
                            <FilterDropdown>
                                <FilterOption
                                    onClick={handleFilterBook}
                                    data-filter="title"
                                    data-label="Título"
                                    $hidden={filter.value === 'title'}
                                >
                                    Título
                                </FilterOption>
                                <FilterOption
                                    onClick={handleFilterBook}
                                    data-filter="author"
                                    data-label="Autor"
                                    $hidden={filter.value === 'author'}
                                >
                                    Autor
                                </FilterOption>
                                <FilterOption
                                    onClick={handleFilterBook}
                                    data-filter="category"
                                    data-label="Categoria"
                                    $hidden={filter.value === 'category'}
                                >
                                    Categoria
                                </FilterOption>
                                <FilterOption
                                    onClick={handleFilterBook}
                                    data-filter="isbn"
                                    data-label="ISBN"
                                    $hidden={filter.value === 'isbn'}
                                >
                                    ISBN
                                </FilterOption>
                            </FilterDropdown>
                        ) : null}
                    </FilterSelector>
                    <SearchInput type="text" placeholder="Pesquise pelo título do livro" onChange={handleChange} />
                </SearchRow>
                {loading ? (
                    <Loading />
                ) : !filteredBooks?.length ? (
                    <Empty />
                ) : (
                    <PaginatedBookItems itemsPerPage={10} books={filteredBooks} onDelete={handleDelete} />
                )}
            </Content>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    width: 100%;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
`

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 16px;
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
    flex-direction: column;
    margin-bottom: 32px;

    @media (min-width: 768px) {
        flex-direction: row-reverse;
        padding-left: 32px;
        padding-right: 32px;
    }
`

const FilterSelector = styled.div`
    position: relative;
    width: 100%;
    height: 40px;
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--color-gray-200);
    cursor: pointer;

    @media (min-width: 768px) {
        width: 128px;
        margin-left: 16px;
    }
`

const FilterToggle = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const FilterDropdown = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--color-gray-200);
    background-color: var(--color-white);
`

const FilterOption = styled.div<{ $hidden: boolean }>`
    display: ${({ $hidden }): string => ($hidden ? 'none' : 'flex')};
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 8px;

    &:nth-child(odd) {
        background-color: var(--color-gray-100);
    }

    &:hover {
        background-color: var(--color-gray-300);
    }
`

const SearchInput = styled.input`
    border: 2px solid var(--color-gray-300);
    width: 100%;
    height: 40px;
    padding: 8px;
`
