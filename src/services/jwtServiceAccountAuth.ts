import { JwtServiceAccountAuth } from '@/types/jwtServiceAccountAuth'
import { JWT } from 'google-auth-library'

const email = process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL
const private_key = process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY
const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID

if (!email || !private_key || !sheetId) {
    throw new Error('Missing required environment variables')
}

const formattedPrivateKey = private_key.replace(/\\n/g, '\n')

const scopes = ['https://www.googleapis.com/auth/spreadsheets']

const serviceAccountAuth = new JWT({
    email,
    key: formattedPrivateKey,
    scopes
})

export const jwtServiceAccountAuth: JwtServiceAccountAuth = {
    serviceAccountAuth,
    email,
    private_key: formattedPrivateKey,
    sheetId,
    scopes
}
