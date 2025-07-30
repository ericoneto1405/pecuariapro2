const API_BASE = 'http://localhost:5050/api';

export async function getFazendasNPCs() {
  const res = await fetch(`${API_BASE}/npcs/fazendas`);
  if (!res.ok) throw new Error('Erro ao buscar fazendas dos NPCs');
  const data = await res.json();
  return data.fazendas_npcs;
}

export async function npcVenderAnimal(npc_id, animal, valor) {
  const res = await fetch(`${API_BASE}/npcs/vender_animal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ npc_id, animal, valor })
  });
  if (!res.ok) throw new Error('Erro ao vender animal');
  const data = await res.json();
  return data;
}

export const interactWithNpc = async (npcId) => {
  try {
    const response = await fetch(`${API_BASE}/npc/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ npc_id: npcId }),
    });
    if (!response.ok) throw new Error('Falha na interação');
    return await response.json(); // Deve retornar { dialogue: "..." }
  } catch (error) {
    console.error("Erro ao interagir com o NPC:", error);
    return { dialogue: "O NPC parece ocupado e não respondeu." };
  }
};

export const comprarItemNpc = async (npcId, animalId) => {
  try {
    const response = await fetch(`${API_BASE}/npc/comercio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ npc_id: npcId, animalId: animalId }),
    });
    return await response.json(); // Retorna { sucesso: true/false, mensagem: "..." }
  } catch (error) {
    console.error("Erro ao realizar a compra:", error);
    return { sucesso: false, mensagem: "Erro de comunicação com o servidor." };
  }
};

export const executarProtocoloIatf = async (ownerId, planoInseminacao) => {
  try {
    const response = await fetch(`${API_BASE}/npc/reproduzir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        owner_id: ownerId, 
        plano_inseminacao: planoInseminacao 
      }),
    });
    return await response.json(); // Retorna { sucesso: true/false, mensagem: "...", resultados: {...} }
  } catch (error) {
    console.error("Erro ao executar protocolo IATF:", error);
    return { 
      sucesso: false, 
      mensagem: "Erro de comunicação com o servidor." 
    };
  }
};
