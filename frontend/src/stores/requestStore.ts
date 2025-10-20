import { create } from "zustand"

interface RequestState {
requests: any[]
setRequests: (r: any[]) => void
addRequest: (r: any) => void
updateRequest: (id: string, data: any) => void
}


export const useRequestStore = create<RequestState>((set) => ({
requests: [],
setRequests: (r) => set({ requests: r }),
addRequest: (r) => set((s) => ({ requests: [r, ...s.requests] })),
updateRequest: (id, data) => set((s) => ({ requests: s.requests.map((rq) => rq._id === id ? { ...rq, ...data } : rq) }))
}))