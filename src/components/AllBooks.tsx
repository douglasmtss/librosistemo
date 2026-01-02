/* eslint-disable @next/next/no-img-element */
'use client'
import { memo, useState } from 'react'
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
function AllBooks({ books, lends }: AllBooksProps): JSX.Element {
    const [openModal, setOpenModal] = useState<Book | Record<string, never>>({})

    return (
        <div className="w-full flex flex-wrap gap-4  justify-center p-2 max-w-[1280px] mx-auto">
            {openModal?.title && <BookModal onClose={() => setOpenModal({})} book={openModal} />}

            <BackToTopButton />

            {books?.map((book, index) => {
                const bookAmountAndAvailable = getBookAmountAndAvailable(String(book?.id), books, lends)

                return (
                    <div
                        key={index}
                        className="w-full p-8 max-w-72 bg-white shadow-2xl rounded-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer"
                        onClick={() => {
                            setOpenModal(book)
                        }}
                    >
                        <Img
                            src={book?.image}
                            alt={book.title}
                            width={136}
                            height={196}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="font-semibold text-lg text-gray-800 mb-1">
                                <TextElipsis text={book.title} width={144} height={32} />
                            </h2>
                            <h3 className="text-sm text-gray-600 mb-2">
                                <TextElipsis text={book.author} width={144} height={16} />
                            </h3>
                            <h3 className="text-sm text-gray-600">
                                <TextElipsis text={`Quantidade: ${book.amount}`} width={144} height={16} />
                            </h3>
                            <h3 className="text-sm text-gray-600 mt-1">
                                <TextElipsis
                                    text={`Disponíveis: ${bookAmountAndAvailable?.booksAvailable}`}
                                    width={144}
                                    height={16}
                                />
                            </h3>
                            <h4 className="mt-4 text-sm w-full inline-block">
                                <BookStatus
                                    label={book?.status}
                                    className="w-full inline-block text-center text-white bg-blue-500 rounded-md py-1"
                                />
                            </h4>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default memo(AllBooks)
