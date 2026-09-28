'use client'

import { Save, Trash2 } from 'lucide-react'
import { updateUnion, deleteUnionAction } from '../actions'
import { toast } from 'sonner'

type Union = {
  id: number
  name: string
  description: string
  quota: number
}

interface UnionsDashboardProps {
  unionsData: Union[]
}

export function UnionsDashboard({ unionsData }: UnionsDashboardProps) {
  const handleDeleteClick = (unionId: number, unionName: string) => {
    toast(`Удалить станцию «${unionName}»?`, {
      description: 'Это действие необратимо.',
      action: {
        label: 'Удалить',
        onClick: async () => {
          const res = await deleteUnionAction(unionId)
          if (res?.success) {
            toast.success('Станция успешно удалена')
          } else {
            toast.error(res?.error || 'Произошла ошибка при удалении')
          }
        },
      },
      cancel: { label: 'Отмена', onClick: () => {} },
    })
  }

  return (
    <div className="glass-card overflow-hidden border-white/15">
      <div className="grid grid-cols-12 gap-4 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider bg-white/[0.02] p-5 font-bold hidden md:grid">
        <div className="col-span-3">Название станции</div>
        <div className="col-span-5">Описание</div>
        <div className="col-span-2 text-center">Мест на круг</div>
        <div className="col-span-2 text-right">Действие</div>
      </div>

      <div className="divide-y divide-white/5 flex flex-col">
        {unionsData.map((union) => (
          <form
            key={union.id}
            action={updateUnion}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 hover:bg-white/[0.015] transition-colors items-start"
          >
            <input type="hidden" name="unionId" value={union.id} />

            <div className="md:col-span-3">
              <input
                type="text"
                name="name"
                defaultValue={union.name}
                required
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-[#27CCD2] focus:ring-1 focus:ring-[#27CCD2] transition-colors"
              />
            </div>

            <div className="md:col-span-5">
              <textarea
                name="description"
                defaultValue={union.description}
                required
                rows={2}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs leading-relaxed focus:outline-none focus:border-[#415FFB] focus:ring-1 focus:ring-[#415FFB] transition-colors resize-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-center">
              <input
                type="number"
                name="quota"
                defaultValue={union.quota}
                min="1"
                max="20"
                required
                className="w-20 text-center bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-[#27CCD2] font-black text-sm focus:outline-none focus:border-[#27CCD2] focus:ring-1 focus:ring-[#27CCD2] transition-colors"
              />
            </div>

            <div className="md:col-span-2 flex items-start justify-end gap-2">
              <button
                type="submit"
                title="Сохранить изменения"
                className="bg-white/5 text-white border border-white/15 hover:bg-[#27CCD2]/20 hover:text-[#27CCD2] hover:border-[#27CCD2]/40 p-2.5 rounded-xl transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteClick(union.id, union.name)}
                title="Удалить станцию"
                className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 p-2.5 rounded-xl transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  )
}
