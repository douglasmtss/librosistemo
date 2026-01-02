import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface TextElipsisProps {
    text?: string
    width?: string | number
    height?: string | number
    color?: string
}

export const TextElipsis = ({ text, width, height, color }: TextElipsisProps): JSX.Element => {
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
            textRefCurrent?.addEventListener('mouseover', () => {
                textRefCurrent.style.webkitLineClamp = '10'
            })

            textRefCurrent?.addEventListener('mouseleave', () => {
                textRefCurrent.style.webkitLineClamp = String(numberOfLines)
            })
        }

        return () => {
            if (textRefCurrent) {
                textRefCurrent.removeEventListener('mouseover', () => {
                    textRefCurrent.style.webkitLineClamp = String(numberOfLines)
                })
                textRefCurrent?.removeEventListener('mouseleave', () => {
                    textRefCurrent.style.webkitLineClamp = String(numberOfLines)
                })
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
    width: ${({ width }) => (typeof width === 'string' ? `${width}` : `${width}px`)};
    height: ${({ height }) => (typeof height === 'string' ? `${height}` : `${height}px`)};
    overflow: hidden;
    position: relative;
`
const Text = styled.div<{
    display: string
    lines: number
    color?: string
}>`
    color: ${({ color }) => color};
    white-space: pre-line;
    position: absolute;
    top: 0;
    left: 0;
    line-height: 16px;
    text-overflow: ellipsis;
    display: ${({ display }) => display};
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${({ lines }) => lines};
    white-space: pre-wrap;
`
