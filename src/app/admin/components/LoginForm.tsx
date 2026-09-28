import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'
import { loginAdmin } from '../actions'

export function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <form
        action={loginAdmin}
        className="glass-card p-8 max-w-sm w-full flex flex-col gap-6 relative overflow-hidden border-white/15"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#415FFB] via-[#27CCD2] to-[#F6AFFD]" />

        <div className="flex flex-col items-center gap-2">
          <div className="mb-2">
            <Image
              src="/icon/logo.svg"
              alt="ПРОФ"
              width={42}
              height={42}
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(39,204,210,0.5)]"
              priority
            />
          </div>
          <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#27CCD2] to-[#F6AFFD] uppercase tracking-wider text-center">
            Админ-панель
          </h1>
          <p className="text-white/50 text-xs text-center tracking-wide">
            XXVIII Перспектива • Организаторы
          </p>
        </div>

        <input
          type="password"
          name="password"
          placeholder="Секретный ключ доступа..."
          required
          className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#27CCD2] focus:ring-1 focus:ring-[#27CCD2] transition-colors"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-[#042222] bg-gradient-to-r from-[#415FFB] via-[#27CCD2] to-[#F6AFFD] shadow-[0_0_20px_rgba(39,204,210,0.4)] hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Войти в систему</span>
        </button>
      </form>
    </div>
  )
}
