'use client'
import { memo, useState } from 'react'
import styled from 'styled-components'
import { BookModal } from './BookModal'
import { Img } from './Img'
import { BookStatus } from './BookStatus'
import { TextElipsis } from './TextElipsis'
import { getBookAmountAndAvailable } from '@/hooks/getBookAmountAndAvailable'
import { BackToTopButton } from './BackToTopButton'
interface AllBooksProps {
    books: Book[]
    lends: Lend[]
}
function AllBooks({ books, lends }: AllBooksProps): React.ReactNode {
    const [openModal, setOpenModal] = useState<Book | Record<string, never>>({})

    return (
        <BooksGrid>
            {openModal?.title && <BookModal onClose={() => setOpenModal({})} book={openModal} />}

            <BackToTopButton />

            {books?.map(book => {
                const bookAmountAndAvailable = getBookAmountAndAvailable(String(book?.id), books, lends)

                return (
                    <BookCard
                        key={book.id ?? book.title}
                        onClick={() => {
                            setOpenModal(book)
                        }}
                        onKeyDown={event => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                setOpenModal(book)
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Abrir detalhes de ${book.title}`}
                    >
                        <CoverImage src={book?.image} alt={book.title} width={136} height={196} />
                        <BookInfo>
                            <CardTitle>
                                <TextElipsis text={book.title} width={144} height={32} />
                            </CardTitle>
                            <BookAuthor>
                                <TextElipsis text={book.author} width={144} height={16} />
                            </BookAuthor>
                            <BookMeta>
                                <TextElipsis text={`Quantidade: ${book.amount}`} width={144} height={16} />
                            </BookMeta>
                            <BookAvailability>
                                <TextElipsis
                                    text={`Disponíveis: ${bookAmountAndAvailable?.booksAvailable}`}
                                    width={144}
                                    height={16}
                                />
                            </BookAvailability>
                            <StatusHeading>
                                <StatusBadge label={book?.status} />
                            </StatusHeading>
                        </BookInfo>
                    </BookCard>
                )
            })}
        </BooksGrid>
    )
}

export default memo(AllBooks)

const BooksGrid = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    padding: 8px;
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
`

const BookCard = styled.div`
    width: 100%;
    padding: 32px;
    max-width: 288px;
    background-color: var(--color-white);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
        transform: scale(1.05);
    }
`

const CoverImage = styled(Img)`
    width: 100%;
    height: 224px;
    object-fit: cover;
`

const BookInfo = styled.div`
    padding: 16px;
`

const CardTitle = styled.h2`
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    color: var(--color-gray-800);
    margin-bottom: 4px;
`

const BookMeta = styled.h3`
    font-size: 14px;
    line-height: 20px;
    color: #4b5563;
`

const BookAuthor = styled(BookMeta)`
    margin-bottom: 8px;
`

const BookAvailability = styled(BookMeta)`
    margin-top: 4px;
`

const StatusHeading = styled.h4`
    margin-top: 16px;
    font-size: 14px;
    line-height: 20px;
    width: 100%;
    display: inline-block;
`

const StatusBadge = styled(BookStatus)`
    && {
        width: 100%;
        display: inline-block;
        text-align: center;
        color: var(--color-white);
        background-color: #3b82f6;
        border-radius: var(--radius-md);
        padding-top: 4px;
        padding-bottom: 4px;
    }
`
