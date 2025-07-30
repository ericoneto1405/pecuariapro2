// src/components/NPCMapLayer.jsx
import React, { useEffect, useState } from 'react';
import useNPCStore from '../state/useNPCStore';
import NegociacaoModal from './NegociacaoModal';

// Pixel arts de fazendeiros por persona
const npcPixelArts = {
  tradicionalista: {
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
        {/* Chapéu */}
        <rect x="8" y="4" width="16" height="4" fill="#8B4513"/>
        <rect x="6" y="6" width="20" height="2" fill="#654321"/>
        {/* Cabeça */}
        <rect x="10" y="8" width="12" height="10" fill="#FFD700"/>
        {/* Olhos */}
        <rect x="12" y="10" width="2" height="2" fill="#000"/>
        <rect x="18" y="10" width="2" height="2" fill="#000"/>
        {/* Boca */}
        <rect x="14" y="14" width="4" height="2" fill="#8B0000"/>
        {/* Corpo */}
        <rect x="8" y="18" width="16" height="12" fill="#228B22"/>
        {/* Braços */}
        <rect x="4" y="20" width="4" height="8" fill="#FFD700"/>
        <rect x="24" y="20" width="4" height="8" fill="#FFD700"/>
        {/* Mãos */}
        <rect x="2" y="28" width="6" height="4" fill="#FFD700"/>
        <rect x="24" y="28" width="6" height="4" fill="#FFD700"/>
        {/* Botas */}
        <rect x="10" y="30" width="4" height="2" fill="#654321"/>
        <rect x="18" y="30" width="4" height="2" fill="#654321"/>
      </svg>
    ),
    color: '#228B22'
  },
  inovador: {
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
        {/* Chapéu de cowboy */}
        <rect x="6" y="2" width="20" height="6" fill="#8B4513"/>
        <rect x="4" y="4" width="24" height="2" fill="#654321"/>
        <rect x="8" y="6" width="16" height="2" fill="#8B4513"/>
        {/* Cabeça */}
        <rect x="10" y="8" width="12" height="10" fill="#FFD700"/>
        {/* Olhos com óculos */}
        <rect x="11" y="10" width="3" height="3" fill="#000"/>
        <rect x="18" y="10" width="3" height="3" fill="#000"/>
        <rect x="14" y="11" width="4" height="1" fill="#000"/>
        {/* Boca */}
        <rect x="14" y="14" width="4" height="2" fill="#8B0000"/>
        {/* Corpo com colete */}
        <rect x="8" y="18" width="16" height="12" fill="#4169E1"/>
        <rect x="10" y="18" width="12" height="12" fill="#FFD700"/>
        {/* Braços */}
        <rect x="4" y="20" width="4" height="8" fill="#FFD700"/>
        <rect x="24" y="20" width="4" height="8" fill="#FFD700"/>
        {/* Mãos */}
        <rect x="2" y="28" width="6" height="4" fill="#FFD700"/>
        <rect x="24" y="28" width="6" height="4" fill="#FFD700"/>
        {/* Botas */}
        <rect x="10" y="30" width="4" height="2" fill="#654321"/>
        <rect x="18" y="30" width="4" height="2" fill="#654321"/>
      </svg>
    ),
    color: '#4169E1'
  },
  politico: {
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
        {/* Chapéu formal */}
        <rect x="8" y="2" width="16" height="4" fill="#2F4F4F"/>
        <rect x="6" y="4" width="20" height="2" fill="#1C1C1C"/>
        {/* Cabeça */}
        <rect x="10" y="6" width="12" height="10" fill="#FFD700"/>
        {/* Olhos */}
        <rect x="12" y="8" width="2" height="2" fill="#000"/>
        <rect x="18" y="8" width="2" height="2" fill="#000"/>
        {/* Boca */}
        <rect x="14" y="12" width="4" height="2" fill="#8B0000"/>
        {/* Corpo com terno */}
        <rect x="8" y="16" width="16" height="14" fill="#2F4F4F"/>
        <rect x="10" y="16" width="12" height="14" fill="#1C1C1C"/>
        {/* Braços */}
        <rect x="4" y="18" width="4" height="10" fill="#FFD700"/>
        <rect x="24" y="18" width="4" height="10" fill="#FFD700"/>
        {/* Mãos */}
        <rect x="2" y="28" width="6" height="4" fill="#FFD700"/>
        <rect x="24" y="28" width="6" height="4" fill="#FFD700"/>
        {/* Sapatos */}
        <rect x="10" y="30" width="4" height="2" fill="#1C1C1C"/>
        <rect x="18" y="30" width="4" height="2" fill="#1C1C1C"/>
      </svg>
    ),
    color: '#2F4F4F'
  },
  default: {
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
        {/* Cabeça */}
        <rect x="10" y="6" width="12" height="10" fill="#FFD700"/>
        {/* Olhos */}
        <rect x="12" y="8" width="2" height="2" fill="#000"/>
        <rect x="18" y="8" width="2" height="2" fill="#000"/>
        {/* Boca */}
        <rect x="14" y="12" width="4" height="2" fill="#8B0000"/>
        {/* Corpo */}
        <rect x="8" y="16" width="16" height="14" fill="#4682B4"/>
        {/* Braços */}
        <rect x="4" y="18" width="4" height="10" fill="#FFD700"/>
        <rect x="24" y="18" width="4" height="10" fill="#FFD700"/>
        {/* Mãos */}
        <rect x="2" y="28" width="6" height="4" fill="#FFD700"/>
        <rect x="24" y="28" width="6" height="4" fill="#FFD700"/>
        {/* Calças */}
        <rect x="10" y="30" width="4" height="2" fill="#2F4F4F"/>
        <rect x="18" y="30" width="4" height="2" fill="#2F4F4F"/>
      </svg>
    ),
    color: '#4682B4'
  }
};

