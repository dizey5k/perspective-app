const prefixes = ['impulse', 'perspective']

export function generateTeamCode(institutePrefix: string): string {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]

  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let suffix = ''
  for (let i = 0; i < 3; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return `${prefix}-${institutePrefix.toLowerCase()}-${suffix}`
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
