// Importação one-shot dos dados da planilha Google (modelo antigo) para o SQLite.
// Somente leitura na planilha — ela permanece intacta como backup.
// Rodar com: yarn db:import-sheets (exige as envs GOOGLE_* no .env)
import 'dotenv/config'
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../src/generated/prisma/client'

const env = (name: string): string | undefined => process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`]

const email = env('GOOGLE_SERVICE_ACCOUNT_EMAIL')
const key = env('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n')
const sheetId = env('GOOGLE_SHEET_ID')

if (!email || !key || !sheetId) {
    console.error(
        '[import] Defina GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY e GOOGLE_SHEET_ID no .env ' +
            '(os antigos NEXT_PUBLIC_GOOGLE_* também são aceitos).'
    )
    process.exit(1)
}

const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' })
})

type Row = Record<string, string>

const str = (row: Row, field: string): string => String(row[field] ?? '')

const main = async (): Promise<void> => {
    const auth = new JWT({ email, key, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] })
    const doc = new GoogleSpreadsheet(sheetId, auth)

    await doc.loadInfo()
    console.log(`[import] Planilha: ${doc.title}`)

    const readRows = async (title: string): Promise<Row[]> => {
        const sheet = doc.sheetsByTitle[title]

        if (!sheet) {
            console.warn(`[import] Aba "${title}" não encontrada — pulando.`)

            return []
        }

        return (await sheet.getRows()).map(row => row.toObject() as Row)
    }

    const [books, users, lends] = await Promise.all([readRows('books'), readRows('users'), readRows('lends')])

    for (const row of books) {
        const id = row.id || crypto.randomUUID()

        await prisma.book.upsert({
            where: { id },
            create: {
                id,
                isbn: str(row, 'isbn'),
                title: str(row, 'title'),
                subtitle: str(row, 'subtitle'),
                author: str(row, 'author'),
                description: str(row, 'description'),
                image: str(row, 'image'),
                amount: Number(row.amount) || 1,
                category: str(row, 'category'),
                status: str(row, 'status') || 'available',
                place: str(row, 'place')
            },
            update: {}
        })
    }
    console.log(`[import] ${books.length} livros importados.`)

    for (const row of users) {
        const id = row.id || crypto.randomUUID()

        await prisma.user.upsert({
            where: { id },
            create: {
                id,
                first_name: str(row, 'first_name'),
                last_name: str(row, 'last_name'),
                phone: str(row, 'phone')
            },
            update: {}
        })
    }
    console.log(`[import] ${users.length} usuários importados.`)

    for (const row of lends) {
        const id = row.id || crypto.randomUUID()

        await prisma.lend.upsert({
            where: { id },
            create: {
                id,
                user_id: str(row, 'user_id'),
                first_name: str(row, 'first_name'),
                last_name: str(row, 'last_name'),
                book_id: str(row, 'book_id'),
                book_title: str(row, 'book_title'),
                created: str(row, 'created')
            },
            update: {}
        })
    }
    console.log(`[import] ${lends.length} empréstimos importados.`)

    console.log('[import] Concluído. Valide os dados e depois revogue as credenciais Google.')
}

main()
    .catch(error => {
        console.error('[import] Falhou:', error)
        process.exitCode = 1
    })
    .finally(() => prisma.$disconnect())
