import { create } from 'zustand'

interface PurchaseOrderCounts {
  toOrder: number
  toReceive: number
  completed: number
  canceled: number
  lackingItems: number
}

interface PurchaseOrderStore {
  counts: PurchaseOrderCounts
  setCounts: (counts: PurchaseOrderCounts) => void
}

export const usePurchaseOrderStore = create<PurchaseOrderStore>((set) => ({
  counts: {
    toOrder: 0,
    toReceive: 0,
    completed: 0,
    canceled: 0,
    lackingItems: 0
  },
  setCounts: (counts) => set({ counts })
}))

