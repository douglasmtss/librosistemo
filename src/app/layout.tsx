import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'
import { configInfo } from '@/config/info'
import StyledComponentsRegistry from '@/lib/registry'
import LayoutChrome from '@/components/LayoutChrome'
import { ReactNode } from 'react'

export const metadata = {
    title: configInfo.appName,
    description: configInfo.appDescription
}

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<ReactNode> {
    return (
        <html suppressHydrationWarning={true} lang="pt-BR">
            <body suppressHydrationWarning={true}>
                <StyledComponentsRegistry>
                    <ToastContainer />
                    <LayoutChrome>{children}</LayoutChrome>
                </StyledComponentsRegistry>
            </body>
        </html>
    )
}
