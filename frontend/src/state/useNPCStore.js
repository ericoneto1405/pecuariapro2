import { create } from 'zustand';
import { getAllNPCStates, interactWithNPC, triggerThoughtCycle } from '../api/npcService';

// Dados reais virão do backend
const useNPCStore = create((set, get) => ({
  npcs: [],
  npcActions: {},
  loading: false,
  error: null,

  fetchNPCs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllNPCStates();
      // O endpoint retorna { data_jogo, npcs_state }
      const npcsData = response.npcs_state || {};
      // Converter o objeto de NPCs em array para compatibilidade
      const npcsArray = Object.values(npcsData);
      set({ npcs: npcsArray, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  setNPCAction: (npcId, action) => set(state => ({
    npcActions: { ...state.npcActions, [npcId]: action }
  })),

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
