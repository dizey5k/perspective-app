import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export async function exportToGoogleSheet(
  teamName: string,
  roundNames: string[],
) {
  try {
    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID!,
      serviceAccountAuth,
    )
    await doc.loadInfo()

    // ==========================================
    // ЛИСТ 1: Расписание по станциям (Шахматка)
    // ==========================================
    if (doc.sheetCount > 1) {
      const sheet2 = doc.sheetsByIndex[0]
      const rows = await sheet2.getRows()

      for (let i = 0; i < roundNames.length; i++) {
        const stationName = roundNames[i]
        const roundNum = i + 1

        if (!stationName || stationName === '-') continue

        const targetRow = rows.find((r) => r.get('Станция') === stationName)

        if (targetRow) {
          const colName = `Круг ${roundNum}`
          const currentValue = targetRow.get(colName) || ''

          const newValue = currentValue
            ? `${currentValue}\n${teamName}`
            : teamName

          targetRow.set(colName, newValue)
          await targetRow.save()
        }
      }
    }

    // ==========================================
    // ЛИСТ 2: Общая хронология команд (Дашборд)
    // ==========================================
    const sheet1 = doc.sheetsByIndex[1]
    await sheet1.addRow({
      Время: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
      Команда: teamName,
      'Круг 1': roundNames[0] || '-',
      'Круг 2': roundNames[1] || '-',
      'Круг 3': roundNames[2] || '-',
      'Круг 4': roundNames[3] || '-',
      'Круг 5': roundNames[4] || '-',
      'Круг 6': roundNames[5] || '-',
      Статус: 'Подтверждено',
    })

    console.log(
      `[Google Sheets] Маршрут команды ${teamName} успешно выгружен на оба листа.`,
    )
  } catch (error) {
    console.error('[Google Sheets] Ошибка выгрузки:', error)
  }
}
