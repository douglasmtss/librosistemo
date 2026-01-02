/* eslint-disable camelcase */
'use client'
import { api } from '@/services/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useToastify } from '@/hooks/useToastify'

type UserEditFormProps = {
    rowIndex: string
} & User

export default function UserEditForm(props: UserEditFormProps): JSX.Element {
    const { id, first_name, last_name, phone } = props
    const [value, setValue] = useState({ first_name, last_name, phone })

    const router = useRouter()

    const { toast } = useToastify()

    const handleSubmit = async (user: User): Promise<void> => {
        if (!id) return

        await api.sheet.users
            .put(id, user)
            .then(response => {
                if (response?.status === 200) {
                    toast('Alterações salvas com sucesso!', 'success')
                    router.push('/pages/dashboard/users')
                } else {
                    toast('Alterações não foram salvas!', 'warning')
                }
            })
            .catch(error => {
                toast('Erro ao tentar salvar as alterações', 'error')
                console.error('Error trying save changes', error)
            })
    }

    useEffect(() => {
        setValue({ first_name, last_name, phone })
    }, [first_name, last_name, phone])

    return (
        <div className="p-8">
            <h2 className="text-2xl">Formulário de Edição</h2>
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
                <Link href={'/pages/dashboard'} className="py-4 px-8 rounded-lg bg-primary text-white font-semibold">
                    Cancelar
                </Link>

                <button
                    className="py-4 px-8 rounded-lg bg-primary text-white font-semibold"
                    onClick={() => handleSubmit(value)}
                >
                    Salvar
                </button>
            </div>
        </div>
    )
}
