'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface AdminLinkProps {
    className?: string
    href?: string
    children?: ReactNode
    onClick?: () => void
    beforeNavigate?: {
        label: ReactNode
        path: string
    }
    afterNavigate?: {
        label: ReactNode
        path: string
    }
}
const AdminLink = ({
    className,
    href,
    children,
    onClick,
    afterNavigate,
    beforeNavigate
}: AdminLinkProps): JSX.Element => {
    const pathname = usePathname()
    const key = pathname.includes('/dashboard') ? 'after' : 'before'

    const content = {
        default: { label: children, path: href },
        before: beforeNavigate,
        after: afterNavigate
    }

    const result = content[key]

    return (
        <>
            {result && (
                <Link onClick={onClick} href={result?.path as string} className={className}>
                    {result?.label}
                </Link>
            )}
        </>
    )
}

export default AdminLink
