'use client'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { RxExit } from 'react-icons/rx'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'
import { configInfo } from '@/config/info'

const HamburgerAndCloser = dynamic(() => import('@/components/HamburgerAndCloser'), { ssr: false })
const AdminLink = dynamic(() => import('@/components/AdminLink'), { ssr: false })

export default function LayoutMenu(): React.ReactNode {
    const [show, setShow] = useState<boolean>(false)

    return (
        <NavBar>
            <LogoItem>
                <Link href={'/'}>
                    <Logo
                        src={configInfo.appLogo}
                        width={60}
                        height={60}
                        alt={configInfo.appName + ' logo'}
                        loading="eager"
                    />
                </Link>
            </LogoItem>

            <MenuItem>
                <ResponsiveHamburger show={show} setShow={setShow} />
                <MenuSlider id="menu-slider" $show={show}>
                    <MenuList>
                        <li>
                            <NavLink onClick={() => setShow(false)} href={'/'}>
                                INÍCIO
                            </NavLink>
                        </li>
                        <li>
                            <NavLink onClick={() => setShow(false)} href="/pages/dashboard/books">
                                LIVROS
                            </NavLink>
                        </li>
                        <li>
                            <NavLink onClick={() => setShow(false)} href="/pages/dashboard/users">
                                USUÁRIOS
                            </NavLink>
                        </li>
                        <li>
                            <NavLink onClick={() => setShow(false)} href="/pages/dashboard/lends">
                                EMPRÉSTIMOS
                            </NavLink>
                        </li>
                        <li>
                            <StyledAdminLink
                                onClick={() => setShow(false)}
                                beforeNavigate={{
                                    label: 'Administração',
                                    path: '/pages/dashboard'
                                }}
                                afterNavigate={{
                                    label: (
                                        <ExitLabel>
                                            <ExitText>Sair</ExitText> <ExitIcon title="Sair" />
                                        </ExitLabel>
                                    ),
                                    path: '/'
                                }}
                            />
                        </li>
                    </MenuList>
                </MenuSlider>
            </MenuItem>
        </NavBar>
    )
}

const NavBar = styled.ul`
    display: flex;
    align-items: center;
    background-color: var(--color-primary);
    width: 100%;
    padding: 16px 32px;
    height: 100%;
`

const LogoItem = styled.li`
    display: flex;
    color: var(--color-white);
    align-items: center;
`

const Logo = styled(Image)`
    border-radius: 100%;
    border: 2px solid var(--color-white);
`

const MenuItem = styled.li`
    position: relative;
    color: var(--color-white);
    display: flex;
    flex: 1 1 0%;
    justify-content: flex-end;
`

const ResponsiveHamburger = styled(HamburgerAndCloser)`
    @media (min-width: 768px) {
        opacity: 0;
    }
`

const MenuSlider = styled.div<{ $show: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10;
    width: 256px;
    height: 100%;
    background-color: var(--color-primary);
    padding-right: ${({ $show }): string => ($show ? '0' : '16px')};
    transform: ${({ $show }): string => ($show ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

    @media (min-width: 768px) {
        width: ${({ $show }): string => ($show ? '256px' : '80%')};
        height: ${({ $show }): string => ($show ? '100%' : 'max-content')};
        transform: translateX(0);
    }
`

const MenuList = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 64px;
    padding: 16px;
    margin-top: 64px;

    > :not(:last-child) {
        margin-bottom: 16px;
    }

    @media (min-width: 768px) {
        flex-direction: row;
        gap: 16px;
        justify-content: flex-end;
        align-items: flex-end;
        width: 100%;
        margin-top: 0;

        > :not(:last-child) {
            margin-bottom: 0;
        }
    }
`

const NavLink = styled(Link)`
    color: var(--color-white);

    &:hover {
        text-decoration: underline;
    }
`

const StyledAdminLink = styled(AdminLink)`
    color: var(--color-white);
    text-transform: uppercase;

    &:hover {
        text-decoration: underline;
    }
`

const ExitLabel = styled.div`
    display: flex;
`

const ExitText = styled.span`
    margin-right: 8px;
`

const ExitIcon = styled(RxExit)`
    font-size: 24px;
    line-height: 32px;
`
