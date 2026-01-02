'use client'
import { BackButton } from '@/components/BackButton'
import { Scan } from '@/components/Scan'

export default function Scanner(): React.ReactNode {
    return (
        <div className="flex flex-col justify-center items-center">
            <BackButton classNameContainer="mb-8" />
            <h1 className=" text-2xl">Escanear código ISBN</h1>
            <Scan />
        </div>
    )
}
