'use client'
import { BackButton } from '@/components/BackButton'
import { Loading } from '@/components/Loading'
import { useToastify } from '@/hooks/useToastify'
import { getBookAmountAndAvailable } from '@/hooks/getBookAmountAndAvailable'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import Select from 'react-select'

import { v4 as uuidv4 } from 'uuid'
import { useEntities } from '@/hooks/useEntities'

export default function LendRegistration(): JSX.Element {
    const [userSelected, setUserSelected] = useState<User | Record<string, never>>({})
    const [bookSelected, setBookSelected] = useState<Option | Record<string, never>>({})
    const [alreadyLent, setAlreadyLent] = useState(false)

    const router = useRouter()
    const { toast } = useToastify()

    const { books, optionsBooks, lends, users, loadingUsers } = useEntities(['books', 'users', 'lends'])

    const { booksAvailable, selectedBookAmount } = getBookAmountAndAvailable(String(bookSelected?.value), books, lends)

    useEffect(() => {
        if (bookSelected?.value && lends?.length && userSelected?.first_name) {
            const lend = lends.find(l => l.book_id === bookSelected.value)
            if (lend?.first_name === userSelected.first_name && lend?.last_name === userSelected.last_name) {
                setAlreadyLent(true)
                toast('Usuário já está com este livro!', 'warning')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookSelected, lends, userSelected.first_name, userSelected.last_name])

    const handleSubmit = useCallback(async () => {
        if (!booksAvailable) {
            toast('Este livro já está emprestado!', 'error')
        } else {
            await api.sheet.lends
                .post({
                    id: uuidv4(),
                    user_id: userSelected.id as string,
                    first_name: userSelected.first_name,
                    last_name: userSelected.last_name,
                    book_id: bookSelected.value,
                    book_title: bookSelected.label,
                    created: new Date().toISOString()
                })
                .then(response => {
                    if (response?.status === 200) {
                        toast('Empréstimo registrado com sucesso!', 'success')
                        const status = booksAvailable - 1 <= 0 ? 'borrowed' : 'available'
                        const book = books.find(b => b.id === bookSelected.value)

                        if (status === book?.status) {
                            return
                        }

                        const updatedBook = {
                            ...book,
                            status
                        } as Book

                        api.sheet.books.put(`${book?.id}`, updatedBook)
                    }
                })
                .finally(() => {
                    router.push('/pages/dashboard/lends')
                    router.refresh()
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookSelected?.label, bookSelected?.value, userSelected?.first_name, userSelected?.id, userSelected?.last_name])

    return (
        <div className="w-full max-w-[740px] mx-auto">
            <BackButton classNameContainer="ml-4 mb-8" />
            {loadingUsers ? (
                <Loading />
            ) : (
                !userSelected?.id &&
                users.map(user => {
                    return (
                        <div
                            key={user.id}
                            className="flex  items-center w-full border-b-2 p-4 even:bg-slate-100 hover:bg-slate-200"
                            onClick={() => {
                                setUserSelected(user)
                            }}
                        >
                            <div className="flex justify-between items-center flex-1 flex-col sm:flex-row">
                                <span>{user.first_name}</span>
                                <span> {user.last_name}</span>
                                <span> {user.phone}</span>
                            </div>
                            <button className="text-primary ml-4">
                                <FaPencilAlt />
                            </button>
                        </div>
                    )
                })
            )}

            {userSelected?.id && (
                <>
                    <div className="flex flex-col p-4">
                        <span className="mb-4">Nome: {userSelected.first_name}</span>
                        <span className="mb-4">Sobrenome: {userSelected.last_name}</span>
                        <span className="mb-4">Telefone: {userSelected.phone}</span>

                        <div>
                            <h2>Selecione o livro:</h2>
                            <Select
                                name="books"
                                options={optionsBooks}
                                onChange={e => {
                                    setBookSelected(e as Option)
                                }}
                            />
                        </div>
                        <span className="mt-2">{`Quantidade: ${selectedBookAmount}`}</span>
                        <span className="mt-2">{`Quantidade disponível: ${booksAvailable}`}</span>
                    </div>

                    <div className="p-4">
                        <button
                            disabled={!booksAvailable || alreadyLent}
                            className={
                                booksAvailable
                                    ? 'py-2 px-4 rounded-md bg-primary text-white'
                                    : 'py-2 px-4 rounded-md bg-gray-300 text-gray-500'
                            }
                            onClick={() => {
                                handleSubmit()
                            }}
                        >
                            Salvar
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
