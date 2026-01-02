import { fetchGoogleSheets } from '@/services/spreadsheetToDTO'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log('POST ==> /api/auth')

    const spreadsheet = await fetchGoogleSheets()
    const body = await req.json()

    const userAdmin = spreadsheet.get.auth

    if (userAdmin) {
        if (userAdmin.username !== body.username || userAdmin.password !== body.password) {
            return NextResponse.json({ status: 401 })
        }

        if (userAdmin.username === body.username && userAdmin.password === body.password) {
            return NextResponse.json({ appLogged: 'yes', status: 200 }, { status: 200 })
        }
    }

    return NextResponse.json({ status: 401 })
}
