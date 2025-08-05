import { create } from "zustand";

interface useCourierIdStoreProps {
  courierId: number | null;
  setCourierId: (courierId: number) => void;
}

const useCourierIdStore = create<useCourierIdStoreProps>((set) => ({
  courierId: null,
  setCourierId: (newCourierId: number) => set(() => ({ courierId: newCourierId })),
}));

export default useCourierIdStore;
