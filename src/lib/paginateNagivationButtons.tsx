'use client'

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import styled from 'styled-components'

export default function paginateNavigationButtons<T>(
    list: T[],
    side: 'left' | 'right',
    lengthToShow = 1
): React.JSX.Element {
    if (side === 'right' && list?.length > lengthToShow) {
        return (
            <NavigationArrow $side="right">
                <FaArrowRight />
            </NavigationArrow>
        )
    }

    if (side === 'left' && list?.length > lengthToShow) {
        return (
            <NavigationArrow $side="left">
                <FaArrowLeft />
            </NavigationArrow>
        )
    }

    return <></>
}

const NavigationArrow = styled.div<{ $side: 'left' | 'right' }>`
    position: absolute;
    top: 32px;
    ${({ $side }): string => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
    background-color: var(--color-primary);
    color: var(--color-white);
    border-radius: 9999px;
    padding: 8px 16px;
`
