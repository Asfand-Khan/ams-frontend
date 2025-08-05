import { create } from "zustand";

interface useIgisSubMakeIdStoreProps {
  igisSubMakeId: number | null;
  setIgisMakeId: (igisSubMakeId: number) => void;
}

const useIgisSubMakeIdStore = create<useIgisSubMakeIdStoreProps>(
  (set) => ({
    igisSubMakeId: null,
    setIgisMakeId: (newIgisSubMakeId: number) =>
      set(() => ({ igisSubMakeId: newIgisSubMakeId })),
  })
);

export default useIgisSubMakeIdStore;
