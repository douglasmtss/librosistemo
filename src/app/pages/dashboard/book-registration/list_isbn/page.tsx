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
import { ISBN_LOOKUP_DELAY_MS } from '@/services/api'
import { BackToTopButton } from '@/components/BackToTopButton'
import styled, { keyframes } from 'styled-components'

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
                setRemainingTime(ISBN_LOOKUP_DELAY_MS / 1000)
                // Wait 60 seconds between each chunk because Google API has a limit of 60 requests per minute
                await new Promise(resolve => setTimeout(resolve, ISBN_LOOKUP_DELAY_MS))
                setRemainingTime(0)
                setLoadingPost(false)

                toast(`${chunk.length} livros foram cadastrados com sucesso`, 'success')
            }

            if (countItems === booksInformations.length) {
                toast(`Todos os livros foram cadastrados com sucesso`, 'success')

                setTimeout(() => {
                    setBooksInformations([])
                    setSended(true)
                    router.push('/pages/dashboard/books')
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
                <BackButtonOffsetLeft />
                <Empty />
            </>
        )
    }

    if (booksInformations?.length) {
        return (
            <PageContainer>
                {loadingPost && (
                    <ModalOverlay>
                        <ModalBox>
                            <ModalTitle>Progresso do Cadastro</ModalTitle>
                            <ModalText>Cadastrando livros...</ModalText>
                            <ProgressTrack>
                                <ProgressFill
                                    style={{
                                        width: `${(countItems / filteredByUnique.length) * 100}%`
                                    }}
                                ></ProgressFill>
                            </ProgressTrack>
                            <ProgressLabel>
                                {countItems} de {filteredByUnique.length} livros cadastrados
                            </ProgressLabel>
                            {remainingTime ? (
                                <ProgressNote>
                                    Continuaremos o cadastro em: {remainingTime}s (Limite da API do Google)
                                </ProgressNote>
                            ) : null}
                        </ModalBox>
                    </ModalOverlay>
                )}
                <HeaderRow>
                    <HeaderInfo>
                        <BackButtonSpacedBottom />
                        <h2>Resultado da pesquisa</h2>
                        <span>Verifique se está correto antes de cadastrar</span>
                    </HeaderInfo>
                    <RegisterActionWrapper>
                        <RegisterAllButton onClick={handleRegisterAll}>
                            {booksInformations?.length} (
                            {booksInformations?.length > 1 ? 'livros encontrados' : 'livro encontrado'}) - CADASTRAR
                            TODOS
                        </RegisterAllButton>
                    </RegisterActionWrapper>
                    <ErrorsActionWrapper>
                        {codesWithErrors?.length ? (
                            <DownloadErrorsButton
                                onClick={() => {
                                    const blob = new Blob([codesWithErrors.join('\n')], { type: 'text/plain' })
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = `${codesWithErrors?.length}_codigos_com_erros-${new Date().getTime()}.txt`
                                    a.click()
                                    URL.revokeObjectURL(url)
                                }}
                            >
                                {codesWithErrors?.length} (
                                {codesWithErrors?.length > 1 ? 'códigos com erro' : 'código com erros'}) - BAIXAR
                                CÓDIGOS COM ERROS
                            </DownloadErrorsButton>
                        ) : null}
                    </ErrorsActionWrapper>
                </HeaderRow>
                {thereAreExistingBooks?.length ? (
                    <InfoAlert role="alert">
                        <BoldText>Informação</BoldText>
                        <p>Os livros com os seguintes códigos ISBN já foram cadastrados anteriormente:</p>
                        <DiscList>
                            {thereAreExistingBooks.map((isbn, index) => (
                                <li key={index}>{isbn}</li>
                            ))}
                        </DiscList>
                    </InfoAlert>
                ) : null}
                {codesWithErrors?.length ? (
                    <WarningAlert role="alert">
                        <BoldText>Atenção</BoldText>
                        <p>
                            Alguns códigos não são válidos para a Brasil API. Considere tentar outra API para obter os
                            dados.
                        </p>
                        <p>
                            <ErrorsLink
                                href={getCodesWithErrrosUrl()}
                                download={`${codesWithErrors?.length}_codigos_com_erros-${new Date().getTime()}.txt`}
                            >
                                Consulte os códigos com erros.
                            </ErrorsLink>
                        </p>
                        <p>
                            {'Ao clicar em "CADASTRAR TODOS", apenas os livros com códigos válidos serão cadastrados.'}
                        </p>
                    </WarningAlert>
                ) : null}
                <BooksGrid>
                    <BackToTopButton />
                    {booksInformations?.map((book, index) => {
                        return (
                            <BookCard key={book?.title + index}>
                                <CardColumn>
                                    <CoverImageWrapper>
                                        <CoverImage
                                            src={`${(book as unknown as GoogleApiBooks)?.imageLinks?.thumbnail ?? '/images/empty-book.png'}`}
                                            alt="capa do livro"
                                            width={250}
                                        />
                                    </CoverImageWrapper>
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
                                </CardColumn>
                            </BookCard>
                        )
                    })}
                </BooksGrid>
            </PageContainer>
        )
    }

    return (
        <LoadingContainer>
            <CenteredColumn>
                <BrasilApiButton $highlighted={apiSelected.brasilapi && loading}>
                    Brasil API
                    {apiSelected.brasilapi && (
                        <SpinnerWrapper>
                            <SpinnerIcon />
                        </SpinnerWrapper>
                    )}
                </BrasilApiButton>
                <ModalOverlay>
                    <ModalBox>
                        <ModalTitle>Progresso da busca</ModalTitle>
                        <ModalText>Procurando livros...</ModalText>
                        <ProgressTrack>
                            <ProgressFill
                                style={{
                                    width: `${(countCodeItems / codes.length) * 100}%`
                                }}
                            ></ProgressFill>
                        </ProgressTrack>
                        <ProgressLabel>
                            {countCodeItems} de {codes.length} códigos verificados
                        </ProgressLabel>
                    </ModalBox>
                </ModalOverlay>
            </CenteredColumn>
        </LoadingContainer>
    )
}
export default function SearchPage(): React.ReactNode {
    return (
        <Suspense>
            <SearchPageImpl />
        </Suspense>
    )
}

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: 768px) {
        padding: 32px;
    }
