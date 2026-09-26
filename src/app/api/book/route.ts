import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { BookingService } from '@/lib/booking'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const teamIdStr = cookieStore.get('team_id')?.value
    if (!teamIdStr)
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

    const { roundNumber, unionId } = await req.json()
    const teamId = parseInt(teamIdStr)

    await BookingService.bookSlot(teamId, roundNumber, unionId)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Неизвестная ошибка'
    return NextResponse.json({ error: errorMessage }, { status: 409 })
  }
}
