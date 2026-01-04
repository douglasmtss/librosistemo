import { GoogleSpreadsheet } from 'google-spreadsheet'

import { jwtServiceAccountAuth } from './jwtServiceAccountAuth'

export const googleSpreadsheet = new GoogleSpreadsheet(
    jwtServiceAccountAuth.sheetId,
    jwtServiceAccountAuth.serviceAccountAuth
)

export const authenticateGoogleSheet = async (): Promise<void> => {
    'use server'
    try {
        await jwtServiceAccountAuth.serviceAccountAuth.authorize()
        console.log('Google Sheet Authenticated successfully')
    } catch (error) {
        console.error('Error authenticating with Google Sheets:', error)
    }
}

export const getGoogleSpreadsheet = async (): Promise<GoogleSpreadsheet> => {
    'use server'
    await authenticateGoogleSheet()

    try {
        await googleSpreadsheet.loadInfo()
    } catch (error) {
        console.error('Error loading Google Spreadsheet info:', error)
    }

    return googleSpreadsheet
}
