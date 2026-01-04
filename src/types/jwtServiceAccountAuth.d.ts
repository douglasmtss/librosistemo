import { JWT } from 'google-auth-library'

declare type JwtServiceAccountAuth = {
    serviceAccountAuth: JWT
    email: string
    private_key: string
    sheetId: string
    scopes: string[]
}
