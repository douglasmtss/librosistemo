import { Sheet } from '@/enums/sheets'
import { fetchGoogleSheets } from '@/services/spreadsheetToDTO'
import { Row, SpreadsheetResponse } from '@/types/spreadsheet'
import { NextRequest, NextResponse } from 'next/server'

let spreadsheet = null as unknown as SpreadsheetResponse

export async function GET(req: NextRequest): Promise<NextResponse> {
    spreadsheet = await fetchGoogleSheets()

    const { searchParams } = new URL(req.url)

    const sheet = searchParams.get('sheet') as Sheet

    const data = await spreadsheet.get[sheet]

    return NextResponse.json(data, { status: 200 })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json()

    const { searchParams } = new URL(req.url)
    const sheet = searchParams.get('sheet') as Sheet

    spreadsheet.add[sheet](body as unknown as Row)

    return NextResponse.json({ status: 200 })
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const body = (await req.json()) as Book

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const sheet = searchParams.get('sheet') as Sheet

    if (id) {
        spreadsheet.update[sheet](id, body as unknown as Row)
    }

    return NextResponse.json({ status: 200 })
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const sheet = searchParams.get('sheet') as Sheet

    if (id && sheet) {
        spreadsheet.delete[sheet](id)
    }

    return NextResponse.json({ status: 200 })
}
