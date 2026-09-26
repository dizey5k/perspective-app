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
    <div className="glass-card overflow-hidden">
      {/* Изменили сетку: 3-5-2-2 */}
      <div className="grid grid-cols-12 gap-4 border-b border-white/10 text-white/50 text-sm bg-white/[0.02] p-5 font-medium hidden md:grid">
        <div className="col-span-3">Название станции</div>
        <div className="col-span-5">Описание</div>
        <div className="col-span-2 text-center">Мест на круг</div>
        <div className="col-span-2 text-right">Действие</div>
      </div>

      <div className="flex flex-col">
        {unionsData.map((union) => (
          <form
            key={union.id}
            action={updateUnion}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 border-b border-white/5 hover:bg-white/[0.01] transition-colors items-start"
          >
            <input type="hidden" name="unionId" value={union.id} />

            <div className="md:col-span-3">
              <input
                type="text"
                name="name"
                defaultValue={union.name}
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fest-accent transition-colors"
              />
            </div>

            <div className="md:col-span-5">
              <textarea
                name="description"
                defaultValue={union.description}
                required
                rows={2}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fest-blue transition-colors resize-none"
              />
            </div>

            {/* НОВОЕ ПОЛЕ: Квота */}
            <div className="md:col-span-2 flex items-center justify-center">
              <input
                type="number"
                name="quota"
                defaultValue={union.quota}
                min="1"
                max="20"
                required
                className="w-20 text-center bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-fest-accent transition-colors"
              />
            </div>

            <div className="md:col-span-2 flex items-start justify-end gap-2">
              <button
                type="submit"
                title="Сохранить изменения"
                className="bg-white/5 text-white border border-white/10 hover:bg-fest-accent/20 hover:text-fest-accent hover:border-fest-accent/30 p-2.5 rounded-lg transition-all"
              >
                <Save className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteClick(union.id, union.name)}
                title="Удалить станцию"
                className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 p-2.5 rounded-lg transition-all"
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
