import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import { config } from 'dotenv'
import { generateTeamCode } from '@/lib/utils/utils'

config({ path: '.env' })

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL не найден в .env')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool, { schema })

const institutesData = [
  { prefix: 'isi', name: 'ИСИ' },
  { prefix: 'ie', name: 'ИЭ' },
  { prefix: 'immit', name: 'ИММиТ' },
  { prefix: 'ipmeit', name: 'ИПМЭиТ' },
  { prefix: 'gi', name: 'ГИ' },
  { prefix: 'ibsib', name: 'ИБСиБ' },
  { prefix: 'ieit', name: 'ИЭиТ' },
  { prefix: 'iknk', name: 'ИКНК' },
  { prefix: 'fizmeh', name: 'ФизМех' },
  { prefix: 'ispo', name: 'ИСПО' },
]

// Список станций с повышенной квотой (по 3 команды)
const HIGH_CAPACITY_STATIONS = [
  'ПРОФ.event',
  'ПРОФ.life',
  'Звезда Политеха',
  'Студенческий клуб',
  'Общественный институт «Адаптеры»',
]

async function main() {
  console.log('🗑 Очищаем старую базу данных...')

  await db.delete(schema.auditLogs)
  await db.delete(schema.bookings)
  await db.delete(schema.roundQuotas)
  await db.delete(schema.teams)
  await db.delete(schema.unions)

  console.log('🌱 Начинаем заливку новых данных...')

  const unionsData = [
    { name: 'ПРОФ.event', description: 'Организация мероприятий' },
    { name: 'ПРОФ.life', description: 'Студенческая жизнь' },
    { name: 'ПРОФ.help', description: 'Социальная поддержка' },
    { name: 'ПРОФ.edu', description: 'Образовательные проекты' },
    {
      name: 'Общественный институт «Адаптеры»',
      description: 'Наставничество для первокурсников',
    },
    // Турклуб удален
    {
      name: 'СЭО «Регрин»',
      description: 'Студенческое экологическое объединение',
    },
    {
      name: 'СОМ «ФабЛаб Политех»',
      description: 'Студенческое объединение мейкеров',
    },
    { name: 'ВИК «Наш Политех»', description: 'Военно-исторический клуб' },
    { name: 'СИО', description: 'Студенческая Ивент Организация' },
    {
      name: 'Сообщество студентов Росатома СПбПУ',
      description: 'Карьера и проекты в атомной отрасли',
    },
    {
      name: 'ДСО «Тьюторы»',
      description: 'Добровольное студенческое объединение',
    },
    { name: 'Звезда Политеха', description: 'Студенческое СМИ' },
    { name: 'Студенческий клуб', description: 'Творчество и искусство' },
    { name: 'Академия актива', description: 'Развитие софт-скиллов' },
    { name: 'ХимТИМ', description: 'Химическое объединение' },
    {
      name: 'Разговорный клуб «ТОЛК»',
      description: 'Практика иностранных языков',
    },
    {
      name: 'Объединённый студсовет общежитий',
      description: 'Защита прав проживающих',
    },
    { name: 'Кейс-Клуб СПбПУ', description: 'Решение бизнес-кейсов' },
    { name: 'ВкусЛаб', description: 'Кулинарное объединение' },
    { name: 'Модель ООН Политеха', description: 'Дипломатическая игра' },
    {
      name: 'ССК «Черные Медведи-Политех»',
      description: 'Студенческий спортивный клуб',
    },
    { name: 'Полимер', description: 'Наука и инженерия' },
    { name: 'Интеллектуальный клуб Политеха', description: 'Игры ЧГК, Квизы' },
    { name: 'СНО СПбПУ', description: 'Студенческое научное общество' },
    {
      name: 'Студенческие отряды Политеха',
      description: 'Труд, стройки, вожатые',
    },
  ]

  const insertedUnions = await db
    .insert(schema.unions)
    .values(unionsData)
    .returning()

  const quotasToInsert = []
  for (let round = 1; round <= 6; round++) {
    for (const union of insertedUnions) {
      // Определяем квоту: 3 для избранных, 2 для остальных
      const maxQuota = HIGH_CAPACITY_STATIONS.includes(union.name) ? 3 : 2

      quotasToInsert.push({
        roundNumber: round,
        unionId: union.id,
        totalQuota: maxQuota,
        remainingQuota: maxQuota,
      })
    }
  }
  await db.insert(schema.roundQuotas).values(quotasToInsert)

  const teamsToInsert = []
  const instituteCounts: Record<string, number> = {}

  for (let i = 0; i < 58; i++) {
    const inst = institutesData[i % institutesData.length]

    instituteCounts[inst.prefix] = (instituteCounts[inst.prefix] || 0) + 1

    teamsToInsert.push({
      name: `Команда ${inst.name} #${instituteCounts[inst.prefix]}`,
      code: generateTeamCode(inst.prefix),
    })
  }
  const insertedTeams = await db
    .insert(schema.teams)
    .values(teamsToInsert)
    .returning()

  console.log(`✅ Успешно! Создано объединений: ${insertedUnions.length}`)
  console.log(`✅ Успешно! Создано квот: ${quotasToInsert.length}`)
  console.log(`✅ Успешно! Создано команд: ${insertedTeams.length}`)

  console.log('\n--- КОДЫ КОМАНД ДЛЯ ОРГАНИЗАТОРОВ ---')
  console.table(
    insertedTeams.map((t) => ({
      Название: t.name,
      'Пароль для входа': t.code,
    })),
  )

  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Ошибка сидирования:', err)
  process.exit(1)
})
