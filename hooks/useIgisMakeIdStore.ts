import { create } from "zustand";

interface useIgisMakeIdStoreProps {
  igisMakeId: number | null;
  setIgisMakeId: (igisMakeId: number) => void;
}

const useIgisMakeIdStore = create<useIgisMakeIdStoreProps>(
  (set) => ({
    igisMakeId: null,
    setIgisMakeId: (newIgisMakeId: number) =>
      set(() => ({ igisMakeId: newIgisMakeId })),
  })
);

export default useIgisMakeIdStore;
