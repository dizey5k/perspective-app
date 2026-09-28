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
  const teamDisplayName =
    typeof team === 'string'
      ? team
      : (team as { name?: string } | null)?.name || 'Команда'

  return (
    <div className="pb-36 pt-6">
      {/* Верхний бар */}
      <header className="flex items-center justify-between pb-8">
        <div className="flex items-center gap-3">
          <Image
            src="/icon/logo.svg"
            alt="ПРОФ Логотип"
            width={70}
            height={70}
            loading="eager"
            fetchPriority="high"
            className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(39,204,210,0.4)]"
          />
        </div>

        {/* Плашка команды */}
        <div className="glass-card px-4 py-1.5 rounded-full flex items-center gap-2 border-[#27CCD2]/30 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#27CCD2] animate-pulse" />
          <span className="text-white/60">Команда:</span>
          <span className="font-bold text-white tracking-wide">
            {teamDisplayName}
          </span>
        </div>
      </header>

      {/* Hero-секция */}
      <section className="text-center pt-2 pb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[#F6AFFD] font-bold mb-3">
          XXVIII Студенческая Перспектива
        </p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#27CCD2] to-[#F6AFFD] drop-shadow-[0_0_30px_rgba(39,204,210,0.35)]">
          Импульс
        </h1>
        <p className="text-xs md:text-sm text-white/70 mt-3 font-medium tracking-[0.2em] uppercase">
          Достаточно лишь импульса, чтобы начать
        </p>
      </section>

      {/* Степпер */}
      <div className="mb-8">
        <RoundStepper
          currentRound={currentRound}
          completedRounds={completedRounds}
          onSelectRound={setCurrentRound}
        />
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              description={union.description}
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

      {/* Фиксированный нижний статус-бар */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#042222]/90 backdrop-blur-xl border-t border-white/10 z-30">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full',
                isAllSelected ? 'bg-[#27CCD2]' : 'bg-[#F6AFFD]',
              )}
            />
            <span className="text-xs sm:text-sm text-white/80">
              Заполнено <b>{completedRounds.length} из 6</b> станций маршрута
            </span>
          </div>

          {isConfirmed ? (
            <div className="px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold bg-[#27CCD2]/20 text-[#27CCD2] border border-[#27CCD2]/40 text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Расписание зафиксировано</span>
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!isAllSelected}
              className={cn(
                'w-full sm:w-auto px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300',
                isAllSelected
                  ? 'bg-gradient-to-r from-[#415FFB] via-[#27CCD2] to-[#F6AFFD] text-[#042222] shadow-[0_0_25px_rgba(39,204,210,0.5)] hover:opacity-95 active:scale-95'
                  : 'bg-white/10 text-white/40 cursor-not-allowed',
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Зафиксировать расписание</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Модалка */}
      <UnionInfoModal
        isOpen={Boolean(infoModalUnion)}
        onClose={() => setInfoModalUnion(null)}
        name={infoModalUnion?.name ?? ''}
        description={infoModalUnion?.description}
        fullDescription={infoModalUnion?.fullDescription}
      />
    </div>
  )
}
