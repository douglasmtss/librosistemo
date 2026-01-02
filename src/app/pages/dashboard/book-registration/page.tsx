'use client'
import { BackButton } from '@/components/BackButton'
import Link from 'next/link'

export default function BookRegistration(): JSX.Element {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <BackButton />
            <div className="flex flex-col justify-center items-center w-[max-content]">
                <Link
                    href={'/pages/dashboard/book-registration/manual'}
                    className="py-2 px-4 bg-primary text-white rounded-md text-center w-full mt-8"
                >
                    Cadastro manual
                </Link>
                <Link
                    href={'/pages/dashboard/book-registration/typing'}
                    className="py-2 px-4 bg-primary text-white rounded-md text-center w-full mt-8"
                >
                    Digitar código ISBN
                </Link>
                <Link
                    href={'/pages/dashboard/book-registration/scanner'}
                    className="py-2 px-4 bg-primary text-white rounded-md text-center w-full mt-8"
                >
                    Escanear código ISBN
                </Link>
                <Link
                    href={'/pages/dashboard/book-registration/list'}
                    className="py-2 px-4 bg-primary text-white rounded-md text-center w-full mt-8"
                >
                    Carregar lista de códigos ISBN
                </Link>
            </div>
        </div>
    )
}
