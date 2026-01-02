'use client'

import { PaginatedBooks } from '@/components/PaginatedBooks'

export default function Home(): JSX.Element {
    return (
        <main className="flex flex-col">
            <PaginatedBooks itemsPerPage={10} />
        </main>
    )
}
