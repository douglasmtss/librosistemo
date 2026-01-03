import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

import Link from 'next/link'

import { ToastContainer } from 'react-toastify'
import dynamic from 'next/dynamic'
import { configInfo } from '@/config/info'
import StyledComponentsRegistry from '@/lib/registry'
import { ReactNode } from 'react'

const LayoutMenu = dynamic(() => import('@/components/LayoutMenu'))

export const metadata = {
    title: configInfo.appName,
    description: configInfo.appDescription
}

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<ReactNode> {
    return (
        <html suppressHydrationWarning={true} lang="en">
            <body suppressHydrationWarning={true}>
                <StyledComponentsRegistry>
                    <ToastContainer />
                    <header className="w-full mb-10">
                        <LayoutMenu />
                    </header>

                    <div className="flex flex-col flex-1">{children}</div>

                    <footer className="w-full h-16  flex flex-col justify-center items-center bg-primary ">
                        <Link href={configInfo.appManual} target="__blank" className="underline text-white text-xl">
                            Manual
                        </Link>
                    </footer>
                </StyledComponentsRegistry>
            </body>
        </html>
    )
}
