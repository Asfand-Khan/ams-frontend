import { create } from "zustand";

interface useAttendanceIdStoreProps {
  attendanceId: number | null;
  setAttendanceId: (attendanceId: number) => void;
}

const useAttendanceIdStore = create<useAttendanceIdStoreProps>((set) => ({
  attendanceId: null,
  setAttendanceId: (newAttandanceId: number) =>
    set(() => ({ attendanceId: newAttandanceId })),
}));

export default useAttendanceIdStore;
