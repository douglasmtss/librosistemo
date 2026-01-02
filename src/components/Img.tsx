/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from 'react'

export const Img = ({
    src,
    alt,
    width,
    height,
    className = ''
}: {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
}): JSX.Element => {
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (imgRef.current) {
            if (!imgRef.current.getAttribute('src')) {
                imgRef.current.setAttribute('src', '/images/empty-book.png')
            }
        }
    }, [imgRef])

    return (
        <>
            <img ref={imgRef} src={src} width={width} height={height} alt={alt} className={className} />
        </>
    )
}
