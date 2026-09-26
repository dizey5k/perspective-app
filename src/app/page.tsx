'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Info, Lock } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useLiveQuotas } from '@/hooks/useLiveQuotas'
import { fetchAppState, submitBooking, confirmSchedule } from '@/lib/api'
import { RoundStepper } from '@/components/ui/RoundStepper'
import { UnionCard } from '@/components/ui/UnionCard'
import { cn } from '@/lib/utils/utils'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  const {
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
  } = useStore()

  useLiveQuotas()

  useEffect(() => {
    fetchAppState()
      .then((data) => {
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
  }, [setUnions, setQuotas, setMyBookings, setIsConfirmed])

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
      toast.error('Не удалось выбрать станцию', {
        description: message,
      })
    }
  }

  const handleConfirm = async () => {
    try {
      await confirmSchedule()
      setIsConfirmed(true)
      toast.success('Расписание зафиксировано!', {
        description:
          'Ваш маршрут успешно сохранен и больше не может быть изменен.',
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Сбой при сохранении маршрута'
      toast.error('Не удалось зафиксировать расписание', {
        description: message,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-fest-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const completedRounds = myBookings.map((b) => b.roundNumber)
  const isAllSelected = completedRounds.length === 6

  return (
    <div className="relative min-h-screen pb-32 flex flex-col">
      {/* Шапка */}
      <header className="pt-10 pb-4 px-4 text-center z-10">
        <p className="text-fest-accent text-xs font-bold tracking-widest uppercase mb-2">
          XXVIII Студенческая Перспектива
        </p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
          Импульс
        </h1>
        <p className="text-white/60 text-sm mt-2 font-medium">
          Движение начинается с тебя
        </p>
      </header>

      {/* Степпер (Липкий, чтобы всегда был под рукой при скролле) */}
      <div className="sticky top-0 z-20 bg-fest-bg/80 backdrop-blur-md px-4 py-2 border-b border-white/5">
        <div className="mb-2 text-center text-sm font-semibold text-white/80">
          Круг {currentRound} из 6
        </div>
        <RoundStepper
          currentRound={currentRound}
          completedRounds={completedRounds}
          onSelectRound={setCurrentRound}
        />
      </div>

      {/* НОВЫЙ БЛОК: Информационная подсказка */}
      <div className="px-4 mt-4 z-10">
        <div className="glass-card bg-fest-blue/5 border-fest-blue/20 p-4 flex gap-3 items-start">
          <Info className="w-5 h-5 text-fest-blue shrink-0 mt-0.5" />
          <p className="text-sm text-white/80 leading-relaxed">
            В каждом круге можно выбрать только <b>одну</b> станцию. Чтобы
            изменить решение — просто выберите другую карточку. После нажатия
            «Подтвердить расписание» изменения станут недоступны.
          </p>
        </div>
      </div>

      {/* Список карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mt-6 z-10">
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
              alreadySelectedRound={alreadySelectedRound} // Передаем пропс
              onSelect={() => handleBook(union.id)}
            />
          )
        })}
      </div>

      {/* Плавающая панель подтверждения расписания */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 p-4 bg-fest-bg/90 backdrop-blur-xl border-t border-fest-border z-30 transition-transform duration-500',
          isAllSelected || isConfirmed ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="max-w-md mx-auto">
          {isConfirmed ? (
            <div className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold bg-green-500/20 text-green-400 border border-green-500/30">
              <CheckCircle2 className="w-5 h-5" />
              <span>Расписание зафиксировано</span>
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-white bg-gradient-to-r from-fest-accent to-fest-blue shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:opacity-90 active:scale-95 transition-all"
            >
              <Lock className="w-5 h-5" />
              <span>Подтвердить расписание</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
