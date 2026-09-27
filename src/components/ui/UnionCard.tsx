'use client'

import { cn } from '@/lib/utils/utils'
import { Check, HelpCircle, Route } from 'lucide-react'

interface UnionCardProps {
  name: string
  description: string | null
  remainingQuota: number
  isSelected: boolean
  alreadySelectedRound: number | null
  onSelect: () => void
  onOpenInfo: () => void
}

export function UnionCard({
  name,
  description,
  remainingQuota,
  isSelected,
  alreadySelectedRound,
  onSelect,
  onOpenInfo,
}: UnionCardProps) {
  const isFull = remainingQuota === 0 && !isSelected
  const isAlreadyBooked = alreadySelectedRound !== null

  return (
    <div
      className={cn(
        'glass-card p-5 flex flex-col h-full transition-all duration-300',
        isSelected &&
          'border-fest-accent shadow-[0_0_20px_rgba(217,70,239,0.15)] bg-fest-accent/5',
        isAlreadyBooked && 'opacity-80 border-fest-blue/20 bg-black/20',
        isFull && !isAlreadyBooked && 'opacity-60 grayscale-[50%]',
      )}
    >
      <div className="flex justify-between items-start gap-3 flex-1 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg leading-tight text-white truncate">
              {name}
            </h3>

            {/* Иконка вопроса */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpenInfo()
              }}
              title="Подробнее об объединении"
              className="p-1 rounded-full text-white/40 hover:text-fest-accent hover:bg-white/5 transition-all shrink-0 active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-white/60 mt-2 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Бейдж */}
        <div
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shrink-0',
            isSelected
              ? 'bg-fest-accent/20 text-fest-accent border-fest-accent'
              : isAlreadyBooked
                ? 'bg-fest-blue/10 text-fest-blue/70 border-fest-blue/30'
                : isFull
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : 'bg-fest-blue/20 text-fest-blue border-fest-blue/50',
          )}
        >
          {isSelected
            ? 'Ваш выбор'
            : isAlreadyBooked
              ? `Круг ${alreadySelectedRound}`
              : isFull
                ? 'Мест нет'
                : `Мест: ${remainingQuota}`}
        </div>
      </div>

      {/* Кнопка выбора */}
      <button
        onClick={onSelect}
        disabled={isFull || isSelected || isAlreadyBooked}
        className={cn(
          'w-full mt-auto py-2.5 rounded-xl font-semibold transition-all duration-300',
          isSelected
            ? 'bg-fest-accent/20 text-fest-accent border border-fest-accent/30 shadow-[0_0_15px_rgba(217,70,239,0.2)] cursor-default'
            : isAlreadyBooked
              ? 'bg-white/5 text-white/40 border border-white/10 cursor-not-allowed'
              : isFull
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/5 active:scale-[0.98]',
        )}
      >
        {isSelected ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> Ваш выбор
          </span>
        ) : isAlreadyBooked ? (
          <span className="flex items-center justify-center gap-2">
            <Route className="w-4 h-4" /> Уже в маршруте
          </span>
        ) : (
          'Выбрать'
        )}
      </button>
    </div>
  )
}
