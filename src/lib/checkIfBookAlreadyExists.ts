export const checkIfBookAlreadyExists = async (
    books: Book[],
    booksInformations: BrasilapiBook[],
    callbackIfAlreadyExists?: (isbn: string) => void
): Promise<{
    alreadyExists: string[]
    filteredBooks: BrasilapiBook[]
}> => {
    if (!books?.length) return { alreadyExists: [], filteredBooks: booksInformations }

    const alreadyExists: string[] = []
    const filteredBooks: BrasilapiBook[] = []

    for (const bookInformation of booksInformations) {
        const bookExists = books.some(b => String(bookInformation?.isbn) === String(b?.isbn))

        if (bookExists && !callbackIfAlreadyExists) {
            alreadyExists.push(String(bookInformation?.isbn))
        }

        if (bookExists && callbackIfAlreadyExists) {
            callbackIfAlreadyExists(String(bookInformation?.isbn))
            alreadyExists.push(String(bookInformation?.isbn))
        }

        if (!bookExists) {
            filteredBooks.push(bookInformation as unknown as BrasilapiBook)
        }
    }

    return {
        alreadyExists,
        filteredBooks
    }
}
