'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface UnionInfoModalProps {
  isOpen: boolean
  onClose: () => void
  name: string
  description?: string | null
  fullDescription?: string | null
}

export function UnionInfoModal({
  isOpen,
  onClose,
  name,
  description,
  fullDescription,
}: UnionInfoModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-[fadeIn_0.25s_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-white/15 bg-[#0f131a] p-6 shadow-2xl flex flex-col max-h-[85vh] animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] sm:animate-[scaleUp_0.25s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Шапка модалки */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4 shrink-0">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-fest-accent">
              Студенческое объединение
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5 leading-snug">
              {name}
            </h3>
            {description && (
              <p className="text-xs text-white/50 mt-1">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Контент с плавной прокруткой */}
        <div className="mt-4 overflow-y-auto pr-1 text-sm leading-relaxed text-white/85 whitespace-pre-line space-y-3 font-normal">
          {fullDescription || description || 'Описание скоро появится.'}
        </div>

        {/* Нижняя кнопка */}
        <div className="mt-6 pt-3 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all active:scale-[0.98]"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  )
}
