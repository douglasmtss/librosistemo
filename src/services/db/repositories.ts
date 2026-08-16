import { Entity } from '@/enums/entities'
import { prisma } from './prisma'

export type EntityData = Record<string, unknown>

type FieldCoercer = (value: unknown) => string | number

const str: FieldCoercer = value => (value === undefined || value === null ? '' : String(value))

const int =
    (fallback: number): FieldCoercer =>
    value => {
        const parsed = Number(value)

        return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback
    }

// A planilha original entregava tudo como string; os formulários ainda enviam
// valores assim. A coerção aqui é a fronteira entre o JSON solto e o schema tipado.
const fieldCoercers: Record<Entity, Record<string, FieldCoercer>> = {
    [Entity.books]: {
        isbn: str,
        title: str,
        subtitle: str,
        author: str,
        description: str,
        image: str,
        amount: int(1),
        category: str,
        status: value => str(value) || 'available',
        place: str
    },
    [Entity.users]: {
        first_name: str,
        last_name: str,
        phone: str
    },
    [Entity.lends]: {
        user_id: str,
        first_name: str,
        last_name: str,
        book_id: str,
        book_title: str,
        created: str
    }
}

export const coerceEntityData = (entity: Entity, data: EntityData, partial = false): EntityData => {
    const coerced: EntityData = {}

    for (const [field, coerce] of Object.entries(fieldCoercers[entity])) {
        if (partial && !(field in data)) {
            continue
        }

        coerced[field] = coerce(data[field])
    }

    if (typeof data.id === 'string' && data.id) {
        coerced.id = data.id
    }

    return coerced
}

type Delegate = {
    findMany: (args?: unknown) => Promise<unknown[]>
    findUnique: (args: { where: { id: string } }) => Promise<unknown | null>
    create: (args: { data: never }) => Promise<unknown>
    update: (args: { where: { id: string }; data: never }) => Promise<unknown>
    delete: (args: { where: { id: string } }) => Promise<unknown>
}

const delegates: Record<Entity, () => Delegate> = {
    [Entity.books]: () => prisma.book as unknown as Delegate,
    [Entity.users]: () => prisma.user as unknown as Delegate,
    [Entity.lends]: () => prisma.lend as unknown as Delegate
}

export const entityRepository = {
    list: (entity: Entity): Promise<unknown[]> => delegates[entity]().findMany(),
    getById: (entity: Entity, id: string): Promise<unknown | null> => delegates[entity]().findUnique({ where: { id } }),
    create: (entity: Entity, data: EntityData): Promise<unknown> =>
        delegates[entity]().create({ data: coerceEntityData(entity, data) as never }),
    update: (entity: Entity, id: string, data: EntityData): Promise<unknown> =>
        delegates[entity]().update({ where: { id }, data: coerceEntityData(entity, data, true) as never }),
    remove: (entity: Entity, id: string): Promise<unknown> => delegates[entity]().delete({ where: { id } })
}

export const adminRepository = {
    findByUsername: (username: string): Promise<{ id: string; username: string; passwordHash: string } | null> =>
        prisma.admin.findUnique({ where: { username } })
}
