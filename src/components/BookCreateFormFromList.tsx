'use client'
import { useState } from 'react'
import { api } from '@/services/api'
import { useToastify } from '@/hooks/useToastify'
import { SelectPhoto } from './SelectPhoto'
import { ImCamera } from 'react-icons/im'
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

import { v4 as uuidv4 } from 'uuid'

export type BookCreateFormProps = {
    setBooksInformations: React.Dispatch<React.SetStateAction<BrasilapiBook[]>>
} & Book

export default function BookCreateFormFromList(props: BookCreateFormProps): React.ReactNode {
    const {
        isbn = '',
        title = '',
        subtitle = '',
        author = '',
        description = '',
        image = '',
        amount = 1,
        category = '',
        place = '',
        setBooksInformations
    } = props

    const [value, setValue] = useState<Book>({
        isbn: +isbn,
        title,
        subtitle,
        author,
        description,
        image,
        amount,
        category,
        place
    })
    const [getPhoto, setGetPhoto] = useState<boolean>(false)

    const { toast } = useToastify()

    const handleSubmit = async (book: Book): Promise<void> => {
        const booksSaved = await api.sheet.books.get()
        if (booksSaved?.length > 0) {
            const bookExists = booksSaved?.some(b => +b?.isbn === +book?.isbn)

            if (bookExists) {
                toast('Livro com o mesmo código ISBN já cadastrado!', 'error')

                return
            }
        }
        await api.sheet.books
            .post({
                ...book,
                id: uuidv4(),
                status: 'available'
            })
            .then(response => {
                if (response.status === 200) {
                    setBooksInformations(prev => prev.filter(b => +b.isbn !== +book.isbn))
                    toast('Livro cadastrado com sucesso!', 'success')
                }
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
                    <TextInput
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
                    <TextInput
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
                    <TextInput
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
                    <TextInput
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
                    <TextInput
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
                        <ImageInput
                            type="text"
                            name="image"
                            id="image"
                            placeholder="Url da Imagem ou tire uma foto"
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
                    <TextInput
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
                    <TextInput
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
            </Form>

            <FormActions>
                <CancelLink href={'/pages/dashboard/book-registration'}>Cancelar</CancelLink>

                <SubmitButton onClick={() => handleSubmit(value)}>Cadastrar</SubmitButton>
            </FormActions>
        </FormContainer>
    )
}
