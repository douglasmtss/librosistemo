import { api } from '@/services/api'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'

type UseAvailableBooksState = {
    books: Book[]
    setBooks: Dispatch<SetStateAction<Book[]>>
    loadingBooks: boolean
    setLoadingBooks: Dispatch<SetStateAction<boolean>>
    filteredBooks: Book[]
    setFilteredBooks: Dispatch<SetStateAction<Book[]>>
    optionsBooks: Option[]
    setOptionsBooks: Dispatch<SetStateAction<Option[]>>
    lends: Lend[]
    setLends: Dispatch<SetStateAction<Lend[]>>
    loadingLends: boolean
    setLoadingLends: Dispatch<SetStateAction<boolean>>
    filteredLends: Lend[]
    setFilteredLends: Dispatch<SetStateAction<Lend[]>>
    optionsLends: Option[]
    setOptionsLends: Dispatch<SetStateAction<Option[]>>
    users: User[]
    setUsers: Dispatch<SetStateAction<User[]>>
    loadingUsers: boolean
    setLoadingUsers: Dispatch<SetStateAction<boolean>>
    filteredUsers: User[]
    setFilteredUsers: Dispatch<SetStateAction<User[]>>
    optionsUsers: Option[]
    setOptionsUsers: Dispatch<SetStateAction<Option[]>>
}

type DataTypeOrAll = DataType | 'all'

export const useEntities = (dataType: DataTypeOrAll[]): UseAvailableBooksState => {
    const [books, setBooks] = useState<Book[]>([])
    const [lends, setLends] = useState<Lend[]>([])
    const [users, setUsers] = useState<User[]>([])

    const [loadingBooks, setLoadingBooks] = useState(true)
    const [loadingLends, setLoadingLends] = useState(true)
    const [loadingUsers, setLoadingUsers] = useState(true)

    const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
    const [filteredLends, setFilteredLends] = useState<Lend[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])

    const [optionsBooks, setOptionsBooks] = useState<Option[]>([])
    const [optionsUsers, setOptionsUsers] = useState<Option[]>([])
    const [optionsLends, setOptionsLends] = useState<Option[]>([])

    const getUsers = useCallback(async () => {
        api.sheet.users
            .get()
            .then(data => {
                const opts = data.map(d => ({
                    label: `${d.first_name} ${d.last_name}`,
                    value: d.id
                })) as Option[]

                setOptionsUsers(opts)
                setUsers(data)
                setFilteredUsers(data)
            })
            .finally(() => {
                setLoadingUsers(false)
            })
    }, [])

    const getLends = useCallback(async () => {
        await api.sheet.lends
            .get()
            .then(data => {
                const opts = data.map(d => ({
                    label: `${d.first_name} ${d.last_name}`,
                    value: d.id
                })) as Option[]

                setOptionsLends(opts)
                setLends(data)
                setFilteredLends(data)
            })
            .finally(() => {
                setLoadingLends(false)
            })
    }, [])

    const getBooks = useCallback(async () => {
        await api.sheet.books
            .get()
            .then(data => {
                const opts = data.map(d => ({
                    label: d.title,
                    value: d.id
                })) as Option[]

                setOptionsBooks(opts)
                setBooks(data)
                setFilteredBooks(data)
            })
            .finally(() => {
                setLoadingBooks(false)
            })
    }, [])

    const entities = useMemo(() => {
        return {
            books: [getBooks],
            lends: [getLends],
            users: [getUsers],
            all: [getBooks, getLends, getUsers]
        }
    }, [getBooks, getLends, getUsers]) as Record<DataTypeOrAll, (() => void)[]>

    useEffect(() => {
        if (!dataType) return

        if (Object.keys(entities).some(key => dataType.includes(key as DataTypeOrAll))) {
            dataType.forEach(type => entities[type].forEach((entity: () => void) => entity()))
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return {
        users,
        setUsers,
        loadingUsers,
        setLoadingUsers,
        filteredUsers,
        setFilteredUsers,
        optionsUsers,
        setOptionsUsers,
        books,
        setBooks,
        loadingBooks,
        setLoadingBooks,
        filteredBooks,
        setFilteredBooks,
        optionsBooks,
        setOptionsBooks,
        lends,
        setLends,
        loadingLends,
        setLoadingLends,
        filteredLends,
        setFilteredLends,
        optionsLends,
        setOptionsLends
    }
}
