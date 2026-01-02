declare type GoogleApiBooks = {
    title: string
    subtitle: string
    authors: string[]
    publisher: string
    publishedDate: string
    description: string
    industryIdentifiers: IndustryIdentifier[]
    readingModes: ReadingModes
    pageCount: number
    printType: string
    categories: string[]
    maturityRating: string
    allowAnonLogging: boolean
    contentVersion: string
    panelizationSummary: PanelizationSummary
    imageLinks: ImageLinks
    language: string
    previewLink: string
    infoLink: string
    canonicalVolumeLink: string
}

declare type IndustryIdentifier = {
    type: string
    identifier: string
}

declare type ReadingModes = {
    text: boolean
    image: boolean
}

declare type PanelizationSummary = {
    containsEpubBubbles: boolean
    containsImageBubbles: boolean
}

declare type ImageLinks = {
    smallThumbnail?: string
    thumbnail?: string
}

declare type GoogleApiBooksItem = {
    kind: string
    id: string
    etag: string
    selfLink: string
    volumeInfo: VolumeInfo
    saleInfo: SaleInfo
    accessInfo: AccessInfo
    searchInfo: SearchInfo
}

declare type VolumeInfo = {
    title: string
    authors: string[]
    publisher: string
    publishedDate: string
    description: string
    industryIdentifiers: IndustryIdentifier[]
    readingModes: ReadingModes
    pageCount: number
    printType: string
    categories: string[]
    maturityRating: string
    allowAnonLogging: boolean
    contentVersion: string
    panelizationSummary: PanelizationSummary
    imageLinks: ImageLinks
    language: string
    previewLink: string
    infoLink: string
    canonicalVolumeLink: string
}

declare type IndustryIdentifier = {
    type: string
    identifier: string
}

declare type ReadingModes = {
    text: boolean
    image: boolean
}

declare type PanelizationSummary = {
    containsEpubBubbles: boolean
    containsImageBubbles: boolean
}

declare type ImageLinks = {
    smallThumbnail: string
    thumbnail: string
}

declare type SaleInfo = {
    country: string
    saleability: string
    isEbook: boolean
}

declare type AccessInfo = {
    country: string
    viewability: string
    embeddable: boolean
    publicDomain: boolean
    textToSpeechPermission: string
    epub: Epub
    pdf: Pdf
    webReaderLink: string
    accessViewStatus: string
    quoteSharingAllowed: boolean
}

declare type Epub = {
    isAvailable: boolean
}

declare type Pdf = {
    isAvailable: boolean
    acsTokenLink: string
}

declare type SearchInfo = {
    textSnippet: string
}
