'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { KeyRound, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toLowerCase() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Неверный код доступа')
      }

      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка авторизации'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 flex flex-col items-center relative overflow-hidden">
        {/* Декоративное свечение внутри карточки */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-fest-accent/20 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center mb-8 z-10">
          <p className="text-fest-accent text-xs font-bold tracking-widest uppercase mb-2">
            Вход для команд
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            Импульс
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="w-full z-10 flex flex-col gap-4"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-white/40" />
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Введите код (например: impulse-iknk-x7f)"
              className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-fest-accent focus:ring-1 focus:ring-fest-accent transition-all"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full py-3.5 mt-2 rounded-xl flex items-center justify-center gap-2 font-bold text-white bg-gradient-to-r from-fest-accent to-fest-blue shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Войти в систему</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
