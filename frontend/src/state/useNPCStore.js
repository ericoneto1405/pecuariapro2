import { create } from 'zustand';
import { getAllNPCStates, interactWithNPC } from '../api/npcService';

const useNPCStore = create((set, get) => ({
  npcs: {},
  loading: false,
  error: null,

  fetchNPCs: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllNPCStates();
      set({ npcs: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  interact: async (npc_id, player_dialogue) => {
    set({ loading: true, error: null });
    try {
      const response = await interactWithNPC(npc_id, player_dialogue);
      // Atualiza apenas o NPC interagido
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
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  }
}));

export default useNPCStore;
