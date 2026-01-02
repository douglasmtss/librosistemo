export type Row = Record<string, string>

export type SpreadsheetResponse = {
    get: {
        auth: { username: string; password: string }
        books: Row[]
        users: Row[]
        lends: Row[]
    }
    getRowById: {
        books: (id: string) => Promise<Row>
        users: (id: string) => Promise<Row>
        lends: (id: string) => Promise<Row>
    }
    add: {
        books: (data: Row) => Promise<void>
        users: (data: Row) => Promise<void>
        lends: (data: Row) => Promise<void>
    }
    delete: {
        books: (id: string) => Promise<void>
        users: (id: string) => Promise<void>
        lends: (id: string) => Promise<void>
    }
    update: {
        books: (id: string, data: Row) => Promise<void>
        users: (id: string, data: Row) => Promise<void>
        lends: (id: string, data: Row) => Promise<void>
    }
}
