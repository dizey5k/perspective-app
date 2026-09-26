'use server'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { teams, unions, roundQuotas, bookings } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password')
  if (password === process.env.ADMIN_SECRET_KEY) {
    const cookieStore = await cookies()
    cookieStore.set('admin_token', 'true', { httpOnly: true, secure: true })
    revalidatePath('/admin')
  }
}

export async function resetTeam(formData: FormData) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'true') return

  const teamId = parseInt(formData.get('teamId') as string)
  if (!teamId) return

  try {
    await db.transaction(async (tx) => {
      const teamBookings = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.teamId, teamId))

      for (const booking of teamBookings) {
        const [currentQuota] = await tx
          .select()
          .from(roundQuotas)
          .where(
            and(
              eq(roundQuotas.unionId, booking.unionId),
              eq(roundQuotas.roundNumber, booking.roundNumber),
            ),
          )
          .for('update')

        if (currentQuota) {
          await tx
            .update(roundQuotas)
            .set({ remainingQuota: currentQuota.remainingQuota + 1 })
            .where(eq(roundQuotas.id, currentQuota.id))
        }
      }

      await tx.delete(bookings).where(eq(bookings.teamId, teamId))

      await tx
        .update(teams)
        .set({ isConfirmed: false, confirmedAt: null })
        .where(eq(teams.id, teamId))
    })

    revalidatePath('/admin')
  } catch (error) {
    console.error('Ошибка при сбросе команды:', error)
  }
}

export async function updateUnion(formData: FormData) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'true') return

  const unionId = parseInt(formData.get('unionId') as string)
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const newQuota = parseInt(formData.get('quota') as string)

  if (!unionId || !name) return

  await db.transaction(async (tx) => {
    await tx
      .update(unions)
      .set({ name, description })
      .where(eq(unions.id, unionId))

    if (newQuota && !isNaN(newQuota)) {
      const existingQuotas = await tx
        .select()
        .from(roundQuotas)
        .where(eq(roundQuotas.unionId, unionId))

      for (const q of existingQuotas) {
        // Вычисляем разницу (например, было 2, стало 3 -> разница +1)
        const diff = newQuota - q.totalQuota
        // Пересчитываем остаток (если остаток был 0, станет 1)
        const newRemaining = Math.max(0, q.remainingQuota + diff)

        await tx
          .update(roundQuotas)
          .set({ totalQuota: newQuota, remainingQuota: newRemaining })
          .where(
            and(
              eq(roundQuotas.unionId, unionId),
              eq(roundQuotas.roundNumber, q.roundNumber),
            ),
          )
      }
    }
  })

  revalidatePath('/admin')
}

export async function deleteUnionAction(unionId: number) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'true') {
    return { success: false, error: 'Не авторизован' }
  }

  try {
    await db.delete(unions).where(eq(unions.id, unionId))
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return {
      success: false,
      error: 'Нельзя удалить: станция уже используется в маршрутах!',
    }
  }
}
