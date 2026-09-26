import { ShieldAlert } from 'lucide-react'
import { loginAdmin } from '../actions'

export function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        action={loginAdmin}
        className="glass-card p-8 max-w-sm w-full flex flex-col gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fest-accent to-fest-blue" />
        <div className="flex flex-col items-center gap-2">
          <ShieldAlert className="w-12 h-12 text-fest-accent mb-2" />
          <h1 className="text-2xl font-bold text-center text-white">
            Админ-панель
          </h1>
          <p className="text-white/50 text-sm text-center">
            Доступ только для организаторов
          </p>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Секретный ключ..."
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fest-accent transition-colors"
        />
        <button
          type="submit"
          className="w-full bg-fest-accent text-white font-bold py-3 rounded-xl hover:bg-fest-accent/80 transition-colors shadow-[0_0_15px_rgba(217,70,239,0.3)]"
        >
          Войти в систему
        </button>
      </form>
    </div>
  )
}
