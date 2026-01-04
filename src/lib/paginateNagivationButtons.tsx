'use client'

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function paginateNavigationButtons<T>(
    list: T[],
    side: 'left' | 'right',
    lengthToShow = 1
): React.JSX.Element {
    if (side === 'right' && list?.length > lengthToShow) {
        return (
            <div className="absolute right-0 top-8 bg-primary text-white rounded-full px-4 py-2">
                <FaArrowRight />
            </div>
        )
    }

    if (side === 'left' && list?.length > lengthToShow) {
        return (
            <div className="absolute left-0 top-8 bg-primary text-white rounded-full px-4 py-2">
                <FaArrowLeft />
            </div>
        )
    }

    return <></>
}
