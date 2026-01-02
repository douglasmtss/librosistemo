'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { ImCamera } from 'react-icons/im'
import { SelectPhoto } from '@/components/SelectPhoto'
import { useToastify } from '@/hooks/useToastify'

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

export default function ManualRegister(): JSX.Element {
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
        <div className="p-8 w-full max-w-[740px] mx-auto">
            <BackButton classNameContainer="mb-8" />
            <h2 className="text-2xl">Cadastro manual</h2>
            {getPhoto && <SelectPhoto onCancel={() => setGetPhoto(false)} onSave={handleSave} />}
            <form className="mt-4">
                <label htmlFor="isbn">
                    ISBN
                    <input
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
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
                <label htmlFor="title">
                    Título
                    <input
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
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
                <label htmlFor="subtitle">
                    Subtítulo
                    <input
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
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
                <label htmlFor="author">
                    Autor
                    <input
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
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
                <label htmlFor="description">
                    Descrição
                    <input
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
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
                <label htmlFor="category">
                    Categoria
                    <input
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
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
                <label htmlFor="image">
                    Imagem
                    <div className="flex items-center mb-4">
                        <input
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
                            className="border-2 border-gray-400 rounded-md p-2 w-full h-10"
                        />
                        <button
                            className="h-10 py-2 px-4 rounded-lg bg-primary ml-2 cursor-pointer text-white"
                            onClick={e => {
                                e.preventDefault()
                                setGetPhoto(true)
                            }}
                        >
                            <ImCamera />
                        </button>
                    </div>
                </label>
                <label htmlFor="amount">
                    Quantidade
                    <input
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
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
                <label htmlFor="place">
                    Local
                    <input
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
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
            </form>

            <div className="flex w-full justify-between items-center">
                <Link
                    href={'/pages/dashboard/book-registration'}
                    className="py-4 px-8 rounded-lg bg-primary text-white font-semibold"
                >
                    Cancelar
                </Link>

                <button onClick={handleSubmit} className="py-4 px-8 rounded-lg bg-primary text-white font-semibold">
                    Cadastrar
                </button>
            </div>
        </div>
    )
}
