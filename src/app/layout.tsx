import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import './globals.css'

const impulseFont = localFont({
  src: '../../public/font/Gropled-Bold.otf',
  variable: '--font-impulse',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Импульс | XXVIII Студенческая Перспектива',
  description: 'Система распределения станций для студенческих команд',
  icons: {
    icon: '/icon/logo.svg',
    shortcut: '/icon/logo.svg',
    apple: '/icon/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={impulseFont.variable}>
      <body className="min-h-screen bg-[#042222] font-sans text-white relative">
        {/* Фоновые орбиты и неоновые сферы */}
        <div className="bg-impulse-glow" />
        <div className="orbit-ring-1" />
        <div className="orbit-ring-2" />

        <main className="max-w-6xl mx-auto px-4 min-h-screen relative z-10 flex flex-col">
          {children}
        </main>

        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            className: 'glass-card border-[#27CCD2]/40 text-white',
            style: { background: '#042222' },
          }}
        />
      </body>
    </html>
  )
}
