import { isEntity } from '@/enums/entities'
import { entityRepository, EntityData } from '@/services/db/repositories'
import { validateEntityPayload } from '@/services/db/validation'
import { NextRequest, NextResponse } from 'next/server'

const badRequest = (message: string): NextResponse => NextResponse.json({ error: message }, { status: 400 })

const isRecordNotFound = (error: unknown): boolean =>
    typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2025'

const handleError = (error: unknown): NextResponse => {
    if (error instanceof SyntaxError) {
        return badRequest('JSON inválido')
    }

    if (isRecordNotFound(error)) {
        return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 })
    }

    console.error('[entities] Erro inesperado:', error)

    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url)
    const entity = searchParams.get('entity')
    const id = searchParams.get('id')

    if (!isEntity(entity)) {
        return badRequest('Entidade inválida')
    }

    try {
        if (id) {
            const record = await entityRepository.getById(entity, id)

            if (!record) {
                return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 })
            }

            return NextResponse.json(record, { status: 200 })
        }

        const records = await entityRepository.list(entity)

        return NextResponse.json(records, { status: 200 })
    } catch (error) {
        return handleError(error)
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url)
    const entity = searchParams.get('entity')

    if (!isEntity(entity)) {
        return badRequest('Entidade inválida')
    }

    try {
        const body = (await req.json()) as EntityData

        if (!validateEntityPayload(entity, body)) {
            return badRequest('Payload inválido')
        }

        const created = await entityRepository.create(entity, body)

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        return handleError(error)
    }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url)
    const entity = searchParams.get('entity')
    const id = searchParams.get('id')

    if (!isEntity(entity)) {
        return badRequest('Entidade inválida')
    }

    if (!id) {
        return badRequest('Parâmetro id é obrigatório')
    }

    try {
        const body = (await req.json()) as EntityData

        if (!validateEntityPayload(entity, body, true)) {
            return badRequest('Payload inválido')
        }

        const updated = await entityRepository.update(entity, id, body)

        return NextResponse.json(updated, { status: 200 })
    } catch (error) {
        return handleError(error)
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url)
    const entity = searchParams.get('entity')
    const id = searchParams.get('id')

    if (!isEntity(entity)) {
        return badRequest('Entidade inválida')
    }

    if (!id) {
        return badRequest('Parâmetro id é obrigatório')
    }

    try {
        await entityRepository.remove(entity, id)

        return NextResponse.json({ deleted: id }, { status: 200 })
    } catch (error) {
        return handleError(error)
    }
}
