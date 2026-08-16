'use client'
import { services } from '@/services/api'
import { Empty } from '@/components/Empty'
import { useEffect, useState } from 'react'
import BookCreateForm from '@/components/BookCreateForm'
import { Img } from '@/components/Img'
import { useToastify } from '@/hooks/useToastify'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BackButton } from '@/components/BackButton'
import styled, { keyframes } from 'styled-components'

interface SearchPageProps {
    params: {
        isbn: string
    }
}
export default function SearchPage({ params }: SearchPageProps): React.ReactNode {
    const [bookInfo, setBookInfo] = useState<GoogleApiBooks | Record<string, never>>({})
    const [loading, setLoading] = useState(true)

    const [apiSelected, setApiSelected] = useState({
        google: false,
        brasilapi: false
    })

    const { toast } = useToastify()

    const searchFromBrasilApi = async (code: string): Promise<void> => {
        await services
            .brasilapi(code)
            .then(bookDetails => {
                const parsed = {
                    ...bookDetails,
                    imageLinks: {
                        thumbnail: bookDetails?.cover_url
                    },
                    categories: bookDetails?.subjects?.join(', '),
                    authors: bookDetails?.authors?.join(', ')
                } as unknown as GoogleApiBooks
                setBookInfo(parsed)
                setLoading(false)
                toast('Livro encontrado!', 'success')
            })
            .catch(error => {
                setLoading(false)
                console.error('Error trying fetch brasilapi ', error)
                toast('Erro ao tentar pesquisar livro', 'error')
            })
    }

    useEffect(() => {
        async function setInitialValues(): Promise<void> {
            setApiSelected({
                google: false,
                brasilapi: true
            })
            setLoading(true)
        }
        setInitialValues()
        searchFromBrasilApi(params.isbn)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!bookInfo?.title && !loading) {
        return (
            <>
                <BackButtonOffsetLeft />
                <Empty />
            </>
        )
    }

    if (bookInfo?.title) {
        return (
            <PageContainer>
                <BackButtonSpacedBottom />
                <h2>Resultado da pesquisa</h2>
                <span>Verifique se está correto antes de cadastrar</span>
                <FormColumn>
                    <CoverImageWrapper>
                        <CoverImage
                            src={`${bookInfo?.imageLinks?.thumbnail ?? '/images/empty-book.png'}`}
                            alt="capa do livro"
                            width={250}
                        />
                    </CoverImageWrapper>
                    <BookCreateForm
                        isbn={+params?.isbn}
                        title={bookInfo?.title}
                        subtitle={bookInfo?.subtitle}
                        author={String(bookInfo?.authors)}
                        description={bookInfo?.description}
                        image={bookInfo?.imageLinks?.thumbnail as string}
                        amount={1}
                        category={String(bookInfo?.categories)}
                        place=""
                    />
                </FormColumn>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <CenteredColumn>
                <BrasilApiButton $highlighted={apiSelected.brasilapi && loading}>
                    Brasil API
                    {apiSelected.brasilapi && (
                        <SpinnerWrapper>
                            <SpinnerIcon />
                        </SpinnerWrapper>
                    )}
                </BrasilApiButton>
            </CenteredColumn>
        </PageContainer>
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
    padding: 32px;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
`

const BackButtonOffsetLeft = styled(BackButton)`
    margin-left: 32px;
`

const BackButtonSpacedBottom = styled(BackButton)`
    margin-bottom: 32px;
`

const FormColumn = styled.div`
    display: flex;
    flex-direction: column;
`

const CoverImageWrapper = styled.div`
    padding: 32px;
`

const CoverImage = styled(Img)`
    margin-bottom: 16px;
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
