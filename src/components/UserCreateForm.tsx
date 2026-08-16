'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { CancelLink, Form, FormActions, FormContainer, FormTitle, SubmitButton, TextInput } from './formStyles'

type UserCreateFormProps = User

export default function UserCreateForm(props: UserCreateFormProps): React.ReactNode {
    const { first_name, last_name, phone } = props

    const [value, setValue] = useState<User>({ first_name, last_name, phone })

    const router = useRouter()

    const handleSubmit = async (user: User): Promise<void> => {
        await api.sheet.users.post(user).then(response => {
            if (response.status === 200) {
                router.push('/pages/dashboard/users')
            }
        })
    }

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
                <CancelLink href={'/pages/dashboard/book-registration'}>Cancelar</CancelLink>

                <SubmitButton onClick={() => handleSubmit(value)}>Cadastrar</SubmitButton>
            </FormActions>
        </FormContainer>
    )
}
