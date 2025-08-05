import { create } from "zustand";

interface useClientIdStoreProps {
  clientId: number | null;
  setClientId: (clientId: number) => void;
}

const useClientIdStore = create<useClientIdStoreProps>((set) => ({
  clientId: null,
  setClientId: (newClientId: number) => set(() => ({ clientId: newClientId })),
}));

export default useClientIdStore;
