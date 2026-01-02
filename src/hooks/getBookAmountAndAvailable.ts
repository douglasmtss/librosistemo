export type UseAvailableBooksState = {
    booksAvailable: number
    selectedBookAmount: number
}

export const getBookAmountAndAvailable = (bookId: string, books: Book[], lends: Lend[]): UseAvailableBooksState => {
    const selectedBookAmount = Number(books?.find(b => b?.id === bookId)?.amount) || 0
    const booksLends = lends?.filter(l => String(l?.book_id) === String(bookId)).length

    let booksAvailable = selectedBookAmount || 0

    if (selectedBookAmount && booksLends) {
        booksAvailable = selectedBookAmount - booksLends
    }

    return { booksAvailable, selectedBookAmount }
}
