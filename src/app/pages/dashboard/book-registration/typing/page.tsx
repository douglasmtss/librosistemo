'use client'
import { BackButton } from '@/components/BackButton'
import Link from 'next/link'
import { useState } from 'react'

export default function Typing(): JSX.Element {
    const [inputValue, setInputValue] = useState('')

    return (
        <div className="flex flex-col justify-center items-center p-8 w-full max-w-[740px] mx-auto">
            <BackButton classNameContainer="mb-8" />
            <h2>Digite o código ISBN</h2>
            <input
                type="number"
                value={inputValue}
                placeholder="123.45.678.912-3"
                className="border-2 border-gray-400 rounded-md p-2 my-2 w-full"
                onChange={e => setInputValue(e.target.value)}
            />
            <div className="w-full flex justify-between items-center">
                <Link
                    href={`/pages/dashboard/book-registration`}
                    className="py-4 px-8 rounded-lg bg-primary text-white font-semibold"
                >
                    Cancelar
                </Link>

                {inputValue ? (
                    <Link
                        href={`/pages/dashboard/book-registration/${inputValue}`}
                        className="py-4 px-8 rounded-lg bg-primary text-white font-semibold border-none"
                    >
                        Pesquisar
                    </Link>
                ) : (
                    <button disabled className="py-4 px-8 rounded-lg bg-primary text-white font-semibold opacity-45">
                        Pesquisar
                    </button>
                )}
            </div>
        </div>
    )
}
