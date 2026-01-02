'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { useToastify } from '@/hooks/useToastify'
import { v4 as uuidv4 } from 'uuid'
import { BackButton } from '@/components/BackButton'

const initialState: User = {
    first_name: '',
    last_name: '',
    phone: ''
}

export default function UserRegister(): JSX.Element {
    const [value, setValue] = useState<User>(initialState)

    const { toast } = useToastify()

    const router = useRouter()

    const handleSubmit = async (): Promise<void> => {
        await api.sheet.users
            .post({
                ...value,
                id: uuidv4()
            })
            .then(response => {
                if (response.status === 200) {
                    toast('Usuário cadastrado com sucesso', 'success')
                    router.push('/pages/dashboard/users')
                } else {
                    toast('Não foi possível cadastrar o usuário', 'warning')
                }
            })
            .catch(error => {
                console.error('Error trying register user', error)
                toast('Erro ao tentar cadastrar o usuário', 'error')
            })
    }

    return (
        <div className="p-8 w-full max-w-[740px] mx-auto">
            <BackButton classNameContainer="mb-8" />
            <h2 className="text-2xl">Cadastro de usuário</h2>
            <form className="mt-4">
                <label htmlFor="first_name">
                    Primeiro nome
                    <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder="Primeiro nome"
                        value={value.first_name}
                        onChange={e =>
                            setValue({
                                ...value,
                                first_name: e.target.value
                            })
                        }
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
                <label htmlFor="last_name">
                    Sobrenome
                    <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder="Sobrenome"
                        value={value.last_name}
                        onChange={e =>
                            setValue({
                                ...value,
                                last_name: e.target.value
                            })
                        }
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
                <label htmlFor="phone">
                    Telefone
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="Telefone"
                        value={value.phone}
                        onChange={e =>
                            setValue({
                                ...value,
                                phone: e.target.value
                            })
                        }
                        className="border-2 border-gray-400 rounded-md p-2 w-full h-10 mb-4"
                    />
                </label>
            </form>

            <div className="flex w-full justify-between items-center">
                <Link
                    href={'/pages/dashboard/users'}
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
