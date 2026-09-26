import { db } from './index'
import { teams } from './schema'

async function main() {
  const allTeams = await db.select().from(teams)

  const tableData = allTeams.map((t) => ({
    Команда: t.name,
    'Код доступа': t.code,
    Расписание: t.isConfirmed ? 'Зафиксировано' : 'В процессе',
  }))

  console.table(tableData)
  process.exit(0)
}

main()
