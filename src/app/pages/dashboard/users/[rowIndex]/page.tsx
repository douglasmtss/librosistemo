'use client'
import UserEditForm from '@/components/UserEditForm'
import { BackButton } from '@/components/BackButton'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

interface EditUserProps {
    params: {
        rowIndex: string
    }
}
export default function EditUser({ params }: EditUserProps): JSX.Element {
    const [users, setUsers] = useState<User[]>([])
    const user = users.find((_, i) => +params.rowIndex === i) as User

    useEffect(() => {
        api.sheet.users.get().then(data => {
            setUsers(data)
        })
    }, [])

    return (
        <>
            <BackButton classNameContainer="ml-8 mb-8" />
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
