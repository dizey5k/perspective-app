'use client'

import { cn } from '@/lib/utils/utils'
import { HelpCircle } from 'lucide-react'

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
        'glass-card p-5 flex flex-col justify-between h-full transition-all duration-300 relative',
        isSelected && 'glass-card-selected',
        isAlreadyBooked && 'opacity-70 bg-black/20',
        isFull && !isAlreadyBooked && 'opacity-50 grayscale-[40%]',
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-extrabold text-base leading-snug text-white">
            {name}
          </h3>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenInfo()
            }}
            title="Подробнее"
            className="w-6 h-6 rounded-full border border-white/20 text-white/50 hover:text-[#27CCD2] hover:border-[#27CCD2] flex items-center justify-center shrink-0 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-white/60 line-clamp-3 leading-relaxed mb-5">
          {description}
        </p>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <span
          className={cn(
            'text-xs font-semibold',
            isSelected
              ? 'text-[#F6AFFD]'
              : isFull
                ? 'text-red-400/80'
                : 'text-[#27CCD2]',
          )}
        >
          {isSelected
            ? 'В вашем маршруте'
            : isAlreadyBooked
              ? `Выбрано в ${alreadySelectedRound} круге`
              : isFull
                ? 'Мест нет'
                : `Осталось мест: ${remainingQuota}`}
        </span>

        <button
          onClick={onSelect}
          disabled={isFull || isSelected || isAlreadyBooked}
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200',
            isSelected
              ? 'bg-[#F6AFFD]/20 text-[#F6AFFD] border border-[#F6AFFD]/50 shadow-[0_0_12px_rgba(246,175,253,0.3)]'
              : isAlreadyBooked
                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                : isFull
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-[#27CCD2]/20 hover:text-[#27CCD2] text-white active:scale-95',
          )}
        >
          {isSelected
            ? '✓ Выбрано'
            : isAlreadyBooked
              ? 'Занято'
              : isFull
                ? 'Мест нет'
                : 'Выбрать'}
        </button>
      </div>
    </div>
  )
}
