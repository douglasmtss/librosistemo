'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { ImCamera } from 'react-icons/im'
import { SelectPhoto } from '@/components/SelectPhoto'
import { useToastify } from '@/hooks/useToastify'
import styled from 'styled-components'

import { v4 as uuidv4 } from 'uuid'
import { BackButton } from '@/components/BackButton'

const initialState: Book = {
    isbn: 0,
    title: '',
    subtitle: '',
    author: '',
    description: '',
    category: '',
    image: '',
    amount: 1,
    place: ''
}

export default function ManualRegister(): React.ReactNode {
    const [value, setValue] = useState<Book>(initialState)
    const [getPhoto, setGetPhoto] = useState<boolean>(false)

    const { toast } = useToastify()

    const router = useRouter()

    const handleSubmit = async (): Promise<void> => {
        await api.sheet.books
            .post({
                ...value,
                id: uuidv4(),
                status: 'available'
            })
            .then(response => {
                if (response.status === 200) {
                    toast('Livro cadastrado com sucesso', 'success')
                    router.push('/pages/dashboard')
                } else {
                    toast('Não foi possível cadastrar o livro', 'warning')
                }
            })
            .catch(error => {
                console.error('Error trying register book manually', error)
                toast('Erro ao tentar cadastrar o livro', 'error')
            })
    }

    const handleSave = (image: string): void => {
        setValue({
            ...value,
            image
        })
        setGetPhoto(false)
    }

    return (
        <PageContainer>
            <BackButtonWrapper>
                <BackButton />
            </BackButtonWrapper>
            <PageTitle>Cadastro manual</PageTitle>
            {getPhoto && <SelectPhoto onCancel={() => setGetPhoto(false)} onSave={handleSave} />}
            <RegisterForm>
                <label htmlFor="isbn">
                    ISBN
                    <FormInput
                        type="text"
                        name="isbn"
                        id="isbn"
                        placeholder="ISBN"
                        value={value.isbn}
                        onChange={e =>
                            setValue({
                                ...value,
                                isbn: +e.target.value
                            })
                        }
                    />
                </label>
                <label htmlFor="title">
                    Título
                    <FormInput
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Título"
                        value={value.title}
                        onChange={e =>
                            setValue({
                                ...value,
                                title: e.target.value
                            })
                        }
                    />
                </label>
                <label htmlFor="subtitle">
                    Subtítulo
                    <FormInput
                        type="text"
                        name="subtitle"
                        id="subtitle"
                        placeholder="Subtítulo"
                        value={value.subtitle}
                        onChange={e =>
                            setValue({
                                ...value,
                                subtitle: e.target.value
                            })
                        }
                    />
                </label>
                <label htmlFor="author">
                    Autor
                    <FormInput
                        type="text"
                        name="author"
                        id="author"
                        placeholder="Autor"
                        value={value.author}
                        onChange={e =>
                            setValue({
                                ...value,
                                author: e.target.value
                            })
                        }
                    />
                </label>
                <label htmlFor="description">
                    Descrição
                    <FormInput
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Descrição"
                        value={value.description}
                        onChange={e =>
                            setValue({
                                ...value,
                                description: e.target.value
                            })
                        }
                    />
                </label>
                <label htmlFor="category">
                    Categoria
                    <FormInput
                        type="text"
                        name="category"
                        id="category"
                        placeholder="Categoria"
                        value={value.category}
                        onChange={e =>
                            setValue({
                                ...value,
                                category: e.target.value
                            })
                        }
                    />
                </label>
                <label htmlFor="image">
                    Imagem
                    <ImageFieldRow>
                        <ImageUrlInput
                            type="text"
                            name="image"
                            id="image"
                            placeholder="Url da Imagem"
                            value={value.image}
                            onChange={e =>
                                setValue({
                                    ...value,
                                    image: e.target.value
                                })
                            }
                        />
                        <CameraButton
                            onClick={e => {
                                e.preventDefault()
                                setGetPhoto(true)
                            }}
                        >
                            <ImCamera />
                        </CameraButton>
                    </ImageFieldRow>
                </label>
                <label htmlFor="amount">
                    Quantidade
                    <FormInput
                        type="number"
                        name="amount"
                        id="amount"
                        placeholder="Quantidade"
                        value={value.amount}
                        onChange={e =>
                            setValue({
                                ...value,
                                amount: +e.target.value
                            })
                        }
                    />
                </label>
                <label htmlFor="place">
                    Local
                    <FormInput
                        type="text"
                        name="place"
                        id="place"
                        placeholder="Local/ estante/ prateleira"
                        value={value.place}
                        onChange={e =>
                            setValue({
                                ...value,
                                place: e.target.value
                            })
                        }
                    />
                </label>
            </RegisterForm>

            <ActionsRow>
                <CancelLink href={'/pages/dashboard/book-registration'}>Cancelar</CancelLink>

                <SubmitButton onClick={handleSubmit}>Cadastrar</SubmitButton>
            </ActionsRow>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    padding: 32px;
    width: 100%;
    max-width: 740px;
    margin-left: auto;
    margin-right: auto;
`

const BackButtonWrapper = styled.div`
    margin-bottom: 32px;
`

const PageTitle = styled.h2`
    font-size: 24px;
    line-height: 32px;
`

const RegisterForm = styled.form`
    margin-top: 16px;
`

const FormInput = styled.input`
    border: 2px solid #9ca3af;
    border-radius: 6px;
    padding: 8px;
    width: 100%;
    height: 40px;
    margin-bottom: 16px;
`

const ImageFieldRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
`

const ImageUrlInput = styled(FormInput)`
    margin-bottom: 0;
`

const CameraButton = styled.button`
    height: 40px;
    padding: 8px 16px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    margin-left: 8px;
    cursor: pointer;
    color: var(--color-white);
`

const ActionsRow = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`

const CancelLink = styled(Link)`
    padding: 16px 32px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    color: var(--color-white);
    font-weight: 600;
`

const SubmitButton = styled.button`
    padding: 16px 32px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    color: var(--color-white);
    font-weight: 600;
`
