import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { teams, bookings, auditLogs } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const teamIdStr = cookieStore.get('team_id')?.value

    if (!teamIdStr) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    const teamId = parseInt(teamIdStr)

    return await db.transaction(async (tx) => {
      const [team] = await tx
        .select()
        .from(teams)
        .where(eq(teams.id, teamId))
        .for('update')

      if (!team) throw new Error('Команда не найдена')
      if (team.isConfirmed)
        throw new Error('Расписание уже было подтверждено ранее')

      const teamBookings = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.teamId, teamId))

      if (teamBookings.length < 6) {
        throw new Error(
          `Выбрано станций: ${teamBookings.length} из 6. Заполните все круги.`,
        )
      }

      await tx
        .update(teams)
        .set({ isConfirmed: true, confirmedAt: new Date() })
        .where(eq(teams.id, teamId))

      await tx.insert(auditLogs).values({
        teamId,
        action: 'CONFIRM',
      })

      return NextResponse.json({ success: true })
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Внутренняя ошибка сервера'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
