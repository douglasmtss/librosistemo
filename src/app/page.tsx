'use client'

import { PaginatedBooks } from '@/components/PaginatedBooks'

export default function Home(): React.ReactNode {
    return (
        <main className="flex flex-col">
            <PaginatedBooks itemsPerPage={10} />
        </main>
    )
}
