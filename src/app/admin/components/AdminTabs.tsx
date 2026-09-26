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
      <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-xl w-fit border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('teams')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
            activeTab === 'teams'
              ? 'bg-fest-accent text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" /> Команды
        </button>
        <button
          onClick={() => setActiveTab('unions')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
            activeTab === 'unions'
              ? 'bg-fest-blue text-white shadow-[0_0_15px_rgba(0,212,255,0.4)]'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <MapPin className="w-4 h-4" /> Станции
        </button>
      </div>

      {/* Контент активной вкладки */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'teams' ? (
          <AdminDashboard teamsData={teamsData} />
        ) : (
          <UnionsDashboard unionsData={unionsData} />
        )}
      </div>
    </div>
  )
}
