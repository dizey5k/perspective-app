'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Lock, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useLiveQuotas } from '@/hooks/useLiveQuotas'
import { fetchAppState, submitBooking, confirmSchedule } from '@/lib/api'
import { RoundStepper } from '@/components/ui/RoundStepper'
import { UnionCard } from '@/components/ui/UnionCard'
import { UnionInfoModal } from '@/components/ui/UnionInfoModal'
import { cn } from '@/lib/utils/utils'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [infoModalUnion, setInfoModalUnion] = useState<{
    name: string
    description?: string | null
    fullDescription?: string | null
  } | null>(null)

  const {
    team,
    unions,
    quotas,
    currentRound,
    myBookings,
    isConfirmed,
    setUnions,
    setQuotas,
    setCurrentRound,
    setMyBookings,
    setIsConfirmed,
    setTeam,
  } = useStore()

  useLiveQuotas()

  useEffect(() => {
    fetchAppState()
      .then((data) => {
        if (data.team) setTeam(data.team)
        setUnions(data.unions)
        setQuotas(data.quotas)
        setMyBookings(data.myBookings || [])
        setIsConfirmed(data.isConfirmed || false)
      })
      .catch((err) =>
        toast.error(
          err instanceof Error ? err.message : 'Ошибка загрузки данных',
        ),
      )
      .finally(() => setIsLoading(false))
  }, [setTeam, setUnions, setQuotas, setMyBookings, setIsConfirmed])

  const handleBook = async (unionId: number) => {
    if (isConfirmed) {
      toast.error('Маршрут зафиксирован', {
        description: 'Вы больше не можете менять станции.',
      })
      return
    }

    try {
      const res = await submitBooking(currentRound, unionId)
      if (res.success) {
        toast.success('Станция выбрана!')
        const newBookings = myBookings.filter(
          (b) => b.roundNumber !== currentRound,
        )
        newBookings.push({ roundNumber: currentRound, unionId })
        setMyBookings(newBookings)
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Сбой при выборе станции'
      toast.error('Не удалось выбрать станцию', { description: message })
    }
  }

  const handleConfirm = async () => {
    try {
      await confirmSchedule()
      setIsConfirmed(true)
      toast.success('Расписание зафиксировано!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Сбой сохранения'
      toast.error('Ошибка', { description: message })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#27CCD2] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const completedRounds = myBookings.map((b) => b.roundNumber)
  const isAllSelected = completedRounds.length === 6

  // Убираем дублирование "Команда: Команда"
  const rawTeamName =
    typeof team === 'string'
      ? team
      : (team as { name?: string } | null)?.name || 'Команда'
  const teamDisplayName = rawTeamName.replace(/^Команда\s*/i, '')

  return (
    <div className="pb-32 sm:pb-36 pt-4 sm:pt-6 px-3 sm:px-4 max-w-6xl mx-auto w-full">
      {/* Верхний бар */}
      <header className="flex items-center justify-between pb-6 sm:pb-8">
        <div className="flex items-center gap-3">
          <Image
            src="/icon/logo.svg"
            alt="ПРОФ"
            width={48}
            height={48}
            loading="eager"
            fetchPriority="high"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_10px_rgba(39,204,210,0.4)]"
          />
        </div>

        {/* Бейдж команды без переполнения */}
        <div className="glass-card px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-2 border-[#27CCD2]/30 text-xs shrink-0 max-w-[210px] sm:max-w-none">
          <span className="w-2 h-2 rounded-full bg-[#27CCD2] animate-pulse shrink-0" />
          <span className="text-white/60 hidden xs:inline">Команда:</span>
          <span className="font-bold text-white tracking-wide truncate">
            {teamDisplayName}
          </span>
        </div>
      </header>

      {/* Hero-секция */}
      <section className="text-center pt-1 pb-6">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#F6AFFD] font-bold mb-2">
          XXVIII Студенческая Перспектива
        </p>
        <h1 className="font-impulse text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#27CCD2] to-[#F6AFFD] drop-shadow-[0_0_30px_rgba(39,204,210,0.35)] leading-tight">
          Импульс
        </h1>
        <p className="text-[10px] sm:text-xs md:text-sm text-white/70 mt-2.5 font-medium tracking-[0.18em] uppercase px-2">
          Достаточно лишь импульса, чтобы начать
        </p>
      </section>

      {/* Степпер */}
      <div className="mb-6 sm:mb-8">
        <RoundStepper
          currentRound={currentRound}
          completedRounds={completedRounds}
          onSelectRound={setCurrentRound}
        />
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {unions.map((union) => {
          const quotaInfo = quotas.find(
            (q) => q.unionId === union.id && q.roundNumber === currentRound,
          )
          const remainingQuota = quotaInfo?.remainingQuota ?? 0
          const isSelected = myBookings.some(
            (b) => b.roundNumber === currentRound && b.unionId === union.id,
          )
          const bookingInOtherRound = myBookings.find(
            (b) => b.roundNumber !== currentRound && b.unionId === union.id,
          )
          const alreadySelectedRound = bookingInOtherRound
            ? bookingInOtherRound.roundNumber
            : null

          return (
            <UnionCard
              key={union.id}
              name={union.name}
              remainingQuota={remainingQuota}
              isSelected={isSelected}
              alreadySelectedRound={alreadySelectedRound}
              onSelect={() => handleBook(union.id)}
              onOpenInfo={() =>
                setInfoModalUnion({
                  name: union.name,
                  description: union.description,
                  fullDescription: (union as { fullDescription?: string })
                    .fullDescription,
                })
              }
            />
          )
        })}
      </div>

      {/* Прилипающий нижний статус-бар */}
      <aside className="fixed bottom-0 inset-x-0 z-50 bg-[#042222]/95 backdrop-blur-xl border-t border-[#27CCD2]/20 shadow-[0_-10px_25px_rgba(4,34,34,0.7)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Индикатор заполнения станций */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full shrink-0 animate-pulse',
                isAllSelected
                  ? 'bg-[#27CCD2] shadow-[0_0_8px_#27CCD2]'
                  : 'bg-[#F6AFFD] shadow-[0_0_8px_#F6AFFD]',
              )}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 text-xs sm:text-sm text-white/90 truncate">
              <span className="text-white/60 text-[11px] sm:text-sm">
                Маршрут:
              </span>
              <span className="font-bold tracking-wide">
                <b className={isAllSelected ? 'text-[#27CCD2]' : 'text-white'}>
                  {completedRounds.length}
                </b>{' '}
                из 6 станций
              </span>
            </div>
          </div>

          {/* Кнопка фиксации / статус */}
          <div className="shrink-0">
            {isConfirmed ? (
              <div className="px-3.5 sm:px-6 py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 font-bold bg-[#27CCD2]/20 text-[#27CCD2] border border-[#27CCD2]/40 text-[11px] sm:text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden xs:inline">Зафиксировано</span>
                <span className="xs:hidden">Готово</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isAllSelected}
                className={cn(
                  'px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 sm:gap-2 select-none',
                  isAllSelected
                    ? 'bg-gradient-to-r from-[#415FFB] via-[#27CCD2] to-[#F6AFFD] text-[#042222] shadow-[0_0_20px_rgba(39,204,210,0.5)] active:scale-95 cursor-pointer font-black'
                    : 'bg-white/10 text-white/30 border border-white/5 cursor-not-allowed',
                )}
              >
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">
                  Зафиксировать расписание
                </span>
                <span className="sm:hidden">Зафиксировать</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Модалка */}
      <UnionInfoModal
        isOpen={Boolean(infoModalUnion)}
        onClose={() => setInfoModalUnion(null)}
        name={infoModalUnion?.name ?? ''}
        fullDescription={infoModalUnion?.fullDescription}
      />
    </div>
  )
}
