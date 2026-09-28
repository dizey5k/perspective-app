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
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F6AFFD]">
            Панель управления
          </span>
          <h1 className="text-3xl font-black text-white mt-1 uppercase tracking-tight">
            Управление командами
          </h1>
          <p className="text-white/60 text-xs mt-1">
            Мониторинг прогресса и сброс маршрутов
          </p>
        </div>

        <div className="glass-card px-6 py-4 flex gap-8 border-white/15">
          <div>
            <div className="text-3xl font-black text-[#F6AFFD] drop-shadow-[0_0_10px_rgba(246,175,253,0.4)]">
              {confirmedCount}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-0.5">
              Подтвердили
            </div>
          </div>
          <div className="border-l border-white/10 pl-8">
            <div className="text-3xl font-black text-[#27CCD2] drop-shadow-[0_0_10px_rgba(39,204,210,0.4)]">
              {teamsData.length}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-0.5">
              Всего команд
            </div>
          </div>
        </div>
      </header>

      <div className="glass-card overflow-hidden border-white/15">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider bg-white/[0.02]">
                <th className="py-4 px-5 font-bold">Команда</th>
                <th className="py-4 px-5 font-bold">Код доступа</th>
                <th className="py-4 px-5 font-bold">Статус</th>
                <th className="py-4 px-5 font-bold text-right">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teamsData.map((team) => (
                <tr
                  key={team.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-5 text-white font-bold text-sm">
                    {team.name}
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono bg-black/40 px-2.5 py-1 rounded-md text-xs font-semibold text-[#F6AFFD] border border-[#F6AFFD]/30 tracking-wider">
                      {team.code}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    {team.isConfirmed ? (
                      <span className="inline-flex items-center gap-1.5 text-[#27CCD2] bg-[#27CCD2]/15 px-3 py-1 rounded-md text-xs font-bold border border-[#27CCD2]/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Зафиксировано
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-white/40 text-xs">
                        <XCircle className="w-3.5 h-3.5" /> Собирают
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    {team.isConfirmed ? (
                      <form action={resetTeam} className="inline-block">
                        <input type="hidden" name="teamId" value={team.id} />
                        <button
                          type="submit"
                          className="text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 px-3.5 py-1.5 rounded-lg transition-all inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <Unlock className="w-3.5 h-3.5" /> Сбросить
                        </button>
                      </form>
                    ) : (
                      <span className="text-white/30 text-xs italic mr-3">
                        Редактируют
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
