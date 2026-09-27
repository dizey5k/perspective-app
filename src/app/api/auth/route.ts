import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { teams, bookings } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const code = body?.code

    if (!code) {
      return NextResponse.json({ error: 'Введите код' }, { status: 400 })
    }

    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.code, code.trim()))

    if (!team) {
      return NextResponse.json(
        { error: 'Неверный код команды' },
        { status: 401 },
      )
    }

    const teamBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.teamId, team.id))

    const currentBookings = teamBookings.reduce(
      (acc, b) => {
        acc[b.roundNumber] = b.unionId
        return acc
      },
      {} as Record<number, number>,
    )

    const cookieStore = await cookies()
    cookieStore.set('team_id', team.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 3,
    })

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        isConfirmed: Boolean(
          team.isConfirmed ?? (team as Record<string, unknown>).is_confirmed,
        ),
      },
      currentBookings,
    })
  } catch (error) {
    console.error('🔥 КРИТИЧЕСКАЯ ОШИБКА В /api/auth:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера', details: String(error) },
      { status: 500 },
    )
  }
}
