import { create } from "zustand";

interface useAgentIdStoreProps {
  agentId: number | null;
  setAgentId: (agentId: number) => void;
}

const useAgentIdStore = create<useAgentIdStoreProps>((set) => ({
  agentId: null,
  setAgentId: (newAgentId: number) => set(() => ({ agentId: newAgentId })),
}));

export default useAgentIdStore;
