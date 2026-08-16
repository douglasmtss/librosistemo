'use client'
import { BackButton } from '@/components/BackButton'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

interface LendViewProps {
    params: {
        rowIndex: string
    }
}
export default function LendView(props: LendViewProps): React.ReactNode {
    const { params } = props

    const [books, setBooks] = useState<Book[]>([])
    const [lends, setLends] = useState<Lend[]>([])
    const lend = lends.find((_, i) => +params.rowIndex === i) as Lend

    const handleDelete = async (id: string): Promise<void> => {
        await api.sheet.lends.delete(id).then(response => {
            if (response.status === 200) {
                const book = books.find(b => b.id === lend.book_id)
                const updatedBook = {
                    ...book,
                    status: 'available'
                } as Book
                api.sheet.books.put(`${book?.id}`, updatedBook)
                setLends(lends.filter(lend => lend?.id === id))
            }
        })
    }

    useEffect(() => {
        api.sheet.books.get().then(data => {
            setBooks(data)
        })
        api.sheet.lends.get().then(data => {
            setLends(data)
        })
    }, [])

    return (
        <PageContainer>
            <ContentContainer>
                <SpacedBackButton />
                <Title>Emprestimo</Title>

                <DetailRow>
                    <DetailLabel>Nome:</DetailLabel> {lend?.first_name}
                </DetailRow>
                <DetailRow>
                    <DetailLabel>Sobrenome:</DetailLabel> {lend?.last_name}
                </DetailRow>
                <DetailRow>
                    <DetailLabel>Livro:</DetailLabel> {lend?.book_title}
                </DetailRow>
                <DetailRow>
                    <DetailLabel>Data do empéstimo:</DetailLabel>{' '}
                    {lend?.created && new Date(lend?.created).toLocaleDateString()}
                </DetailRow>

                <DeleteButton onClick={() => handleDelete(`${lend?.id}`)}>Excluir</DeleteButton>
            </ContentContainer>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    width: 100%;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
`

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
`

const SpacedBackButton = styled(BackButton)`
    margin-bottom: 32px;
`

const Title = styled.h1`
    font-size: 24px;
    line-height: 32px;
`

const DetailRow = styled.span`
    margin-top: 8px;
    font-size: 20px;
    line-height: 28px;
`

const DetailLabel = styled.span`
    font-weight: 600;
`

const DeleteButton = styled.button`
    padding: 8px 16px;
    border-radius: 6px;
    color: var(--color-white);
    background-color: var(--color-danger);
    margin-top: 32px;
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
`
