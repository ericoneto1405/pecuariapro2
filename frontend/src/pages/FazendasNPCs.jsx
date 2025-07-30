import { useEffect, useState } from 'react';
import { getFazendasNPCs, npcVenderAnimal, interactWithNpc, comprarItemNpc } from '../api/npcFazendaService';
import NegociacaoModal from '../components/NegociacaoModal';
import DialogueModal from '../components/DialogueModal';

function FazendasNPCs() {
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [selectedNPC, setSelectedNPC] = useState(null);
  const [showNegociacao, setShowNegociacao] = useState(false);
  const [showComercio, setShowComercio] = useState(false);
  const [showParceria, setShowParceria] = useState(false);
  const [dialogue, setDialogue] = useState({ isOpen: false, npcName: '', text: '' });

  useEffect(() => {
    const carregarNPCs = async () => {
      try {
        // Buscar dados completos dos NPCs incluindo inventário
        const response = await fetch('http://localhost:5050/api/npcs/state');
        const data = await response.json();
        
        // Converter para o formato esperado pelo componente
        const npcsFormatados = Object.entries(data.npcs).map(([id, npc]) => ({
          id,
          nome: npc.name,
          persona: npc.persona,
          mood: npc.mood,
          objetivos: npc.short_term_goals,
          current_action: npc.current_action,
          inventory: npc.inventory || [],
          finance: npc.finance
        }));
        
        setNpcs(npcsFormatados);
      } catch (error) {
        console.error('Erro ao carregar NPCs:', error);
        setErro('Erro ao buscar fazendas dos NPCs');
      } finally {
        setLoading(false);
      }
    };
    
    carregarNPCs();
  }, []);



  const handleInteract = async (npc) => {
    const response = await interactWithNpc(npc.id);
    if (response && response.dialogue) {
      setDialogue({ isOpen: true, npcName: npc.nome, text: response.dialogue });
    }
  };

  const handleComercio = (npc) => {
    setSelectedNPC(npc);
    setShowComercio(true);
  };

  const handleParceria = (npc) => {
    setSelectedNPC(npc);
    setShowParceria(true);
  };

  const handleFecharNegociacao = () => {
    setShowNegociacao(false);
    setShowComercio(false);
    setShowParceria(false);
    setSelectedNPC(null);
  };

  const handleConfirmarNegociacao = async (proposta) => {
    try {
      console.log('Proposta enviada:', proposta);
      
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

  const handleComprarAnimal = async (npc, animal) => {
    try {
      // Calcular preço baseado na raça e características
      const precos_base = {
        'Nelore': 8000,
        'Angus': 12000,
        'Hereford': 10000,
        'Mestiço': 4500,
        'Girolando': 6000,
        'Holandesa': 8000
      };
      
      const preco_base = precos_base[animal.breed] || 5000;
      const multiplicador = animal.baseValue || 1.0;
      const preco_final = Math.floor(preco_base * multiplicador);
      
      const confirmacao = confirm(`Comprar ${animal.breed} ${animal.sex === 'Macho' ? 'Macho' : 'Fêmea'} de ${npc.nome} por R$ ${preco_final.toLocaleString('pt-BR')}?`);
      if (confirmacao) {
        const resultado = await comprarItemNpc(npc.id, animal.animalId);
        
        if (resultado.sucesso) {
          alert(`✅ ${resultado.mensagem}`);
          // Atualizar os dados dos NPCs para refletir a mudança
          const response = await fetch('http://localhost:5050/api/npcs/state');
          const data = await response.json();
          
          const npcsFormatados = Object.entries(data.npcs).map(([id, npc]) => ({
            id,
            nome: npc.name,
            persona: npc.persona,
            mood: npc.mood,
            objetivos: npc.short_term_goals,
            current_action: npc.current_action,
            inventory: npc.inventory || [],
            finance: npc.finance
          }));
          
          setNpcs(npcsFormatados);
          setShowComercio(false);
        } else {
          alert(`❌ ${resultado.mensagem}`);
        }
      }
    } catch (error) {
      console.error('Erro na compra:', error);
      alert('Erro ao realizar compra. Tente novamente.');
    }
  };

  const handleAceitarParceria = async (npc, tipo) => {
    try {
      const beneficios = {
        'exportacao': 'Acesso a mercados internacionais',
        'genetica': 'Melhoramento do rebanho',
        'tecnologia': 'Redução de custos operacionais',
        'comercializacao': 'Melhores preços de venda'
      };
      
      alert(`🤝 Parceria com ${npc.nome} estabelecida!\nBenefício: ${beneficios[tipo] || 'Cooperação mútua'}`);
      setShowParceria(false);
    } catch (error) {
      console.error('Erro na parceria:', error);
      alert('Erro ao estabelecer parceria. Tente novamente.');
    }
  };



  if (loading) return <div style={{color:'#b0bec5',padding:32}}>Carregando fazendas dos NPCs...</div>;
  if (erro) return <div style={{color:'#e53935',padding:32}}>{erro}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ color: '#fff', marginBottom: 24 }}>NPCs Fazendeiros</h1>
      

      
      {/* Estatísticas */}
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 32,
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          background: '#23272f', 
          borderRadius: 8, 
          padding: 16, 
          minWidth: 150,
          textAlign: 'center'
        }}>
          <div style={{ color: '#90caf9', fontSize: 14, marginBottom: 4 }}>Total de NPCs</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>{npcs.length}</div>
        </div>
        <div style={{ 
          background: '#23272f', 
          borderRadius: 8, 
          padding: 16, 
          minWidth: 150,
          textAlign: 'center'
        }}>
          <div style={{ color: '#90caf9', fontSize: 14, marginBottom: 4 }}>Tradicionalistas</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>
            {npcs.filter(npc => npc.persona === 'tradicionalista').length}
          </div>
        </div>
        <div style={{ 
          background: '#23272f', 
          borderRadius: 8, 
          padding: 16, 
          minWidth: 150,
          textAlign: 'center'
        }}>
          <div style={{ color: '#90caf9', fontSize: 14, marginBottom: 4 }}>Inovadores</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>
            {npcs.filter(npc => npc.persona === 'inovador').length}
          </div>
        </div>
        <div style={{ 
          background: '#23272f', 
          borderRadius: 8, 
          padding: 16, 
          minWidth: 150,
          textAlign: 'center'
        }}>
          <div style={{ color: '#90caf9', fontSize: 14, marginBottom: 4 }}>Políticos</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#fff' }}>
            {npcs.filter(npc => npc.persona === 'politico').length}
          </div>
        </div>
      </div>

      {/* Lista de NPCs */}
      <div style={{ 
        background: '#23272f', 
        borderRadius: 12, 
        padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#fff', marginBottom: 20 }}>Fazendeiros Disponíveis</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: 16 
        }}>
          {npcs.map(npc => (
            <div key={npc.id} style={{ 
              background: '#181a1f', 
              borderRadius: 8, 
              padding: 16,
              border: '1px solid #313640',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 32, marginRight: 12 }}>
                  {npc.persona === 'tradicionalista' ? '🧑‍🌾' : 
                   npc.persona === 'inovador' ? '🤠' : 
                   npc.persona === 'politico' ? '🧑‍💼' : '👤'}
                </span>
                <div>
                  <h3 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: 16 }}>{npc.nome}</h3>
                  <span style={{ 
                    color: npc.persona === 'tradicionalista' ? '#fbbf24' : 
                           npc.persona === 'inovador' ? '#34d399' : '#a78bfa',
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {npc.persona}
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: 12 }}>
                <p style={{ color: '#b0bec5', fontSize: 14, margin: '0 0 8px 0' }}>
                  <strong>Objetivos:</strong> {npc.objetivos?.slice(0, 2).join(', ')}
                  {npc.objetivos?.length > 2 && '...'}
                </p>
                <p style={{ color: '#b0bec5', fontSize: 14, margin: 0 }}>
                  <strong>Ação atual:</strong> {npc.current_action?.type || 'Disponível para interação'}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleInteract(npc)}
                  style={{
                    background: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 12,
                    flex: 1
                  }}
                >
                  💬 Conversar
                </button>
                <button
                  onClick={() => handleComercio(npc)}
                  style={{
                    background: '#4ade80',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 12,
                    flex: 1
                  }}
                >
                  🐄 Comércio
                </button>
                <button
                  onClick={() => handleParceria(npc)}
                  style={{
                    background: '#a78bfa',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 12,
                    flex: 1
                  }}
                >
                  🤝 Parceria
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Negociação */}
      <NegociacaoModal
        npc={selectedNPC}
        aberto={showNegociacao}
        onFechar={handleFecharNegociacao}
        onConfirmar={handleConfirmarNegociacao}
      />

      {/* Modal de Comércio */}
      {showComercio && selectedNPC && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23272f', borderRadius: 16, padding: 32, minWidth: 400, maxWidth: 600, maxHeight: '80vh', overflow: 'auto' }}>
            <h3 style={{ color: '#4ade80', marginBottom: 20 }}>🐄 Comércio com {selectedNPC.nome}</h3>
            
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: '#fff', marginBottom: 12 }}>
                Animais Disponíveis ({selectedNPC.inventory?.length || 0}):
              </h4>
              
              {selectedNPC.inventory && selectedNPC.inventory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedNPC.inventory.map((animal, index) => {
                    // Calcular preço baseado na raça e características
                    const precos_base = {
                      'Nelore': 8000,
                      'Angus': 12000,
                      'Hereford': 10000,
                      'Mestiço': 4500,
                      'Girolando': 6000,
                      'Holandesa': 8000
                    };
                    
                    const preco_base = precos_base[animal.breed] || 5000;
                    const multiplicador = animal.baseValue || 1.0;
                    const preco_final = Math.floor(preco_base * multiplicador);
                    
                    return (
                      <button
                        key={animal.animalId}
                        onClick={() => handleComprarAnimal(selectedNPC, animal)}
                        style={{
                          background: '#181a1f',
                          color: '#fff',
                          border: '1px solid #374151',
                          borderRadius: 6,
                          padding: 12,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>
                          {animal.sex === 'Macho' ? '🐂' : '🐄'} {animal.breed} {animal.sex}
                        </div>
                        <div style={{ color: '#b0bec5', fontSize: 12, marginBottom: 4 }}>
                          ID: {animal.animalId}
                        </div>
                        <div style={{ color: '#4ade80', fontSize: 14, fontWeight: 600 }}>
                          R$ {preco_final.toLocaleString('pt-BR')}
                        </div>
                        {animal.phenotype && (
                          <div style={{ color: '#fbbf24', fontSize: 12, marginTop: 4 }}>
                            {animal.phenotype.coatColor} • {animal.phenotype.polled}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ color: '#b0bec5', textAlign: 'center', padding: 20 }}>
                  Este NPC não possui animais disponíveis para venda.
                </div>
              )}
            </div>
            
            <button
              onClick={handleFecharNegociacao}
              style={{
                background: '#6b7280',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Parceria */}
      {showParceria && selectedNPC && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23272f', borderRadius: 16, padding: 32, minWidth: 400, maxWidth: 500 }}>
            <h3 style={{ color: '#a78bfa', marginBottom: 20 }}>🤝 Parceria com {selectedNPC.nome}</h3>
            
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: '#fff', marginBottom: 12 }}>Oportunidades de Parceria:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => handleAceitarParceria(selectedNPC, 'exportacao')}
                  style={{
                    background: '#181a1f',
                    color: '#fff',
                    border: '1px solid #374151',
                    borderRadius: 6,
                    padding: 12,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>🌍 Exportação</div>
                  <div style={{ color: '#b0bec5', fontSize: 14 }}>Acesso a mercados internacionais</div>
                </button>
                <button
                  onClick={() => handleAceitarParceria(selectedNPC, 'genetica')}
                  style={{
                    background: '#181a1f',
                    color: '#fff',
                    border: '1px solid #374151',
                    borderRadius: 6,
                    padding: 12,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>🧬 Genética</div>
                  <div style={{ color: '#b0bec5', fontSize: 14 }}>Melhoramento do rebanho</div>
                </button>
                <button
                  onClick={() => handleAceitarParceria(selectedNPC, 'tecnologia')}
                  style={{
                    background: '#181a1f',
                    color: '#fff',
                    border: '1px solid #374151',
                    borderRadius: 6,
                    padding: 12,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>🔧 Tecnologia</div>
                  <div style={{ color: '#b0bec5', fontSize: 14 }}>Redução de custos operacionais</div>
                </button>
              </div>
            </div>
            
            <button
              onClick={handleFecharNegociacao}
              style={{
                background: '#6b7280',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Diálogo */}
      <DialogueModal
        isOpen={dialogue.isOpen}
        onClose={() => setDialogue({ isOpen: false, npcName: '', text: '' })}
        npcName={dialogue.npcName}
        dialogueText={dialogue.text}
      />
    </div>
  );
}

export default FazendasNPCs;
