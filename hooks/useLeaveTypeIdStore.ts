import { create } from "zustand";

interface useLeaveTypeIdStoreProps {
  leaveTypeId: number | null;
  setLeaveTypeId: (leaveTypeId: number) => void;
}

const useLeaveTypeIdStore = create<useLeaveTypeIdStoreProps>((set) => ({
  leaveTypeId: null,
  setLeaveTypeId: (newLeaveTypeId: number) => set(() => ({ leaveTypeId: newLeaveTypeId })),
}));

export default useLeaveTypeIdStore;
