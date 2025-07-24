import { create } from 'zustand';
import { getAllNPCStates, interactWithNPC, triggerThoughtCycle } from '../api/npcService';

const useNPCStore = create((set, get) => ({
  npcs: {},
  loading: false,
  error: null,

  fetchNPCs: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllNPCStates();
      set({ npcs: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  interact: async (npc_id, player_dialogue) => {
    set({ loading: true, error: null });
    try {
      const response = await interactWithNPC(npc_id, player_dialogue);
      set(state => ({
        npcs: {
          ...state.npcs,
          [npc_id]: {
            ...state.npcs[npc_id],
            ...response
          }
        },
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error, loading: false });
      return null;
    }
  },

  think: async (npc_id, world_context = {}, task_description) => {
    set({ loading: true, error: null });
    try {
      const response = await triggerThoughtCycle(npc_id, world_context, task_description);
      set(state => ({
        npcs: {
          ...state.npcs,
          [npc_id]: {
            ...state.npcs[npc_id],
            ...response
          }
        },
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error, loading: false });
      return null;
    }
  }
}));

export default useNPCStore;
