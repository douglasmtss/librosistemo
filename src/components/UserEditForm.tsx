'use client'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useToastify } from '@/hooks/useToastify'
import { CancelLink, Form, FormActions, FormContainer, FormTitle, SubmitButton, TextInput } from './formStyles'

type UserEditFormProps = {
    rowIndex: string
} & User

export default function UserEditForm(props: UserEditFormProps): React.ReactNode {
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
        async function setInitialValues(): Promise<void> {
            setValue({ first_name, last_name, phone })
        }

        setInitialValues()
    }, [first_name, last_name, phone])

    return (
        <FormContainer>
            <FormTitle>Formulário de Edição</FormTitle>
            <Form>
                <label htmlFor="first_name">
                    Primeiro nome
                    <TextInput
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
                    />
                </label>
                <label htmlFor="last_name">
                    Sobrenome
                    <TextInput
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
                    />
                </label>
                <label htmlFor="phone">
                    Telefone
                    <TextInput
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
