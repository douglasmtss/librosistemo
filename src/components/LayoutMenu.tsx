'use client'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { RxExit } from 'react-icons/rx'
import Link from 'next/link'
import { useState } from 'react'
import { configInfo } from '@/config/info'

const HamburgerAndCloser = dynamic(() => import('@/components/HamburgerAndCloser'), { ssr: false })
const AdminLink = dynamic(() => import('@/components/AdminLink'), { ssr: false })

export default function LayoutMenu(): React.ReactNode {
    const [show, setShow] = useState<boolean>(false)

    return (
        <ul className="flex items-center bg-primary w-full px-8 py-4">
            <li className="flex-1 flex text-white items-center">
                <Link href={'/'}>
                    <Image
                        src={configInfo.appLogo}
                        width={60}
                        height={60}
                        alt={configInfo.appName + ' logo'}
                        className="rounded-[100%] border-white border-2"
                    />
                </Link>
            </li>

            <li className="relative text-white">
                <HamburgerAndCloser className="md:opacity-0" show={show} setShow={setShow} />
                <div
                    id="menu-slider"
                    className={
                        !show
                            ? 'fixed top-0 right-0 z-10 w-64 md:w-[80%] h-full md:h-max bg-primary transform translate-x-full md:translate-x-0 transition-transform duration-300'
                            : 'fixed top-0 right-0 z-10 w-64 h-full bg-primary transform translate-x-0 transition-transform duration-300'
                    }
                >
                    <ul className="flex flex-col md:flex-row items-start md:gap-4 md:justify-end md:items-end md:w-full p-4 space-y-4 mt-16 md:mt-0">
                        <li>
                            <Link onClick={() => setShow(false)} href={'/'} className="text-white hover:underline">
                                INÍCIO
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={() => setShow(false)}
                                href="/pages/dashboard/books"
                                className="text-white hover:underline"
                            >
                                LIVROS
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={() => setShow(false)}
                                href="/pages/dashboard/users"
                                className="text-white hover:underline"
                            >
                                USUÁRIOS
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={() => setShow(false)}
                                href="/pages/dashboard/lends"
                                className="text-white hover:underline"
                            >
                                EMPRÉSTIMOS
                            </Link>
                        </li>
                        <li className="text-white uppercase hover:underline">
                            <AdminLink
                                onClick={() => setShow(false)}
                                beforeNavigate={{
                                    label: 'Administração',
                                    path: '/pages/dashboard'
                                }}
                                afterNavigate={{
                                    label: (
                                        <div className="flex">
                                            <span className="mr-2">Sair</span>{' '}
                                            <RxExit className="text-2xl" title="Sair" />
                                        </div>
                                    ),
                                    path: '/'
                                }}
                            />
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    )
}
