'use client'
import { BackButton } from '@/components/BackButton'
import Link from 'next/link'
import { useState } from 'react'

export default function List(): JSX.Element {
    const [inputValue, setInputValue] = useState('')
    const [codes, setCodes] = useState<string[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        if (e?.target?.value && e?.target?.value?.includes('\n')) {
            const codes = e.target.value.split('\n')
            setCodes(codes)

            setInputValue(e.target.value)
        }
    }

    const handleSearch = (): void => {
        window.location.href = `/pages/dashboard/book-registration/list_isbn?list_isbn=${JSON.stringify(codes)}`
    }

    return (
        <div className="flex flex-col justify-center items-center p-8 w-full max-w-[740px] mx-auto">
            <BackButton classNameContainer="mb-8" />
            <h2>Digite ou cole uma lista de códigos ISBN</h2>
            <h3>Deve haver apenas um código por linha</h3>
            <textarea
                value={inputValue}
                placeholder={`9788570460097\n9788570460097\n9788570460097`}
                className="border-2 border-gray-400 rounded-md p-2 my-2 w-full h-48"
                onChange={handleChange}
            />
            <div className="w-full flex justify-between items-center">
                <Link
                    href={`/pages/dashboard/book-registration`}
                    className="py-4 px-8 rounded-lg bg-primary text-white font-semibold"
                >
                    Cancelar
                </Link>

                {inputValue ? (
                    <button
                        onClick={handleSearch}
                        // href={`/pages/dashboard/book-registration/${inputValue}`}
                        className="py-4 px-8 rounded-lg bg-primary text-white font-semibold border-none"
                    >
                        Pesquisar
                    </button>
                ) : (
                    <button disabled className="py-4 px-8 rounded-lg bg-primary text-white font-semibold opacity-45">
                        Pesquisar
                    </button>
                )}
            </div>
        </div>
    )
}
