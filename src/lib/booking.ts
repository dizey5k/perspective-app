import { db } from '@/db'
import { bookings, roundQuotas, teams, auditLogs } from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { sseBroker } from './sse'

export class BookingService {
  public static async bookSlot(
    teamId: number,
    roundNumber: number,
    unionId: number,
  ) {
    return await db.transaction(async (tx) => {
      const [team] = await tx
        .select()
        .from(teams)
        .where(eq(teams.id, teamId))
        .for('update')
      if (!team) throw new Error('Команда не найдена')
      if (team.isConfirmed) throw new Error('Расписание уже подтверждено')

      const existingBookings = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.teamId, teamId))

      const isVisitedElsewhere = existingBookings.some(
        (b) => b.unionId === unionId && b.roundNumber !== roundNumber,
      )

      if (isVisitedElsewhere) {
        await tx.insert(auditLogs).values({
          teamId,
          roundNumber,
          unionId,
          action: 'FAILED_ALREADY_VISITED',
        })
        throw new Error('Это объединение уже выбрано в другом круге')
      }

      const currentRoundBooking = existingBookings.find(
        (b) => b.roundNumber === roundNumber,
      )
      if (currentRoundBooking && currentRoundBooking.unionId === unionId) {
        return { success: true, message: 'Уже выбрано' }
      }

      if (currentRoundBooking) {
        const [released] = await tx
          .update(roundQuotas)
          .set({ remainingQuota: sql`${roundQuotas.remainingQuota} + 1` })
          .where(
            and(
              eq(roundQuotas.roundNumber, roundNumber),
              eq(roundQuotas.unionId, currentRoundBooking.unionId),
            ),
          )
          .returning()

        sseBroker.broadcast({
          roundNumber,
          unionId: currentRoundBooking.unionId,
          remainingQuota: released.remainingQuota,
        })
      }

      const [updated] = await tx
        .update(roundQuotas)
        .set({ remainingQuota: sql`${roundQuotas.remainingQuota} - 1` })
        .where(
          and(
            eq(roundQuotas.roundNumber, roundNumber),
            eq(roundQuotas.unionId, unionId),
            sql`${roundQuotas.remainingQuota} > 0`,
          ),
        )
        .returning()

      if (!updated) {
        await tx.insert(auditLogs).values({
          teamId,
          roundNumber,
          unionId,
          action: 'FAILED_NO_SEATS',
        })
        throw new Error('Места закончились')
      }

      await tx
        .insert(bookings)
        .values({ teamId, roundNumber, unionId })
        .onConflictDoUpdate({
          target: [bookings.teamId, bookings.roundNumber],
          set: { unionId, createdAt: new Date() },
        })

      await tx.insert(auditLogs).values({
        teamId,
        roundNumber,
        unionId,
        action: currentRoundBooking ? 'REPLACE' : 'SELECT',
      })

      sseBroker.broadcast({
        roundNumber,
        unionId,
        remainingQuota: updated.remainingQuota,
      })

      return { success: true }
    })
  }
}
