import { create } from "zustand";

interface useBranchIdStoreProps {
  branchId: number | null;
  setBranchId: (branchId: number) => void;
}

const useBranchIdStore = create<useBranchIdStoreProps>((set) => ({
  branchId: null,
  setBranchId: (newBranchId: number) => set(() => ({ branchId: newBranchId })),
}));

export default useBranchIdStore;
