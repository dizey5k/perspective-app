import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Импульс | Перспектива',
  description: 'Система бронирования станций для старост',
  themeColor: '#0a1519',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="font-sans">
        <main className="max-w-6xl mx-auto min-h-screen relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[500px] bg-impulse-glow pointer-events-none -z-10" />

          {children}
        </main>

        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            className: 'glass-card border-fest-accent/50 text-white',
            style: { background: '#12252a' },
          }}
        />
      </body>
    </html>
  )
}
