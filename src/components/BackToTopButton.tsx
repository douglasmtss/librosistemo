'use client'
import { useEffect, useState } from 'react'
import { AiOutlineArrowUp } from 'react-icons/ai'
import styled from 'styled-components'

export const BackToTopButton = (): React.ReactNode => {
    const [showBaxToTopButton, setShowBackToTopButton] = useState(false)

    useEffect(() => {
        document.addEventListener('scroll', () => setShowBackToTopButton(window.scrollY > 100))

        return (): void => document.removeEventListener('scroll', () => setShowBackToTopButton(window.scrollY > 100))
    }, [])

    return (
        <>
            {showBaxToTopButton ? (
                <ScrollTopButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <ArrowUpIcon />
                </ScrollTopButton>
            ) : null}
        </>
    )
}

const ScrollTopButton = styled.button`
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 10;
    background-color: var(--color-success);
    color: var(--color-white);
    padding: 16px;
    border-radius: 9999px;
    box-shadow:
        0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;

    &:hover {
        background-color: #16a34a; /* green-600 — não existe token equivalente em globals.css */
    }
`

const ArrowUpIcon = styled(AiOutlineArrowUp)`
    color: var(--color-white);
    font-size: 24px;
    line-height: 32px;
`