`

const BackButtonOffsetLeft = styled(BackButton)`
    margin-left: 32px;
`

const BackButtonSpacedBottom = styled(BackButton)`
    margin-bottom: 32px;
`

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
`

const ModalBox = styled.div`
    background-color: var(--color-white);
    padding: 32px;
    border-radius: var(--radius-md);
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -4px rgba(0, 0, 0, 0.1);
    width: 384px;
`

const ModalTitle = styled.h2`
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
    margin-bottom: 16px;
`

const ModalText = styled.p`
    margin-bottom: 8px;
`

const ProgressTrack = styled.div`
    width: 100%;
    background-color: var(--color-gray-200);
    border-radius: 9999px;
    height: 16px;
    margin-bottom: 16px;
`

const ProgressFill = styled.div`
    background-color: #3b82f6;
    height: 16px;
    border-radius: 9999px;
`

const ProgressLabel = styled.p`
    font-size: 14px;
    line-height: 20px;
    color: #4b5563;
`

const ProgressNote = styled(ProgressLabel)`
    margin-top: 8px;
`

const HeaderRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    padding-left: 32px;
    padding-right: 32px;

    @media (min-width: 768px) {
        padding-left: 112px;
        padding-right: 112px;
    }

    @media (min-width: 1024px) {
        flex-direction: row;
    }
`

const HeaderInfo = styled.div`
    width: 100%;
`

const RegisterActionWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;

    @media (min-width: 768px) {
        width: max-content;
    }

    @media (min-width: 1024px) {
        margin-right: 32px;
    }
`

const ErrorsActionWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;

    @media (min-width: 768px) {
        width: max-content;
    }
`

const RegisterAllButton = styled.button`
    width: 100%;
    margin-top: 16px;
    background-color: #3b82f6;
    color: var(--color-white);
    padding: 8px 16px;
    border: 2px solid #3b82f6;
    font-size: 20px;
    line-height: 28px;

    &:hover {
        background-color: var(--color-white);
        color: #3b82f6;
    }

    @media (min-width: 768px) {
        width: max-content;
    }
`

const DownloadErrorsButton = styled.button`
    width: 100%;
    margin-top: 16px;
    background-color: var(--color-danger);
    color: var(--color-white);
    padding: 8px 16px;
    border: 2px solid var(--color-danger);
    font-size: 20px;
    line-height: 28px;

    &:hover {
        background-color: var(--color-white);
        color: var(--color-danger);
    }

    @media (min-width: 768px) {
        width: max-content;
        min-width: 384px;
    }
`

const InfoAlert = styled.div`
    width: 100%;
    max-width: 85%;
    margin: 32px auto 16px;
    background-color: #dbeafe;
    border-left: 4px solid #3b82f6;
    color: #1d4ed8;
    padding: 16px;
`

const WarningAlert = styled.div`
    width: 100%;
    max-width: 85%;
    margin: 32px auto 16px;
    background-color: #fef9c3;
    border-left: 4px solid #eab308;
    color: #a16207;
    padding: 16px;
`

const BoldText = styled.p`
    font-weight: 700;
`

const DiscList = styled.ul`
    list-style-type: disc;
    list-style-position: inside;
`

const ErrorsLink = styled.a`
    color: #3b82f6;
    text-decoration-line: underline;
`

const BooksGrid = styled.div`
    width: 100%;
    height: 100%;
    padding: 32px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
`

const BookCard = styled.div`
    width: 100%;
    height: 100%;
    padding: 32px;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid var(--color-gray-200);
`

const CardColumn = styled.div`
    display: flex;
    flex-direction: column;
`

const CoverImageWrapper = styled.div`
    padding: 32px;
`

const CoverImage = styled(Img)`
    margin-bottom: 16px;
`

const LoadingContainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 32px;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
`

const CenteredColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const BrasilApiButton = styled.button<{ $highlighted: boolean }>`
    margin-top: 16px;
    width: 320px;
    background-color: var(--color-primary);
    color: var(--color-white);
    padding: 8px 16px;
    border: 2px solid var(--color-primary);
    font-size: 20px;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: var(--color-white);
        color: var(--color-primary);
    }

    ${({ $highlighted }): string => ($highlighted ? 'border-width: 4px; border-color: var(--color-success);' : '')}
`

const SpinnerWrapper = styled.div`
    margin-left: 16px;
`

const SpinnerIcon = styled(AiOutlineLoading3Quarters)`
    animation: ${spin} 1s linear infinite;
    color: var(--color-white);
    font-size: 24px;
`
