'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { configInfo } from '@/config/info'
import { ReactNode } from 'react'

const LayoutMenu = dynamic(() => import('@/components/LayoutMenu'))

export default function LayoutChrome({ children }: { children: ReactNode }): ReactNode {
    return (
        <>
            <Header>
                <LayoutMenu />
            </Header>

            <Content>{children}</Content>

            <Footer>
                <ManualLink href={configInfo.appManual} target="__blank">
                    Manual
                </ManualLink>
            </Footer>
        </>
    )
}

const Header = styled.header`
    width: 100%;
    margin-bottom: 40px;
    height: 64px;
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
`

const Footer = styled.footer`
    width: 100%;
    height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-primary);
`

const ManualLink = styled(Link)`
    text-decoration: underline;
    color: var(--color-white);
    font-size: 20px;
    line-height: 28px;
`
