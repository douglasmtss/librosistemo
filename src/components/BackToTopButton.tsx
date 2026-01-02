'use client'
import { useEffect, useState } from 'react'
import { AiOutlineArrowUp } from 'react-icons/ai'

export const BackToTopButton = (): JSX.Element => {
    const [showBaxToTopButton, setShowBackToTopButton] = useState(false)

    useEffect(() => {
        document.addEventListener('scroll', () => setShowBackToTopButton(window.scrollY > 100))

        return () => document.removeEventListener('scroll', () => setShowBackToTopButton(window.scrollY > 100))
    }, [])

    return (
        <>
            {showBaxToTopButton ? (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-opacity z-10"
                >
                    <AiOutlineArrowUp className="text-white text-2xl" />
                </button>
            ) : null}
        </>
    )
}
