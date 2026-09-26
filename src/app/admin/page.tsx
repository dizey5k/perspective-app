import { cookies } from 'next/headers'
import { db } from '@/db'
import { teams, unions, roundQuotas } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { LoginForm } from './components/LoginForm'
import { AdminTabs } from './components/AdminTabs'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_token')?.value === 'true'

  if (!isAdmin) {
    return <LoginForm />
  }

  const [allTeams, allUnions, firstRoundQuotas] = await Promise.all([
    db.select().from(teams).orderBy(asc(teams.id)),
    db.select().from(unions).orderBy(asc(unions.id)),
    db.select().from(roundQuotas).where(eq(roundQuotas.roundNumber, 1)),
  ])

  const unionsWithQuotas = allUnions.map((union) => {
    const quotaObj = firstRoundQuotas.find((q) => q.unionId === union.id)
    return {
      ...union,
      quota: quotaObj?.totalQuota || 2,
    }
  })

  return <AdminTabs teamsData={allTeams} unionsData={unionsWithQuotas} />
}
