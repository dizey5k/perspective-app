import { CheckCircle2, XCircle, Unlock } from 'lucide-react'
import { resetTeam } from '../actions'

type Team = {
  id: number
  name: string
  code: string
  isConfirmed: boolean
}

interface AdminDashboardProps {
  teamsData: Team[]
}

export function AdminDashboard({ teamsData }: AdminDashboardProps) {
  const confirmedCount = teamsData.filter((t) => t.isConfirmed).length

  return (
    <div>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Управление командами
          </h1>
          <p className="text-white/60">Статистика и сброс маршрутов</p>
        </div>
        <div className="glass-card px-6 py-4 flex gap-8">
          <div>
            <div className="text-3xl font-bold text-fest-accent">
              {confirmedCount}
            </div>
            <div className="text-sm text-white/50">Подтвердили</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {teamsData.length}
            </div>
            <div className="text-sm text-white/50">Всего команд</div>
          </div>
        </div>
      </header>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-sm bg-white/[0.02]">
                <th className="py-4 px-5 font-medium">Команда</th>
                <th className="py-4 px-5 font-medium">Код доступа</th>
                <th className="py-4 px-5 font-medium">Статус</th>
                <th className="py-4 px-5 font-medium text-right">Управление</th>
              </tr>
            </thead>
            <tbody>
              {teamsData.map((team) => (
                <tr
                  key={team.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-5 text-white font-medium">
                    {team.name}
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-fest-accent border border-fest-accent/20">
                      {team.code}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    {team.isConfirmed ? (
                      <span className="inline-flex items-center gap-1.5 text-fest-blue bg-fest-blue/10 px-2.5 py-1 rounded-md text-sm font-medium border border-fest-blue/20">
                        <CheckCircle2 className="w-4 h-4" /> Зафиксировано
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-white/40 text-sm">
                        <XCircle className="w-4 h-4" /> Собирают
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {team.isConfirmed ? (
                      <form action={resetTeam} className="inline-block">
                        <input type="hidden" name="teamId" value={team.id} />
                        <button
                          type="submit"
                          className="text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                        >
                          <Unlock className="w-4 h-4" /> Сбросить
                        </button>
                      </form>
                    ) : (
                      <span className="text-white/20 text-sm italic mr-4">
                        Можно редактировать
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
