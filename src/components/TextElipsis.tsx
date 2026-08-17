import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface TextElipsisProps {
    text?: string
    width?: string | number
    height?: string | number
    color?: string
}

export const TextElipsis = ({ text, width, height, color }: TextElipsisProps): React.ReactNode => {
    const [lines, setLines] = useState(1)
    const [display, setDisplay] = useState('-webkit-box')
    const textRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return

        const lineHeight = 16
        const containerHeight = parseFloat(getComputedStyle(containerRef.current).height)
        const numberOfLines = Math.floor(containerHeight / lineHeight)

        setLines(numberOfLines)

        if (containerHeight < lineHeight) {
            setDisplay('none')
        } else {
            setDisplay('-webkit-box')
        }

        const textRefCurrent = textRef.current
        if (textRefCurrent) {
            const handleMouseOver = (): void => {
                textRefCurrent.style.webkitLineClamp = '10'
            }
            const handleMouseLeave = (): void => {
                textRefCurrent.style.webkitLineClamp = String(numberOfLines)
            }

            textRefCurrent.addEventListener('mouseover', handleMouseOver)
            textRefCurrent.addEventListener('mouseleave', handleMouseLeave)

            return (): void => {
                textRefCurrent.removeEventListener('mouseover', handleMouseOver)
                textRefCurrent.removeEventListener('mouseleave', handleMouseLeave)
            }
        }
    }, [text, width, height])

    return (
        <TextElipsisContainer ref={containerRef} width={width} height={height}>
            <Text display={display} lines={lines} ref={textRef} color={color}>
                {text}
            </Text>
        </TextElipsisContainer>
    )
}
const TextElipsisContainer = styled.div<{
    width?: string | number
    height?: string | number
}>`
    width: ${({ width }): string => (typeof width === 'string' ? `${width}` : `${width}px`)};
    height: ${({ height }): string => (typeof height === 'string' ? `${height}` : `${height}px`)};
    overflow: hidden;
    position: relative;
`
const Text = styled.div<{
    display: string
    lines: number
    color?: string
}>`
    color: ${({ color }): string => color ?? 'black'};
    white-space: pre-line;
    position: absolute;
    top: 0;
    left: 0;
    line-height: 16px;
    text-overflow: ellipsis;
    display: ${({ display }): string => display};
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${({ lines }): number => lines};
    white-space: pre-wrap;
`
