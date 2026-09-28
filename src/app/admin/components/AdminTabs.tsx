'use client'

import { useState } from 'react'
import { Users, MapPin } from 'lucide-react'
import { AdminDashboard } from './AdminDashboard'
import { UnionsDashboard } from './UnionsDashboard'

export function AdminTabs({ teamsData, unionsData }: any) {
  const [activeTab, setActiveTab] = useState<'teams' | 'unions'>('teams')

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      {/* Навигация (Вкладки) */}
      <div className="flex gap-1.5 mb-8 glass-card p-1.5 rounded-2xl w-fit border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('teams')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'teams'
              ? 'bg-[#415FFB] text-white shadow-[0_0_15px_rgba(65,95,251,0.6)]'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" /> Команды
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('unions')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'unions'
              ? 'bg-[#27CCD2] text-[#042222] shadow-[0_0_15px_rgba(39,204,210,0.5)]'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <MapPin className="w-4 h-4" /> Станции
        </button>
      </div>

      {/* Контент активной вкладки */}
      <div className="animate-[fadeIn_0.25s_ease-out]">
        {activeTab === 'teams' ? (
          <AdminDashboard teamsData={teamsData} />
        ) : (
          <UnionsDashboard unionsData={unionsData} />
        )}
      </div>
    </div>
  )
}
