import axios from 'axios';

const API_BASE = 'http://localhost:5050/api';

export const getAllNPCStates = async () => {
  const response = await axios.get(`${API_BASE}/npcs/state`);
  return response.data;
};

export const interactWithNPC = async (npc_id, player_dialogue) => {
  const response = await axios.post(`${API_BASE}/npc/interact`, {
    npc_id,
    player_dialogue,
  });
  return response.data;
};


export const triggerThoughtCycle = async (npc_id, world_context = {}, task_description = undefined) => {
  const response = await axios.post(`${API_BASE}/npc/think`, {
    npc_id,
    world_context,
    ...(task_description && { task_description })
  });
  return response.data;
};

// Inscrição na UNAGRO
export const inscreverNaUnagro = async (nomeCompleto) => {
  const response = await axios.post(`${API_BASE}/unagro/inscrever`, { nome: nomeCompleto });
  return response.data;
};
