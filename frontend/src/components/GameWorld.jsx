import React, { useEffect } from 'react';
import useNPCStore from '../state/useNPCStore';
import NPC from './NPC';

const GameWorld = () => {
  const { npcs, fetchNPCs, loading, error } = useNPCStore();

  useEffect(() => {
    fetchNPCs();
    const interval = setInterval(fetchNPCs, 5000); // Atualiza a cada 5s
    return () => clearInterval(interval);
  }, [fetchNPCs]);

  if (loading) return <div>Carregando NPCs...</div>;
  if (error) return <div>Erro ao carregar NPCs</div>;

  return (
    <div className="game-world">
      <h2>Mundo do Jogo</h2>
      <div className="npc-list">
        {Object.keys(npcs).length === 0 && <div>Nenhum NPC encontrado</div>}
        {Object.keys(npcs).map(npcId => (
          <NPC key={npcId} npcId={npcId} />
        ))}
      </div>
    </div>
  );
};

export default GameWorld;
