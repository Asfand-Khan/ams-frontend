import { create } from "zustand";

interface useCityIdStoreProps {
  cityId: number | null;
  setCityId: (cityId: number) => void;
}

const useCityIdStore = create<useCityIdStoreProps>((set) => ({
  cityId: null,
  setCityId: (newCityId: number) => set(() => ({ cityId: newCityId })),
}));

export default useCityIdStore;
