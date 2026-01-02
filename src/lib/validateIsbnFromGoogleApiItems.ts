export const validateIsbnFromGoogleApiItems = (items: GoogleApiBooksItem[], isbn: string): GoogleApiBooks => {
    const result = {} as GoogleApiBooks

    for (const item of items) {
        item.volumeInfo.industryIdentifiers.forEach(ii => {
            if (ii.identifier === isbn) {
                Object.assign(result, item.volumeInfo)
            }
        })
    }

    return result
}
