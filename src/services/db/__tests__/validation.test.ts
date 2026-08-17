import { Entity } from '@/enums/entities'
import { validateEntityPayload } from '../validation'

describe('validateEntityPayload', (): void => {
    test('valida campos mínimos de livros', (): void => {
        expect(validateEntityPayload(Entity.books, { isbn: '9788570460097', title: 'Dom Casmurro' })).toBe(true)
        expect(validateEntityPayload(Entity.books, { isbn: '123', title: 'Inválido' })).toBe(false)
    })

    test('valida referências mínimas de empréstimos', (): void => {
        expect(validateEntityPayload(Entity.lends, { user_id: 'u1', book_id: 'b1' })).toBe(true)
        expect(validateEntityPayload(Entity.lends, { user_id: 'u1' })).toBe(false)
    })

    test('permite update parcial, mas exige objeto', (): void => {
        expect(validateEntityPayload(Entity.users, { last_name: 'Silva' }, true)).toBe(true)
        expect(validateEntityPayload(Entity.users, {}, true)).toBe(true)
        expect(validateEntityPayload(Entity.users, null, true)).toBe(false)
    })
})
