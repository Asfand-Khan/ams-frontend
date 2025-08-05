import { create } from "zustand";

interface useDevelopmentOfficerIdStoreProps {
  developmentOfficerId: number | null;
  setDevelopmentOfficerId: (developmentOfficerId: number) => void;
}

const useDevelopmentOfficerIdStore = create<useDevelopmentOfficerIdStoreProps>(
  (set) => ({
    developmentOfficerId: null,
    setDevelopmentOfficerId: (newDevelopmentOfficerId: number) =>
      set(() => ({ developmentOfficerId: newDevelopmentOfficerId })),
  })
);

export default useDevelopmentOfficerIdStore;
