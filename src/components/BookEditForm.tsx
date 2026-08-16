'use client'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ImCamera } from 'react-icons/im'
import { SelectPhoto } from './SelectPhoto'
import { useToastify } from '@/hooks/useToastify'
import {
    CameraButton,
    CancelLink,
    Form,
    FormActions,
    FormContainer,
    FormTitle,
    ImageFieldRow,
    ImageInput,
    SubmitButton,
    TextInput
} from './formStyles'

export type BookEditFormProps = {
    rowIndex: string
} & Book

export default function BookEditForm(props: BookEditFormProps): React.ReactNode {
    const { id } = props

    const [value, setValue] = useState({ ...props })
    const [getPhoto, setGetPhoto] = useState<boolean>(false)

    const router = useRouter()

    const { toast } = useToastify()

    const handleSubmit = async (book: Book): Promise<void> => {
        if (!id) return

        await api.sheet.books
            .put(id, book)
            .then(response => {
                if (response?.status === 200) {
                    toast('Alterações salvas com sucesso!', 'success')
                    router.push('/pages/dashboard')
                } else {
                    toast('Alterações não foram salvas!', 'warning')
                }
            })
            .catch(error => {
                toast('Erro ao tentar salvar as alterações', 'error')
                console.error('Error trying save chamges', error)
            })
    }

    const handleSave = (image: string): void => {
        setValue({
            ...value,
            image
        })
        setGetPhoto(false)
        toast('Imagem selecionada com sucesso!', 'info')
    }

    useEffect(() => {
        async function handleInitValue(): Promise<void> {
            setValue({ ...props })
        }
        handleInitValue()
    }, [props])

    return (
        <FormContainer>
            <FormTitle>Formulário de Edição</FormTitle>
            {getPhoto && <SelectPhoto onCancel={() => setGetPhoto(false)} onSave={handleSave} />}
            <Form>
                <label htmlFor="isbn">
                    ISBN
                    <TextInput
                        type="text"
                        name="isbn"
                        id="isbn"
                        placeholder="ISBN"
                        value={value.isbn ?? ''}
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
                    <TextInput
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Título"
                        value={value.title ?? ''}
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
                    <TextInput
                        type="text"
                        name="subtitle"
                        id="subtitle"
                        placeholder="Subtítulo"
                        value={value.subtitle ?? ''}
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
                    <TextInput
                        type="text"
                        name="author"
                        id="author"
                        placeholder="Autor"
                        value={value.author ?? ''}
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
                    <TextInput
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Descrição"
                        value={value.description ?? ''}
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
                    <TextInput
                        type="text"
                        name="category"
                        id="category"
                        placeholder="Categoria"
                        value={value.category ?? ''}
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
                        <ImageInput
                            type="text"
                            name="image"
                            id="image"
                            placeholder="Url da Imagem"
                            value={value.image ?? ''}
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
                    <TextInput
                        type="number"
                        name="amount"
                        id="amount"
                        placeholder="Quantidade"
                        value={value.amount ?? ''}
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
                    <TextInput
                        type="text"
                        name="place"
                        id="place"
                        placeholder="Local/ estante/ prateleira"
                        value={value.place ?? ''}
                        onChange={e =>
                            setValue({
                                ...value,
                                place: e.target.value
                            })
                        }
                    />
                </label>
            </Form>

            <FormActions>
                <CancelLink href={'/pages/dashboard'}>Cancelar</CancelLink>

                <SubmitButton onClick={() => handleSubmit(value)}>Salvar</SubmitButton>
            </FormActions>
        </FormContainer>
    )
}
