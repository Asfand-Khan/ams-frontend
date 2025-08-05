import { create } from "zustand";

interface useBusinessRegionIdStoreProps {
  businessRegionId: number | null;
  setBusinessRegionId: (businessRegionId: number) => void;
}

const useBusinessRegionIdStore = create<useBusinessRegionIdStoreProps>(
  (set) => ({
    businessRegionId: null,
    setBusinessRegionId: (newBusinessRegionId: number) =>
      set(() => ({ businessRegionId: newBusinessRegionId })),
  })
);

export default useBusinessRegionIdStore;
