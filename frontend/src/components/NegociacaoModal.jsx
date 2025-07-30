import React, { useState, useEffect } from 'react';
import { simularRespostaNPC } from '../api/npcNegociacaoService';

const TIPOS_NEGOCIACAO = {
  TERRAS: 'terras',
  ANIMAIS: 'animais',
  PARCERIA: 'parceria'
};

const TIPOS_ANIMAIS = [
  { id: 'bezerro', nome: 'Bezerro', precoBase: 800 },
  { id: 'garrote', nome: 'Garrote', precoBase: 1200 },
  { id: 'novilho', nome: 'Novilho', precoBase: 1800 },
  { id: 'boi', nome: 'Boi', precoBase: 2500 },
  { id: 'vaca', nome: 'Vaca', precoBase: 3000 },
  { id: 'touro', nome: 'Touro', precoBase: 5000 }
];

function NegociacaoModal({ npc, aberto, onFechar, onConfirmar }) {
  const [tipoNegociacao, setTipoNegociacao] = useState(TIPOS_NEGOCIACAO.TERRAS);
  const [quantidade, setQuantidade] = useState(1);
  const [precoUnitario, setPrecoUnitario] = useState(0);
  const [tipoAnimal, setTipoAnimal] = useState('boi');
  const [fazendaAlvo, setFazendaAlvo] = useState('');
  const [proposta, setProposta] = useState('');
  const [loading, setLoading] = useState(false);
  const [respostaNPC, setRespostaNPC] = useState(null);

  // Dados mockados das fazendas do NPC
  const fazendasNPC = [
    { id: 'fazenda1', nome: 'Fazenda São João', tamanho: 150, valor: 2500000 },
    { id: 'fazenda2', nome: 'Fazenda Monte Verde', tamanho: 200, valor: 3200000 },
    { id: 'fazenda3', nome: 'Fazenda Boa Vista', tamanho: 120, valor: 1800000 }
  ];

  // Dados mockados dos animais do NPC
  const animaisNPC = [
    { tipo: 'boi', quantidade: 25, precoMedio: 2400 },
    { tipo: 'vaca', quantidade: 15, precoMedio: 2800 },
    { tipo: 'touro', quantidade: 3, precoMedio: 4800 },
    { tipo: 'novilho', quantidade: 12, precoMedio: 1700 }
  ];

  useEffect(() => {
    if (tipoNegociacao === TIPOS_NEGOCIACAO.TERRAS && fazendaAlvo) {
      const fazenda = fazendasNPC.find(f => f.id === fazendaAlvo);
      if (fazenda) {
        setPrecoUnitario(fazenda.valor / fazenda.tamanho);
      }
    } else if (tipoNegociacao === TIPOS_NEGOCIACAO.ANIMAIS) {
      const animal = TIPOS_ANIMAIS.find(a => a.id === tipoAnimal);
      if (animal) {
        setPrecoUnitario(animal.precoBase);
      }
    }
  }, [tipoNegociacao, fazendaAlvo, tipoAnimal]);

  const calcularTotal = () => {
    return quantidade * precoUnitario;
  };

  const gerarProposta = () => {
    let propostaTexto = '';
    
    if (tipoNegociacao === TIPOS_NEGOCIACAO.TERRAS) {
      const fazenda = fazendasNPC.find(f => f.id === fazendaAlvo);
      propostaTexto = `Proposta de compra de ${quantidade} hectare(s) da ${fazenda?.nome} por R$ ${calcularTotal().toLocaleString('pt-BR')}`;
    } else if (tipoNegociacao === TIPOS_NEGOCIACAO.ANIMAIS) {
      const animal = TIPOS_ANIMAIS.find(a => a.id === tipoAnimal);
      propostaTexto = `Proposta de compra de ${quantidade} ${animal?.nome}(s) por R$ ${calcularTotal().toLocaleString('pt-BR')}`;
    } else {
      propostaTexto = `Proposta de parceria: ${proposta}`;
    }
    
    return propostaTexto;
  };

  const handleConfirmar = async () => {
    setLoading(true);
    setRespostaNPC(null);
    
    try {
      const propostaCompleta = {
        npcId: npc.id,
        tipo: tipoNegociacao,
        quantidade,
        precoUnitario,
        total: calcularTotal(),
        descricao: gerarProposta(),
        fazendaAlvo: tipoNegociacao === TIPOS_NEGOCIACAO.TERRAS ? fazendaAlvo : null,
        tipoAnimal: tipoNegociacao === TIPOS_NEGOCIACAO.ANIMAIS ? tipoAnimal : null,
        propostaTexto: tipoNegociacao === TIPOS_NEGOCIACAO.PARCERIA ? proposta : null
      };
      
      // Simular resposta do NPC
      const resposta = await simularRespostaNPC(npc.id, tipoNegociacao);
      setRespostaNPC(resposta);
      
      await onConfirmar(propostaCompleta);
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      alert('Erro ao enviar proposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNovaProposta = () => {
    setRespostaNPC(null);
    setTipoNegociacao(TIPOS_NEGOCIACAO.TERRAS);
    setQuantidade(1);
    setPrecoUnitario(0);
    setTipoAnimal('boi');
    setFazendaAlvo('');
    setProposta('');
  };

  if (!aberto || !npc) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000
    }}>
      <div style={{
        background: '#23272f',
        borderRadius: 12,
        padding: 32,
        minWidth: 500,
        maxWidth: 600,
        maxHeight: '80vh',
        overflow: 'auto',
        color: '#fff'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: '#90caf9' }}>Negociação com {npc.nome}</h2>
          <button 
            onClick={onFechar}
            style={{
              background: 'none',
              border: 'none',
              color: '#b0bec5',
              fontSize: 24,
              cursor: 'pointer',
              padding: 0
            }}
          >
            ×
          </button>
        </div>

        {/* Resposta do NPC */}
        {respostaNPC && (
          <div style={{ 
            background: respostaNPC.sucesso ? '#1a3a1a' : '#3a1a1a', 
            borderRadius: 8, 
            padding: 16, 
            marginBottom: 24,
            border: `1px solid ${respostaNPC.sucesso ? '#4ade80' : '#ef4444'}`
          }}>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              color: respostaNPC.sucesso ? '#4ade80' : '#ef4444' 
            }}>
              {respostaNPC.sucesso ? '✅ Proposta Aceita!' : '❌ Proposta Rejeitada'}
            </h4>
            <p style={{ margin: '0 0 8px 0', lineHeight: 1.5 }}>
              <strong>{npc.nome}:</strong> {respostaNPC.resposta}
            </p>
            {respostaNPC.contraproposta && (
              <div style={{ 
                background: '#1a1d22', 
                borderRadius: 6, 
                padding: 12, 
                marginTop: 12 
              }}>
                <strong>Contraproposta:</strong> R$ {respostaNPC.contraproposta.preco.toLocaleString('pt-BR')}
                <br />
                <small>{respostaNPC.contraproposta.condicoes}</small>
              </div>
            )}
            <p style={{ margin: '8px 0 0 0', fontSize: 14, opacity: 0.8 }}>
              Tempo de resposta: {respostaNPC.tempoResposta} hora(s)
            </p>
          </div>
        )}

        {/* Conteúdo da negociação (só mostra se não há resposta) */}
        {!respostaNPC && (
          <>
            {/* Perfil do NPC */}
            <div style={{ 
              background: '#181a1f', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 24,
              border: '1px solid #313640'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Perfil:</strong> {npc.persona}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Objetivos:</strong> {npc.objetivos?.join(', ')}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Ação atual:</strong> Negociando
              </p>
            </div>

            {/* Tipo de Negociação */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Tipo de Negociação:
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                {Object.entries(TIPOS_NEGOCIACAO).map(([key, value]) => (
                  <button
                    key={value}
                    onClick={() => setTipoNegociacao(value)}
                    style={{
                      background: tipoNegociacao === value ? '#1976d2' : '#181a1f',
                      color: '#fff',
                      border: '1px solid #313640',
                      borderRadius: 6,
                      padding: '8px 16px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    {key === 'TERRAS' ? '🏞️ Terras' : key === 'ANIMAIS' ? '🐄 Animais' : '🤝 Parceria'}
                  </button>
                ))}
              </div>
            </div>

            {/* Campos específicos por tipo */}
            {tipoNegociacao === TIPOS_NEGOCIACAO.TERRAS && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Fazenda:
                </label>
                <select
                  value={fazendaAlvo}
                  onChange={(e) => setFazendaAlvo(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#181a1f',
                    color: '#fff',
                    border: '1px solid #313640',
                    borderRadius: 6,
                    padding: '8px 12px'
                  }}
                >
                  <option value="">Selecione uma fazenda</option>
                  {fazendasNPC.map(fazenda => (
                    <option key={fazenda.id} value={fazenda.id}>
                      {fazenda.nome} ({fazenda.tamanho} ha - R$ {fazenda.valor.toLocaleString('pt-BR')})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {tipoNegociacao === TIPOS_NEGOCIACAO.ANIMAIS && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Tipo de Animal:
                </label>
                <select
                  value={tipoAnimal}
                  onChange={(e) => setTipoAnimal(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#181a1f',
                    color: '#fff',
                    border: '1px solid #313640',
                    borderRadius: 6,
                    padding: '8px 12px'
                  }}
                >
                  {TIPOS_ANIMAIS.map(animal => (
                    <option key={animal.id} value={animal.id}>
                      {animal.nome} (R$ {animal.precoBase.toLocaleString('pt-BR')})
                    </option>
                  ))}
                </select>
                
                {/* Disponibilidade do NPC */}
                <div style={{ 
                  background: '#1a1d22', 
                  borderRadius: 6, 
                  padding: 12, 
                  marginTop: 12,
                  fontSize: 14
                }}>
                  <strong>Disponível para venda:</strong>
                  {animaisNPC.map(animal => (
                    <div key={animal.tipo} style={{ marginTop: 4 }}>
                      {animal.quantidade} {animal.tipo}(s) - R$ {animal.precoMedio.toLocaleString('pt-BR')} cada
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tipoNegociacao === TIPOS_NEGOCIACAO.PARCERIA && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Proposta de Parceria:
                </label>
                <textarea
                  value={proposta}
                  onChange={(e) => setProposta(e.target.value)}
                  placeholder="Descreva sua proposta de parceria..."
                  style={{
                    width: '100%',
                    background: '#181a1f',
                    color: '#fff',
                    border: '1px solid #313640',
                    borderRadius: 6,
                    padding: '8px 12px',
                    minHeight: 80,
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            {/* Quantidade e Preço */}
            {(tipoNegociacao === TIPOS_NEGOCIACAO.TERRAS || tipoNegociacao === TIPOS_NEGOCIACAO.ANIMAIS) && (
              <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Quantidade:
                  </label>
                  <input
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    style={{
                      width: '100%',
                      background: '#181a1f',
                      color: '#fff',
                      border: '1px solid #313640',
                      borderRadius: 6,
                      padding: '8px 12px'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Preço Unitário (R$):
                  </label>
                  <input
                    type="number"
                    value={precoUnitario}
                    onChange={(e) => setPrecoUnitario(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    style={{
                      width: '100%',
                      background: '#181a1f',
                      color: '#fff',
                      border: '1px solid #313640',
                      borderRadius: 6,
                      padding: '8px 12px'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Resumo da Proposta */}
            <div style={{ 
              background: '#1a1d22', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 24,
              border: '1px solid #313640'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#90caf9' }}>Resumo da Proposta:</h4>
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                {gerarProposta()}
              </p>
              {(tipoNegociacao === TIPOS_NEGOCIACAO.TERRAS || tipoNegociacao === TIPOS_NEGOCIACAO.ANIMAIS) && (
                <p style={{ margin: '8px 0 0 0', fontSize: 18, fontWeight: 600, color: '#4ade80' }}>
                  Total: R$ {calcularTotal().toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </>
        )}

        {/* Botões */}
        <div style={{ display: 'flex', gap: 12 }}>
          {respostaNPC ? (
            <>
              <button
                onClick={handleNovaProposta}
                style={{
                  flex: 1,
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Nova Proposta
              </button>
              <button
                onClick={onFechar}
                style={{
                  flex: 1,
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Fechar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onFechar}
                style={{
                  flex: 1,
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={loading || (tipoNegociacao === TIPOS_NEGOCIACAO.TERRAS && !fazendaAlvo) || (tipoNegociacao === TIPOS_NEGOCIACAO.PARCERIA && !proposta.trim())}
                style={{
                  flex: 1,
                  background: loading ? '#6b7280' : '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                {loading ? 'Enviando...' : 'Enviar Proposta'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NegociacaoModal; 