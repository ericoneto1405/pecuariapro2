import React, { useState } from 'react';
import useNPCStore from '../state/useNPCStore';

const NPC = ({ npcId }) => {
  const { npcs, interact, loading } = useNPCStore();
  const npc = npcs[npcId];
  const [response, setResponse] = useState('');
  const [sending, setSending] = useState(false);

  if (!npc) return <div>NPC não encontrado</div>;

  const handleInteract = async () => {
    const mensagem = prompt('Fale com o NPC:');
    if (mensagem) {
      setSending(true);
      setResponse('');
      try {
        const res = await interact(npcId, mensagem);
        setResponse(res.dialogue || res.current_dialogue || '(Sem resposta)');
      } catch (err) {
        setResponse('Erro ao interagir');
      }
      setSending(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, minWidth: 200 }}>
      <h3>{npc.name}</h3>
      <div>Humor: {npc.mood}</div>
      <div>Ação: {npc.current_action?.type}</div>
      <div style={{ margin: '8px 0' }}>
        <button onClick={handleInteract} disabled={sending || loading}>
          {sending ? 'Enviando...' : 'Interagir'}
        </button>
      </div>
      {/* Mostra resposta local ou diálogo atual do NPC */}
      {(response || npc.current_dialogue) && (
        <div style={{ background: '#f9f9f9', color: '#222', padding: 6, borderRadius: 4, marginTop: 8, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
          NPC: {response || npc.current_dialogue}
        </div>
      )}
    </div>
  );
};

export default NPC;
