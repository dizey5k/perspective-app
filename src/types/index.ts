export interface LoginRequest {
  code: string
}

export interface LoginResponse {
  team: {
    id: number
    name: string
    isConfirmed: boolean
  }
  currentBookings: Record<number, number>
}

export interface BookSlotRequest {
  roundNumber: number // 1..6
  unionId: number
}

export type SSEEventType = 'QUOTA_UPDATED' | 'CONNECTED'

export interface QuotaUpdatePayload {
  roundNumber: number
  unionId: number
  remainingQuota: number
}

export interface SSEMessage {
  type: SSEEventType
  data: QuotaUpdatePayload | { message: string }
}
