import { create } from "zustand";

interface useCallUsIdStoreProps {
  callUsId: number | null;
  setCallUsId: (callUsId: number) => void;
}

const useCallUsIdStore = create<useCallUsIdStoreProps>((set) => ({
  callUsId: null,
  setCallUsId: (newCallUsId: number) => set(() => ({ callUsId: newCallUsId })),
}));

export default useCallUsIdStore;
