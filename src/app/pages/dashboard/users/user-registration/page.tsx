'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { useToastify } from '@/hooks/useToastify'
import { v4 as uuidv4 } from 'uuid'
import { BackButton } from '@/components/BackButton'
import styled from 'styled-components'

const initialState: User = {
    first_name: '',
    last_name: '',
    phone: ''
}

export default function UserRegister(): React.ReactNode {
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
        <PageContainer>
            <PositionedBackButton />
            <Title>Cadastro de usuário</Title>
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

            <ActionsRow>
                <CancelLink href={'/pages/dashboard/users'}>Cancelar</CancelLink>

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

const BackButtonWithClassName = ({ className }: { className?: string }): React.ReactNode => (
    <BackButton classNameContainer={className} />
)

const PositionedBackButton = styled(BackButtonWithClassName)`
    margin-bottom: 32px;
`

const Title = styled.h2`
    font-size: 24px;
    line-height: 32px;
`

const Form = styled.form`
    margin-top: 16px;
`

const TextInput = styled.input`
    /* gray-400 do Tailwind não tem token em globals.css; hex mantido para preservar o visual */
    border: 2px solid #9ca3af;
    border-radius: 6px;
    padding: 8px;
    width: 100%;
    height: 40px;
    margin-bottom: 16px;
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
