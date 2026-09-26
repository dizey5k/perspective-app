import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

// Таблица команд (капитанов)
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 32 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  isConfirmed: boolean('is_confirmed').default(false).notNull(),
  confirmedAt: timestamp('confirmed_at'),
})

// Таблица студенческих объединений
export const unions = pgTable('unions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
})

// Таблица квот (сколько мест у объединения в конкретном круге)
export const roundQuotas = pgTable(
  'round_quotas',
  {
    id: serial('id').primaryKey(),
    roundNumber: integer('round_number').notNull(),
    unionId: integer('union_id')
      .references(() => unions.id)
      .notNull(),
    totalQuota: integer('total_quota').notNull(),
    remainingQuota: integer('remaining_quota').notNull(),
  },
  (table) => [unique('round_union_idx').on(table.roundNumber, table.unionId)],
)

// Таблица бронирований (кто, куда и в какой круг записался)
export const bookings = pgTable(
  'bookings',
  {
    id: serial('id').primaryKey(),
    teamId: integer('team_id')
      .references(() => teams.id)
      .notNull(),
    roundNumber: integer('round_number').notNull(),
    unionId: integer('union_id')
      .references(() => unions.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [unique('team_round_idx').on(table.teamId, table.roundNumber)],
)

// Логи аудита (для разбора полетов, кто куда нажимал)
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  teamId: integer('team_id')
    .references(() => teams.id)
    .notNull(),
  roundNumber: integer('round_number'),
  unionId: integer('union_id'),
  action: varchar('action', { length: 64 }).notNull(),
})
