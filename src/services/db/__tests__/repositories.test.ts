/**
 * @jest-environment node
 */
import { Entity } from '@/enums/entities'

jest.mock('../prisma', () => {
    const buildDelegate = (): Record<string, jest.Mock> => ({
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    })

    return {
        prisma: {
            book: buildDelegate(),
            user: buildDelegate(),
            lend: buildDelegate(),
            admin: buildDelegate()
        }
    }
})

import { prisma } from '../prisma'
import { adminRepository, coerceEntityData, entityRepository } from '../repositories'

const prismaMock = prisma as unknown as Record<string, Record<string, jest.Mock>>

describe('coerceEntityData', (): void => {
    test('converte amount para inteiro e demais campos para string', (): void => {
        const data = coerceEntityData(Entity.books, { isbn: 123, title: 'T', amount: '3' })

        expect(data.isbn).toBe('123')
        expect(data.amount).toBe(3)
    })

    test('usa defaults para campos ausentes no modo completo', (): void => {
        const data = coerceEntityData(Entity.books, { title: 'Só título' })

        expect(data.subtitle).toBe('')
        expect(data.amount).toBe(1)
    })

    test('no modo parcial só inclui campos presentes', (): void => {
        const data = coerceEntityData(Entity.books, { title: 'Novo' }, true)

        expect(data).toEqual({ title: 'Novo' })
    })

    test('preserva id quando informado e descarta campos desconhecidos', (): void => {
        const data = coerceEntityData(Entity.users, { id: 'u1', first_name: 'Ana', rowIndex: '9', hack: 'x' })

        expect(data).toEqual({ id: 'u1', first_name: 'Ana', last_name: '', phone: '' })
    })
})

describe('entityRepository', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks()
    })

    test('list delega para findMany do model correto', async (): Promise<void> => {
        prismaMock.user.findMany.mockResolvedValue([])

        await entityRepository.list(Entity.users)

        expect(prismaMock.user.findMany).toHaveBeenCalled()
    })

    test('create envia dados coagidos', async (): Promise<void> => {
        prismaMock.book.create.mockResolvedValue({})

        await entityRepository.create(Entity.books, { title: 'T', amount: '2', lixo: true })

        const args = prismaMock.book.create.mock.calls[0][0] as { data: Record<string, unknown> }

        expect(args.data.amount).toBe(2)
        expect(args.data).not.toHaveProperty('lixo')
    })

    test('update é parcial', async (): Promise<void> => {
        prismaMock.lend.update.mockResolvedValue({})

        await entityRepository.update(Entity.lends, 'l1', { book_title: 'Novo' })

        expect(prismaMock.lend.update).toHaveBeenCalledWith({
            where: { id: 'l1' },
            data: { book_title: 'Novo' }
        })
    })

    test('remove delega para delete', async (): Promise<void> => {
        prismaMock.book.delete.mockResolvedValue({})

        await entityRepository.remove(Entity.books, 'b1')

        expect(prismaMock.book.delete).toHaveBeenCalledWith({ where: { id: 'b1' } })
    })
})

describe('adminRepository', (): void => {
    test('busca admin por username', async (): Promise<void> => {
        prismaMock.admin.findUnique.mockResolvedValue(null)

        await adminRepository.findByUsername('allan')

        expect(prismaMock.admin.findUnique).toHaveBeenCalledWith({ where: { username: 'allan' } })
    })
})
