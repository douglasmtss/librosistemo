// Cria (ou atualiza) o admin inicial a partir de ADMIN_USERNAME/ADMIN_PASSWORD.
// Rodar com: yarn db:seed
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' })
})

const main = async (): Promise<void> => {
    const username = process.env.ADMIN_USERNAME ?? 'admin'
    const password = process.env.ADMIN_PASSWORD ?? 'admin'

    if (!process.env.ADMIN_PASSWORD) {
        console.warn('[seed] ADMIN_PASSWORD não definido — usando senha padrão "admin". Troque em produção!')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.admin.upsert({
        where: { username },
        create: { username, passwordHash },
        update: { passwordHash }
    })

    console.log(`[seed] Admin "${username}" criado/atualizado.`)
}

main()
    .catch(error => {
        console.error('[seed] Falhou:', error)
        process.exitCode = 1
    })
    .finally(() => prisma.$disconnect())
