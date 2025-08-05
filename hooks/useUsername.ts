import { create } from "zustand";

interface useUsernameStoreProp {
  username: string | null;
  setUsername: (newUsername: string) => void;
}

const useUsernameStore = create<useUsernameStoreProp>((set) => ({
  username: null,
  setUsername: (newUsername: string) => set(() => ({ username: newUsername })),
}));

export default useUsernameStore;