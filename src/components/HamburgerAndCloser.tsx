'use client'
import { cn } from '@/lib/tailwindMerge'
import { FaBars, FaTimes } from 'react-icons/fa'

interface HamburgerAndCloserProps {
    className?: string
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HamburgerAndCloser({ className, show, setShow }: HamburgerAndCloserProps): JSX.Element {
    const hanldeClick = (): void => {
        setShow(!show)
    }

    return (
        <button className={cn('text-2xl focus:outline-none', className || '')} onClick={hanldeClick}>
            {show ? <FaTimes className="relative z-20" /> : <FaBars />}
        </button>
    )
}
