import { create } from "zustand";

interface useUserIdStoreProps {
  userId: number | null;
  setUserId: (userId: number | null) => void;
}
const useUserIdStore = create<useUserIdStoreProps>((set) => ({
  userId: null,
  setUserId: (newUserId) => set(() => ({ userId: newUserId })),
}));

export default useUserIdStore;
