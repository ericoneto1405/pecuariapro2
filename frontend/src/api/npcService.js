const API_BASE = 'http://localhost:5001/api';

export async function getAllNPCStates() {
  const res = await fetch(`${API_BASE}/npcs/state`);
  if (!res.ok) throw new Error('Erro ao buscar estados dos NPCs');
  return res.json();
}

export async function interactWithNPC(npc_id, player_dialogue) {
  const res = await fetch(`${API_BASE}/npc/interact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ npc_id, player_dialogue })
  });
  if (!res.ok) throw new Error('Erro ao interagir com NPC');
  return res.json();
}
