import { Entity } from '@/enums/entities'
import { z } from 'zod'

const text = z.string().trim().min(1)
const isbn = z.union([z.string().trim().min(10), z.number().int().positive()])

const schemas = {
    [Entity.books]: z.object({ isbn, title: text }).passthrough(),
    [Entity.users]: z.object({ first_name: text }).passthrough(),
    [Entity.lends]: z.object({ user_id: text, book_id: text }).passthrough()
}

export const validateEntityPayload = (entity: Entity, data: unknown, partial = false): boolean => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return false

    const schema = partial ? schemas[entity].partial() : schemas[entity]

    return schema.safeParse(data).success
}
