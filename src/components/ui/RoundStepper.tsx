'use client'
import React from 'react'
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
    <div className="flex items-center w-full px-2 py-4">
      {rounds.map((round, index) => {
        const isActive = currentRound === round
        const isCompleted = completedRounds.includes(round)

        return (
          <React.Fragment key={round}>
            {/* Кружок (flex-shrink-0 не дает ему сжиматься) */}
            <button
              onClick={() => onSelectRound(round)}
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                isActive
                  ? 'bg-fest-accent/20 text-fest-accent border border-fest-accent shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                  : isCompleted
                    ? 'bg-fest-blue/20 text-fest-blue border border-fest-blue'
                    : 'bg-fest-surface text-white/50 border border-fest-border hover:bg-white/10',
              )}
            >
              {round}
            </button>

            {/* Тянущаяся линия (flex-1 занимает всё свободное место) */}
            {index < rounds.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-[2px] mx-2 transition-colors',
                  isCompleted ? 'bg-fest-blue/50' : 'bg-fest-border',
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
