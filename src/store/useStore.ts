import { create } from 'zustand'

export type Union = {
  id: number
  name: string
  description: string
  fullDescription?: string | null
}

export type Quota = {
  roundNumber: number
  unionId: number
  totalQuota: number
  remainingQuota: number
}

export type Booking = {
  roundNumber: number
  unionId: number
}

export type Team = {
  id: number
  name: string
  isConfirmed: boolean
}

interface AppState {
  team: Team | null
  unions: Union[]
  quotas: Quota[]
  currentRound: number
  myBookings: Booking[]
  isConfirmed: boolean

  // Actions
  setTeam: (team: Team | null) => void
  setUnions: (unions: Union[]) => void
  setQuotas: (quotas: Quota[]) => void
  updateQuota: (
    roundNumber: number,
    unionId: number,
    remainingQuota: number,
  ) => void
  setCurrentRound: (round: number) => void
  setMyBookings: (bookings: Booking[]) => void
  setIsConfirmed: (status: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  team: null,
  unions: [],
  quotas: [],
  currentRound: 1,
  myBookings: [],
  isConfirmed: false,

  setTeam: (team) => set({ team }),
  setUnions: (unions) => set({ unions }),
  setQuotas: (quotas) => set({ quotas }),

  updateQuota: (roundNumber, unionId, remainingQuota) =>
    set((state) => ({
      quotas: state.quotas.map((q) =>
        q.roundNumber === roundNumber && q.unionId === unionId
          ? { ...q, remainingQuota }
          : q,
      ),
    })),

  setCurrentRound: (round) => set({ currentRound: round }),
  setMyBookings: (bookings) => set({ myBookings: bookings }),
  setIsConfirmed: (status) => set({ isConfirmed: status }),
}))
