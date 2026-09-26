import { EventEmitter } from 'events'
import type { QuotaUpdatePayload } from '@/types'

class SSEBroker extends EventEmitter {
  public broadcast(data: QuotaUpdatePayload) {
    this.emit('quota_updated', data)
  }
}

const globalForSse = globalThis as unknown as {
  sseBroker: SSEBroker | undefined
}

export const sseBroker = globalForSse.sseBroker ?? new SSEBroker()

if (process.env.NODE_ENV !== 'production') globalForSse.sseBroker = sseBroker
