export enum Entity {
    books = 'books',
    users = 'users',
    lends = 'lends'
}

export const isEntity = (value: string | null): value is Entity =>
    value !== null && Object.values(Entity).includes(value as Entity)
