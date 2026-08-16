'use client'
import { FaBars, FaTimes } from 'react-icons/fa'
import styled from 'styled-components'

interface HamburgerAndCloserProps {
    className?: string
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HamburgerAndCloser({ className, show, setShow }: HamburgerAndCloserProps): React.ReactNode {
    const hanldeClick = (): void => {
        setShow(!show)
    }

    return (
        <ToggleButton className={className} onClick={hanldeClick}>
            {show ? <CloseIcon /> : <FaBars />}
        </ToggleButton>
    )
}

const ToggleButton = styled.button`
    font-size: 24px;
    line-height: 32px;

    &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
    }
`

const CloseIcon = styled(FaTimes)`
    position: relative;
    z-index: 20;
`
