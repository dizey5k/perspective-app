'use client'

import { cn } from '@/lib/utils/utils'

interface StepperProps {
  currentRound: number
  completedRounds: number[]
  onSelectRound: (round: number) => void
}

export function RoundStepper({
  currentRound,
  completedRounds,
  onSelectRound,
}: StepperProps) {
  const rounds = [1, 2, 3, 4, 5, 6]

  return (
    <div className="glass-card p-1.5 rounded-2xl flex items-center justify-between gap-1 max-w-xl mx-auto w-full border-white/10">
      {rounds.map((round) => {
        const isActive = currentRound === round
        const isCompleted = completedRounds.includes(round)

        return (
          <button
            key={round}
            type="button"
            onClick={() => onSelectRound(round)}
            className={cn(
              'flex-1 py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all duration-200 text-center whitespace-nowrap',
              isActive
                ? 'bg-[#415FFB] text-white shadow-[0_0_15px_rgba(65,95,251,0.6)]'
                : isCompleted
                  ? 'text-[#27CCD2] hover:bg-white/5'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5',
            )}
          >
            {round} Круг
          </button>
        )
      })}
    </div>
  )
}
