'use client'
import UserEditForm from '@/components/UserEditForm'
import { BackButton } from '@/components/BackButton'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import styled from 'styled-components'

interface EditUserProps {
    params: {
        rowIndex: string
    }
}
export default function EditUser({ params }: EditUserProps): React.ReactNode {
    const [users, setUsers] = useState<User[]>([])
    const user = users.find((_, i) => +params.rowIndex === i) as User

    useEffect(() => {
        api.sheet.users.get().then(data => {
            setUsers(data)
        })
    }, [])

    return (
        <>
            <PositionedBackButton />
            <UserEditForm
                id={user?.id}
                rowIndex={params?.rowIndex}
                first_name={user?.first_name}
                last_name={user?.last_name}
                phone={user?.phone}
            />
        </>
    )
}

const BackButtonWithClassName = ({ className }: { className?: string }): React.ReactNode => (
    <BackButton classNameContainer={className} />
)

const PositionedBackButton = styled(BackButtonWithClassName)`
    margin-left: 32px;
    margin-bottom: 32px;
`
