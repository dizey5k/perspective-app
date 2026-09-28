'use client'

import Image from 'next/image'
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
      if (!res.ok) throw new Error(data.error || 'Неверный код доступа')

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
      <div className="w-full max-w-md glass-card p-6 sm:p-8 flex flex-col items-center relative overflow-hidden border-white/15">
        <div className="mb-4">
          <Image
            src="/icon/logo.svg"
            alt="ПРОФ"
            width={64}
            height={64}
            loading="eager"
            fetchPriority="high"
            className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(39,204,210,0.5)]"
          />
        </div>

        <div className="text-center mb-6 sm:mb-8 z-10">
          <p className="text-[#F6AFFD] text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-2">
            XXVIII Студенческая Перспектива
          </p>
          <h1 className="font-impulse text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#27CCD2] to-[#F6AFFD] uppercase tracking-wider drop-shadow-[0_0_20px_rgba(39,204,210,0.4)]">
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
              placeholder="Введите код (например: impulse-iknk-47g)"
              className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#27CCD2] focus:ring-1 focus:ring-[#27CCD2] transition-all"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full py-3.5 mt-2 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider text-[#042222] bg-gradient-to-r from-[#415FFB] via-[#27CCD2] to-[#F6AFFD] shadow-[0_0_20px_rgba(39,204,210,0.4)] hover:opacity-95 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#042222] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Войти в систему</span>
                <ArrowRight className="w-4 h-4 text-[#042222]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
