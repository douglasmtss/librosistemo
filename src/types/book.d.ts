declare type Book = {
    id?: string
    rowIndex?: string
    isbn: number
    title: string
    subtitle: string
    author: string
    description: string
    image: string
    amount: number
    category: string
    status?: 'borrowed' | 'available'
    place?: string
}
