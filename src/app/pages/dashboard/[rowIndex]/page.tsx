'use client'
import React from 'react'
import BookEditForm from '@/components/BookEditForm'
import { BackButton } from '@/components/BackButton'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import styled from 'styled-components'

interface EditBookProps {
    params: Promise<{
        rowIndex: string
    }>
}

export default function EditBook({ params }: EditBookProps): React.ReactNode {
    // unwrap the Promise first
    const { rowIndex } = React.use(params)

    const [books, setBooks] = useState<Book[]>([])
    const book = books.find((_, i) => +rowIndex === i) as Book

    useEffect(() => {
        api.sheet.books.get().then(data => {
            setBooks(data)
        })
    }, [])

    return (
        <>
            <IndentedBackButton />
            <BookEditForm
                id={book?.id}
                rowIndex={`${rowIndex}`}
                isbn={book?.isbn}
                title={book?.title}
                subtitle={book?.subtitle}
                author={book?.author}
                description={book?.description}
                image={book?.image}
                amount={book?.amount}
                category={book?.category}
                place={book?.place}
            />
        </>
    )
}

const IndentedBackButton = styled(BackButton)`
    margin-left: 32px;
`
