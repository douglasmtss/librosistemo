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
import styled from 'styled-components'

import { v4 as uuidv4 } from 'uuid'
import { useEntities } from '@/hooks/useEntities'

export default function LendRegistration(): React.ReactNode {
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
        <PageContainer>
            <IndentedBackButton />
            {loadingUsers ? (
                <Loading />
            ) : (
                !userSelected?.id &&
                users.map(user => {
                    return (
                        <UserRow
                            key={user.id}
                            onClick={() => {
                                setUserSelected(user)
                            }}
                        >
                            <UserInfo>
                                <span>{user.first_name}</span>
                                <span> {user.last_name}</span>
                                <span> {user.phone}</span>
                            </UserInfo>
                            <EditUserButton>
                                <FaPencilAlt />
                            </EditUserButton>
                        </UserRow>
                    )
                })
            )}

            {userSelected?.id && (
                <>
                    <SelectedUserContainer>
                        <SelectedUserField>Nome: {userSelected.first_name}</SelectedUserField>
                        <SelectedUserField>Sobrenome: {userSelected.last_name}</SelectedUserField>
                        <SelectedUserField>Telefone: {userSelected.phone}</SelectedUserField>

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
                        <BookAmountInfo>{`Quantidade: ${selectedBookAmount}`}</BookAmountInfo>
                        <BookAmountInfo>{`Quantidade disponível: ${booksAvailable}`}</BookAmountInfo>
                    </SelectedUserContainer>

                    <SaveButtonContainer>
                        <SaveButton
                            disabled={!booksAvailable || alreadyLent}
                            $available={!!booksAvailable}
                            onClick={() => {
                                handleSubmit()
                            }}
                        >
                            Salvar
                        </SaveButton>
                    </SaveButtonContainer>
                </>
            )}
        </PageContainer>
    )
}

const PageContainer = styled.div`
    width: 100%;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
`

const IndentedBackButton = styled(BackButton)`
    margin-left: 16px;
    margin-bottom: 32px;
`

const UserRow = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom-width: 2px;
    padding: 16px;

    &:nth-child(even) {
        background-color: #f1f5f9;
    }

    &:hover {
        background-color: #e2e8f0;
    }
`

const UserInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1 1 0%;
    flex-direction: column;

    @media (min-width: 640px) {
        flex-direction: row;
    }
`

const EditUserButton = styled.button`
    color: var(--color-primary);
    margin-left: 16px;
`

const SelectedUserContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
`

const SelectedUserField = styled.span`
    margin-bottom: 16px;
`

const BookAmountInfo = styled.span`
    margin-top: 8px;
`

const SaveButtonContainer = styled.div`
    padding: 16px;
`

const SaveButton = styled.button<{ $available: boolean }>`
    padding: 8px 16px;
    border-radius: 6px;
    background-color: ${({ $available }): string => ($available ? 'var(--color-primary)' : 'var(--color-gray-300)')};
    color: ${({ $available }): string => ($available ? 'var(--color-white)' : 'var(--color-gray-500)')};
`
