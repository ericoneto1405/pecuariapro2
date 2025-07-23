
import React, { useEffect } from 'react';
import useNPCStore from '../state/useNPCStore';
import NPC from './NPC';



const GameWorld = () => {
  const { npcs, fetchNPCs, loading, error } = useNPCStore();

  useEffect(() => {
    fetchNPCs();
    // Atualiza a cada 10 segundos
    const interval = setInterval(fetchNPCs, 10000);
    return () => clearInterval(interval);
  }, [fetchNPCs]);

  if (loading) return <div>Carregando NPCs...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Mundo do Jogo</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {Object.values(npcs).map(npc => (
          <NPC key={npc.id} npc={npc} />
        ))}
      </div>
    </div>
  );
};

export default GameWorld;
