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

//status store
interface StatusState {
  status: string | undefined; // The status information
  setStatus: (newStatus: string | undefined) => void; // Action to update status
  resetStatus: () => void; // Action to reset status to default
}

const useStatusStore = create<StatusState>((set) => ({
  status: 'idle', // Initial status
  setStatus: (newStatus) => set({ status: newStatus }), // Update the status
  resetStatus: () => set({ status: 'idle' }), // Reset status to default
}));

export default useStatusStore;