function NPCMapLayer({ fazendas = [], onNPCClick }) {
  const { npcs, fetchNPCs, npcActions } = useNPCStore();
  const [selectedNPC, setSelectedNPC] = useState(null);
  const [showNegociacao, setShowNegociacao] = useState(false);

  useEffect(() => {
    fetchNPCs();
  }, [fetchNPCs]);

  const handleNPCClick = (npc) => {
    setSelectedNPC(npc);
    onNPCClick && onNPCClick(npc);
  };

  const handleNegociar = () => {
    setShowNegociacao(true);
  };

  const handleFecharNegociacao = () => {
    setShowNegociacao(false);
  };

  const handleConfirmarNegociacao = async (proposta) => {
    try {
      console.log('Proposta enviada:', proposta);
      // Aqui você pode integrar com a API real
      // await enviarPropostaNPC(proposta);
      
      // Simulação de resposta do NPC
      const respostas = [
        "Interessante proposta! Vou analisar e te respondo em breve.",
        "Hmm, preciso pensar melhor sobre isso. Posso fazer uma contraproposta?",
        "Essa proposta me interessa! Vamos fechar o negócio?",
        "Desculpe, mas não estou interessado nessa proposta no momento."
      ];
      
      const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
      alert(`Resposta de ${selectedNPC.nome}: ${respostaAleatoria}`);
      
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      alert('Erro ao enviar proposta. Tente novamente.');
    }
  };

  // Função para calcular posição do NPC baseada na fazenda
  const getNPCPosition = (npc, fazenda) => {
    if (!fazenda) return { left: '50%', top: '50%' };
    
    // Usar o ID do NPC para gerar posição consistente
    const seed = npc.id.charCodeAt(0) + npc.id.charCodeAt(npc.id.length - 1);
    const baseLeft = 20 + (seed % 60); // 20-80% da largura do card
    const baseTop = 20 + ((seed * 2) % 60);  // 20-80% da altura do card
    
    return {
      left: `${baseLeft}%`,
      top: `${baseTop}%`
    };
  };

  // Agrupar NPCs por fazenda (simulação - você pode ajustar a lógica)
  const npcsPorFazenda = {};
  (npcs || []).forEach((npc, index) => {
    const fazendaIndex = index % Math.max(fazendas.length, 1);
    const fazenda = fazendas[fazendaIndex];
    if (!npcsPorFazenda[fazenda?.id || 'default']) {
      npcsPorFazenda[fazenda?.id || 'default'] = [];
    }
    npcsPorFazenda[fazenda?.id || 'default'].push(npc);
  });

  return (
    <>
      {fazendas.map(fazenda => {
        const npcsDaFazenda = npcsPorFazenda[fazenda.id] || [];
        return (
          <div
            key={`npc-layer-${fazenda.id}`}
            className="fazenda-npc-layer"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            {npcsDaFazenda.map(npc => {
              const position = getNPCPosition(npc, fazenda);
              const pixelArt = npcPixelArts[npc.persona] || npcPixelArts.default;
              
              return (
                <div
                  key={npc.id}
                  className="npc-avatar"
                  style={{
                    position: 'absolute',
                    left: position.left,
                    top: position.top,
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100,
                    background: `rgba(30,32,40,0.9)`,
                    borderRadius: '8px',
                    padding: '4px',
                    border: `2px solid ${pixelArt.color}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  title={`${npc.nome} (${npc.persona})`}
                  onClick={() => handleNPCClick(npc)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translate(-50%, -50%) scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                  }}
                >
                  {pixelArt.svg}
                  {npcActions[npc.id] && (
                    <div 
                      className="npc-action-icon" 
                      title={npcActions[npc.id].descricao} 
                      style={{ 
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        background: '#1976d2',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 12,
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {npcActions[npc.id].icone || '⭐'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      
      {/* Modal de informações do NPC */}
      {selectedNPC && !showNegociacao && (
        <div style={{ 
          position: 'fixed', 
          top: 80, 
          right: 40, 
          background: '#23272f', 
          color: '#fff', 
          borderRadius: 12, 
          padding: 24, 
          zIndex: 2000,
          minWidth: 300,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          border: '1px solid #313640'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                background: `rgba(30,32,40,0.9)`, 
                borderRadius: '8px', 
                padding: '8px',
                border: `2px solid ${npcPixelArts[selectedNPC.persona]?.color || npcPixelArts.default.color}`
              }}>
                {npcPixelArts[selectedNPC.persona]?.svg || npcPixelArts.default.svg}
              </div>
              <h3 style={{ margin: 0, color: '#90caf9' }}>{selectedNPC.nome}</h3>
            </div>
            <button 
              onClick={() => setSelectedNPC(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#b0bec5',
                fontSize: 18,
                cursor: 'pointer',
                padding: 0
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Perfil:</strong> {selectedNPC.persona}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Objetivos:</strong> {selectedNPC.objetivos?.join(', ')}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Ação atual:</strong> {npcActions[selectedNPC.id]?.descricao || 'Disponível para negociação'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleNegociar}
              style={{
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 600,
                flex: 1
              }}
            >
              🤝 Negociar
            </button>
            <button
              onClick={() => setSelectedNPC(null)}
              style={{
                background: '#6b7280',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Negociação */}
      <NegociacaoModal
        npc={selectedNPC}
        aberto={showNegociacao}
        onFechar={handleFecharNegociacao}
        onConfirmar={handleConfirmarNegociacao}
      />
    </>
  );
}

export default NPCMapLayer;
