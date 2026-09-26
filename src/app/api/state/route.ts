import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { unions, roundQuotas, bookings, teams } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const allUnions = await db.select().from(unions)
    const allQuotas = await db.select().from(roundQuotas)

    const cookieStore = await cookies()
    const teamIdStr = cookieStore.get('team_id')?.value

    let myBookings: { roundNumber: number; unionId: number }[] = []
    let isConfirmed = false

    if (teamIdStr) {
      const teamId = parseInt(teamIdStr)

      const [teamData] = await db
        .select({ isConfirmed: teams.isConfirmed })
        .from(teams)
        .where(eq(teams.id, teamId))

      if (teamData) {
        isConfirmed = teamData.isConfirmed ?? false
      }

      myBookings = await db
        .select({
          roundNumber: bookings.roundNumber,
          unionId: bookings.unionId,
        })
        .from(bookings)
        .where(eq(bookings.teamId, teamId))
    }

    return NextResponse.json({
      unions: allUnions,
      quotas: allQuotas,
      myBookings,
      isConfirmed,
    })
  } catch (error) {
    console.error('Ошибка в /api/state:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить данные мероприятия' },
      { status: 500 },
    )
  }
}
