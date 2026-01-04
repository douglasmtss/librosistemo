'use client'
import { api, services } from '@/services/api'
import { Empty } from '@/components/Empty'
import { useCallback, useEffect, useState, Suspense } from 'react'
import { Img } from '@/components/Img'
import { useToastify } from '@/hooks/useToastify'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BackButton } from '@/components/BackButton'
import BookCreateFormFromList from '@/components/BookCreateFormFromList'
import { useEntities } from '@/hooks/useEntities'
import { v4 as uuidv4 } from 'uuid'
import { useSearchParams, useRouter } from 'next/navigation'
import { checkIfBookAlreadyExists } from '@/lib/checkIfBookAlreadyExists'
import { GOOGLE_API_LIMIT } from '@/services/api'
import { BackToTopButton } from '@/components/BackToTopButton'

type ErrorObj = { error: boolean; message: string }

function SearchPageImpl(): React.ReactNode {
    const [booksInformations, setBooksInformations] = useState<BrasilapiBook[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingPost, setLoadingPost] = useState(false)
    const [codesWithErrors, setCodesWithErrors] = useState<string[]>([])
    const [sended, setSended] = useState(false)

    const [filteredByUnique, setFilteredByUnique] = useState<BrasilapiBook[]>([])
    const [countItems, setCountItems] = useState(0)
    const [remainingTime, setRemainingTime] = useState(0)

    const [codes, setCodes] = useState<string[]>([])
    const [countCodeItems, setCountCodeItems] = useState<number>(0)

    const [thereAreExistingBooks, setThereAreExistingBooks] = useState<string[]>([])

    const [apiSelected] = useState({
        google: false,
        brasilapi: true
    })

    const { books, setBooks } = useEntities(['books'])

    const { toast } = useToastify()

    const router = useRouter()

    const searchParams = useSearchParams()

    const list_isbn = searchParams.get('list_isbn')

    const getBooksInformations = useCallback(
        async (list_isbn: string, books: Book[]): Promise<void> => {
            if (!books?.length) {
                const localBooks = await api.sheet.books.get().then(data => {
                    setBooks(data)

                    return data
                })

                books = localBooks
            }

            const localCodes: string[] = JSON.parse(list_isbn)
            const localCodesWithErrors: string[] = []
            const localBooksInformations: BrasilapiBook[] = []

            const localObjectCodeIsbn = localCodes.map(code => ({ isbn: code })) as unknown as BrasilapiBook[]
            const { alreadyExists, filteredBooks } = await checkIfBookAlreadyExists(books, localObjectCodeIsbn)

            if (!filteredBooks.length) {
                router.push('/pages/dashboard/book-registration/list')
                setLoading(false)

                return
            }

            setThereAreExistingBooks(alreadyExists || [])
            const localCodesFilted = filteredBooks.map(code => code.isbn)
            setCodes(localCodesFilted)

            let localCount = 0

            for (const code of localCodesFilted) {
                localCount++
                setCountCodeItems(localCount)
                await searchFromBrasilApi(code).then(response => {
                    if (response.control.error) {
                        localCodesWithErrors.push(code)
                        // toast(response.control.message || 'Livros não encontrados', 'error')
                    }

                    if (!response.control.error) {
                        localBooksInformations.push(response.data)
                        // toast(response.control.message || 'Livros encontrados com sucesso', 'success')
                    }
                })
                await new Promise(resolve => setTimeout(resolve, 500)) // Wait 500ms between each request
            }

            setBooksInformations(localBooksInformations)
            setCodesWithErrors(localCodesWithErrors)
            setLoading(false)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [books, list_isbn]
    )

    const searchFromBrasilApi = async (code: string): Promise<{ control: ErrorObj; data: BrasilapiBook }> => {
        return await services
            .brasilapi(code)
            .then(bookDetails => {
                const parsed = {
                    ...bookDetails,
                    isbn: code,
                    imageLinks: {
                        thumbnail: bookDetails?.cover_url
                    },
                    categories: bookDetails?.subjects
                } as unknown as BrasilapiBook

                return { control: { error: false, message: 'Livro encontrado' }, data: parsed }
            })
            .catch(error => {
                const message = error?.response?.data?.message
                const responseUrl = error?.response?.config?.url

                console.error('Error trying fetch brasilapi ', message)

                const wrongCode = responseUrl.split('/').pop()

                return {
                    control: { error: true, message: message || 'Erro ao buscar livro', code: wrongCode },
                    data: {} as BrasilapiBook
                }
            })
    }

    const handleRegisterAll = async (): Promise<void> => {
        // Split the books into chunks of 500 items
        const chunkSize = 59
        const chunks = []

        setFilteredByUnique(booksInformations)
        for (let i = 0; i < booksInformations.length; i += chunkSize) {
            chunks.push(booksInformations.slice(i, i + chunkSize))
        }

        // Process each chunk sequentially
        let countItems = 0
        let countPost = 0
        for (const chunk of chunks) {
            countItems += chunk.length
            for (const book of chunk) {
                try {
                    countPost++
                    setLoadingPost(true)
                    setCountItems(countPost)
                    await api.sheet.books
                        .post({
                            ...(book as unknown as Book),
                            id: uuidv4(),
                            status: 'available',
                            amount: 1,
                            author: book?.authors?.join(', '),
                            category: book?.subjects?.join(', ')
                        })
                        .catch(error => {
                            const message = error?.response?.data?.message
                            console.error('Error trying to create book', message)
                            toast(message || 'Erro ao cadastrar livro', 'error')
                        })
                } catch (error) {
                    console.error('Error trying to create book', error)
                }
            }

            if (countItems < booksInformations.length) {
                setRemainingTime(GOOGLE_API_LIMIT / 1000)
                await new Promise(resolve => setTimeout(resolve, GOOGLE_API_LIMIT)) // Wait 60 seconds between each chunk because Google API has a limit of 60 requests per minute
                setRemainingTime(0)
                setLoadingPost(false)

                toast(`${chunk.length} livros foram cadastrados com sucesso`, 'success')
            }

            if (countItems === booksInformations.length) {
                toast(`Todos os livros foram cadastrados com sucesso`, 'success')

                setTimeout(() => {
                    setBooksInformations([])
                    setSended(true)
                    window.location.href = '/pages/dashboard/books'
                }, 2000)
            }
        }
    }

    const getCodesWithErrrosUrl = useCallback(() => {
        const blob = new Blob([codesWithErrors.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url

        return url
    }, [codesWithErrors])

    useEffect(() => {
        if (remainingTime) {
            const interval = setInterval(() => {
                setRemainingTime(prev => prev - 1)
            }, 1000)

            return (): void => clearInterval(interval)
        }
    }, [remainingTime])

    useEffect(() => {
        if (!list_isbn) return

        getBooksInformations(list_isbn, books)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list_isbn])

    if ((!booksInformations?.length && !loading) || sended) {
        return (
            <>
                <BackButton classNameContainer="ml-8" />
                <Empty />
            </>
        )
    }

    if (booksInformations?.length) {
        return (
            <div className="w-full h-full md:p-8 mx-auto">
                {loadingPost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Progresso do Cadastro</h2>
                            <p className="mb-2">Cadastrando livros...</p>
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                <div
                                    className="bg-blue-500 h-4 rounded-full"
                                    style={{
                                        width: `${(countItems / filteredByUnique.length) * 100}%`
                                    }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600">
                                {countItems} de {filteredByUnique.length} livros cadastrados
                            </p>
                            {remainingTime ? (
                                <p className="text-sm text-gray-600 mt-2">
                                    Continuaremos o cadastro em: {remainingTime}s (Limite da API do Google)
                                </p>
                            ) : null}
                        </div>
                    </div>
                )}
                <div className="w-full flex flex-col lg:flex lg:flex-row justify-between items-end px-8 md:px-28">
                    <div className="w-full">
                        <BackButton classNameContainer="mb-8" />
                        <h2>Resultado da pesquisa</h2>
                        <span>Verifique se está correto antes de cadastrar</span>
                    </div>
                    <div className="w-full md:w-max flex justify-end items-end lg:mr-8">
                        <button
                            onClick={handleRegisterAll}
                            className="w-full md:w-max mt-4 bg-blue-500 text-white py-2 px-4 hover:bg-white hover:text-blue-500 border-2 border-blue-500 text-xl"
                        >
                            {booksInformations?.length} (
                            {booksInformations?.length > 1 ? 'livros encontrados' : 'livro encontrado'}) - CADASTRAR
                            TODOS
                        </button>
                    </div>
                    <div className="w-full md:w-max  flex justify-end items-end">
                        {codesWithErrors?.length ? (
                            <button
                                onClick={() => {
                                    const blob = new Blob([codesWithErrors.join('\n')], { type: 'text/plain' })
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = `${codesWithErrors?.length}_codigos_com_erros-${new Date().getTime()}.txt`
                                    a.click()
                                    URL.revokeObjectURL(url)
                                }}
                                className="w-full md:w-max md:min-w-96 mt-4 bg-red-500 text-white py-2 px-4 hover:bg-white hover:text-red-500 border-2 border-red-500 text-xl"
                            >
                                {codesWithErrors?.length} (
                                {codesWithErrors?.length > 1 ? 'códigos com erro' : 'código com erros'}) - BAIXAR
                                CÓDIGOS COM ERROS
                            </button>
                        ) : null}
                    </div>
                </div>
                {thereAreExistingBooks?.length ? (
                    <div
                        className="w-full max-w-[85%] mx-auto bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 mt-8"
                        role="alert"
                    >
                        <p className="font-bold">Informação</p>
                        <p>Os livros com os seguintes códigos ISBN já foram cadastrados anteriormente:</p>
                        <ul className="list-disc list-inside">
                            {thereAreExistingBooks.map((isbn, index) => (
                                <li key={index}>{isbn}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
                {codesWithErrors?.length ? (
                    <div
                        className="w-full max-w-[85%] mx-auto bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 mt-8"
                        role="alert"
                    >
                        <p className="font-bold">Atenção</p>
                        <p>
                            Alguns códigos não são válidos para a Brasil API. Considere tentar outra API para obter os
                            dados.
                        </p>
                        <p>
                            <a
                                className="text-blue-500 underline"
                                href={getCodesWithErrrosUrl()}
                                download={`${codesWithErrors?.length}_codigos_com_erros-${new Date().getTime()}.txt`}
                            >
                                Consulte os códigos com erros.
                            </a>
                        </p>
                        <p>
                            {'Ao clicar em "CADASTRAR TODOS", apenas os livros com códigos válidos serão cadastrados.'}
                        </p>
                    </div>
                ) : null}
                <div className="w-full h-full p-8 mx-auto flex flex-wrap gap-4">
                    <BackToTopButton />
                    {booksInformations?.map((book, index) => {
                        return (
                            <div key={book?.title + index} className="w-full h-full p-8 max-w-160 mx-auto border">
                                <div className="flex flex-col">
                                    <div className="p-8">
                                        <Img
                                            src={`${(book as unknown as GoogleApiBooks)?.imageLinks?.thumbnail ?? '/images/empty-book.png'}`}
                                            alt="capa do livro"
                                            width={250}
                                            className="mb-4"
                                        />
                                    </div>
                                    <BookCreateFormFromList
                                        setBooksInformations={setBooksInformations}
                                        isbn={+book?.isbn}
                                        title={book?.title}
                                        subtitle={book?.subtitle}
                                        author={book?.authors?.join(', ')}
                                        description={(book as unknown as GoogleApiBooks)?.description}
                                        image={(book as unknown as GoogleApiBooks)?.imageLinks?.thumbnail as string}
                                        amount={1}
                                        category={book?.subjects?.join(', ')}
                                        place=""
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full p-8 max-w-185 mx-auto">
            <div className="flex flex-col justify-center items-center">
                <button
                    className={`
                        mt-4 ${apiSelected.brasilapi && loading ? 'border-4 border-green-500' : ''} w-80 bg-primary text-white py-2 px-4 hover:bg-white hover:text-primary border-2 border-primary text-xl flex justify-center items-center}
                    `}
                >
                    Brasil API
                    {apiSelected.brasilapi && (
                        <div className="ml-4">
                            <AiOutlineLoading3Quarters className="animate-spin text-white text-2xl" />
                        </div>
                    )}
                </button>
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Progresso da busca</h2>
                        <p className="mb-2">Procurando livros...</p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                            <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{
                                    width: `${(countCodeItems / codes.length) * 100}%`
                                }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                            {countCodeItems} de {codes.length} códigos verificados
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default function SearchPage(): React.ReactNode {
    return (
        <Suspense>
            <SearchPageImpl />
        </Suspense>
    )
}
