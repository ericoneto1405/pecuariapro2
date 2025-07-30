import { useState } from 'react';
import { executarProtocoloIatf } from '../api/npcFazendaService';
import './ManejoReprodutivo.css';

// --- DADOS MOCKADOS (apenas inventário de sêmen) ---
const inventarioSemen = [
  { semenId: 'ANGS-001', nomeTouro: 'Superstar', raca: 'Angus', doses: 10, precoPorDose: 150 },
  { semenId: 'NELO-002', nomeTouro: 'Rei do Gado', raca: 'Nelore', doses: 5, precoPorDose: 120 },
  { semenId: 'HERF-003', nomeTouro: 'Champion', raca: 'Hereford', doses: 8, precoPorDose: 140 },
  { semenId: 'GIRO-004', nomeTouro: 'Leiteiro', raca: 'Girolando', doses: 12, precoPorDose: 100 },
  { semenId: 'ANGP-005', nomeTouro: 'Black Diamond', raca: 'Angus', doses: 6, precoPorDose: 180 }
];

const custoProtocoloIATF = 350; // Custo por vaca
// --- FIM DOS DADOS MOCKADOS ---

function ManejoReprodutivo({ loteFemeas = [] }) {
  const [step, setStep] = useState(1); // 1: Atribuir Sêmen, 2: Resumo
  const [planoInseminacao, setPlanoInseminacao] = useState({}); // { animalId: semenId }
  const [semenSelecionado, setSemenSelecionado] = useState(null); // Para atribuição visual
  const [inventarioAtual, setInventarioAtual] = useState(inventarioSemen);

  // Função para renderizar barra de ECC
  const renderBarraEcc = (ecc) => {
    const porcentagem = (ecc / 5) * 100;
    let cor = '#ef4444'; // Vermelho para ECC baixo
    if (ecc >= 4.0) cor = '#22c55e'; // Verde para ECC alto
    else if (ecc >= 3.0) cor = '#f59e0b'; // Amarelo para ECC médio
    
    return (
      <div className="barra-ecc-container">
        <div 
          className="barra-ecc" 
          style={{ 
            width: `${porcentagem}%`, 
            backgroundColor: cor 
          }}
        />
        <span className="ecc-valor">{ecc}</span>
      </div>
    );
  };

  // Função para selecionar sêmen
  const selecionarSemen = (semen) => {
    setSemenSelecionado(semen);
  };

  // Função para atribuir sêmen a uma fêmea
  const atribuirSemen = (animalId) => {
    if (!semenSelecionado) return;
    
    // Verificar se há doses disponíveis
    const semenAtual = inventarioAtual.find(s => s.semenId === semenSelecionado.semenId);
    if (semenAtual.doses <= 0) {
      alert('Não há doses suficientes deste sêmen!');
      return;
    }
    
    // Atualizar plano de inseminação
    setPlanoInseminacao(prev => ({
      ...prev,
      [animalId]: semenSelecionado.semenId
    }));
    
    // Atualizar inventário (diminuir uma dose)
    setInventarioAtual(prev => 
      prev.map(s => 
        s.semenId === semenSelecionado.semenId 
          ? { ...s, doses: s.doses - 1 }
          : s
      )
    );
    
    setSemenSelecionado(null);
  };

  // Função para remover atribuição de sêmen
  const removerAtribuicao = (animalId) => {
    const semenId = planoInseminacao[animalId];
    if (!semenId) return;
    
    // Remover do plano
    setPlanoInseminacao(prev => {
      const novo = { ...prev };
      delete novo[animalId];
      return novo;
    });
    
    // Restaurar dose no inventário
    setInventarioAtual(prev => 
      prev.map(s => 
        s.semenId === semenId 
          ? { ...s, doses: s.doses + 1 }
          : s
      )
    );
  };

  // Função para executar protocolo IATF
  const executarProtocoloIATF = async () => {
    try {
      // Preparar o plano de inseminação no formato esperado pelo backend
      const planoInseminacaoArray = Object.entries(planoInseminacao).map(([animalId, semenId]) => ({
        dam_id: animalId,
        semen_id: semenId
      }));
      
      // Por enquanto, usar um NPC fixo para teste (npc_01)
      const ownerId = 'npc_01';
      
      const resultado = await executarProtocoloIatf(ownerId, planoInseminacaoArray);
      
      if (resultado.sucesso) {
        // Exibir resultados detalhados
        const { resultados } = resultado;
        const mensagem = `
Protocolo IATF Finalizado!

📊 Resultados:
• Total de fêmeas inseminadas: ${resultados.total_inseminadas}
• Fêmeas que emprenharam: ${resultados.total_prenhas}
• Taxa de sucesso: ${resultados.taxa_sucesso}

🐄 Fêmeas que emprenharam: ${resultados.femeas_prenhas.join(', ') || 'Nenhuma'}

❌ Fêmeas que falharam: ${resultados.femeas_falharam.length > 0 ? 
  resultados.femeas_falharam.map(f => f.dam_id).join(', ') : 'Nenhuma'}

🐣 Filhotes gerados: ${resultados.filhotes_gerados.length}

Acompanhe o status das fêmeas na tela "Meus Rebanhos".
        `;
        
        alert(mensagem);
        
        // Resetar estado
        setStep(1);
        setPlanoInseminacao({});
        setSemenSelecionado(null);
        setInventarioAtual(inventarioSemen);
      } else {
        alert(`❌ Erro: ${resultado.mensagem}`);
      }
    } catch (error) {
      console.error('Erro ao executar protocolo IATF:', error);
      alert('Erro ao executar o protocolo IATF. Tente novamente.');
    }
  };

  // Função para calcular custo total
  const calcularCustoTotal = () => {
    const custoProtocolo = loteFemeas.length * custoProtocoloIATF;
    const custoSemen = Object.values(planoInseminacao).reduce((total, semenId) => {
      const semen = inventarioSemen.find(s => s.semenId === semenId);
      return total + (semen ? semen.precoPorDose : 0);
    }, 0);
    return custoProtocolo + custoSemen;
  };

  // Função para verificar se todas as fêmeas têm sêmen atribuído
  const todasFemeasComSemen = () => {
    return loteFemeas.every(femea => planoInseminacao[femea.animalId]);
  };

  // Função para obter sêmen atribuído a uma fêmea
  const getSemenAtribuido = (animalId) => {
    const semenId = planoInseminacao[animalId];
    return semenId ? inventarioSemen.find(s => s.semenId === semenId) : null;
  };

  // Verificar se há fêmeas no lote
  if (loteFemeas.length === 0) {
    return (
      <div className="manejo-reprodutivo">
        <div className="header-manejo">
          <h1>🐄 Manejo Reprodutivo - IATF</h1>
          <p>Protocolo de Inseminação Artificial em Tempo Fixo</p>
        </div>
        
        <div className="etapa-container">
          <div className="sem-lote">
            <h2>📋 Nenhum Lote Selecionado</h2>
            <p>Para executar o protocolo IATF, você precisa selecionar um lote de fêmeas na tela "Meus Rebanhos".</p>
            <button 
              className="btn-voltar"
              onClick={() => window.history.back()}
            >
              ← Voltar para Meus Rebanhos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manejo-reprodutivo">
      <div className="header-manejo">
        <h1>🐄 Manejo Reprodutivo - IATF</h1>
        <p>Protocolo de Inseminação Artificial em Tempo Fixo</p>
      </div>

      {/* Indicador de Progresso */}
      <div className="progress-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Atribuir Sêmen</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Confirmar Protocolo</span>
        </div>
      </div>

      {/* Etapa 1: Atribuição de Sêmen */}
      {step === 1 && (
        <div className="etapa-container">
          <h2>🧬 Atribuir Sêmen ao Lote</h2>
          <p className="etapa-descricao">
            Clique em um sêmen na coluna da direita e depois clique no slot de uma fêmea 
            na coluna da esquerda para atribuí-lo. Lote com {loteFemeas.length} fêmeas.
          </p>
          
          <div className="atribuicao-container">
            {/* Coluna da Esquerda: Fêmeas do Lote */}
            <div className="coluna-femeas">
              <h3>Fêmeas do Lote ({loteFemeas.length})</h3>
              <div className="femeas-lista">
                {loteFemeas.map(femea => {
                  const semenAtribuido = getSemenAtribuido(femea.animalId);
                  
                  return (
                    <div key={femea.animalId} className="femea-atribuicao">
                      <div className="femea-info">
                        <div className="femea-header">
                          <span className="femea-id">{femea.animalId}</span>
                        </div>
                        <div className="femea-detalhes">
                          <span>ECC: {femea.ecc}</span>
                          <span className={`genetica ${femea.genetica?.toLowerCase() || 'regular'}`}>
                            {femea.genetica || 'Regular'}
                          </span>
                        </div>
                      </div>
                      
                      <div 
                        className={`slot-semen ${semenAtribuido ? 'atribuido' : ''} ${semenSelecionado ? 'destacado' : ''}`}
                        onClick={() => semenAtribuido ? removerAtribuicao(femea.animalId) : atribuirSemen(femea.animalId)}
                      >
                        {semenAtribuido ? (
                          <div className="semen-atribuido">
                            <div className="touro-nome">{semenAtribuido.nomeTouro}</div>
                            <div className="touro-raca">{semenAtribuido.raca}</div>
                            <button 
                              className="btn-remover"
                              onClick={(e) => {
                                e.stopPropagation();
                                removerAtribuicao(femea.animalId);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="slot-vazio">
                            {semenSelecionado ? 'Clique para atribuir' : 'Atribuir Sêmen'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Coluna da Direita: Inventário de Sêmen */}
            <div className="coluna-semen">
              <h3>Inventário de Sêmen</h3>
              <div className="semen-lista">
                {inventarioAtual.map(semen => (
                  <div 
                    key={semen.semenId} 
                    className={`semen-card ${semenSelecionado?.semenId === semen.semenId ? 'selecionado' : ''} ${semen.doses === 0 ? 'esgotado' : ''}`}
                    onClick={() => semen.doses > 0 && selecionarSemen(semen)}
                  >
                    <div className="semen-header">
                      <span className="semen-id">{semen.semenId}</span>
                      <span className="doses-disponiveis">{semen.doses} doses</span>
                    </div>
                    <div className="semen-info">
                      <div className="touro-nome">{semen.nomeTouro}</div>
                      <div className="touro-raca">{semen.raca}</div>
                      <div className="semen-preco">R$ {semen.precoPorDose}/dose</div>
                    </div>
                    {semen.doses === 0 && (
                      <div className="esgotado-label">Esgotado</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="etapa-footer">
            <button 
              className="btn-voltar"
              onClick={() => window.history.back()}
            >
              ← Voltar
            </button>
            <button 
              className="btn-avancar"
              disabled={!todasFemeasComSemen()}
              onClick={() => setStep(2)}
            >
              Revisar Protocolo →
            </button>
          </div>
        </div>
      )}

      {/* Etapa 2: Resumo e Confirmação */}
      {step === 2 && (
        <div className="etapa-container">
          <h2>📊 Resumo do Protocolo IATF</h2>
          <p className="etapa-descricao">
            Revise o plano de inseminação antes de executar o protocolo.
          </p>
          
          <div className="resumo-protocolo">
            <div className="resumo-header">
              <h3>Detalhes do Protocolo</h3>
            </div>
            
            <div className="resumo-stats">
              <div className="stat-item">
                <span className="stat-label">Fêmeas no Lote:</span>
                <span className="stat-valor">{loteFemeas.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Custo do Protocolo:</span>
                <span className="stat-valor">R$ {loteFemeas.length * custoProtocoloIATF}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Custo do Sêmen:</span>
                <span className="stat-valor">R$ {Object.values(planoInseminacao).reduce((total, semenId) => {
                  const semen = inventarioSemen.find(s => s.semenId === semenId);
                  return total + (semen ? semen.precoPorDose : 0);
                }, 0)}</span>
              </div>
              <div className="stat-item total">
                <span className="stat-label">Custo Total:</span>
                <span className="stat-valor">R$ {calcularCustoTotal()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Taxa de Sucesso Esperada:</span>
                <span className="stat-valor">60%</span>
              </div>
            </div>
            
            <div className="resumo-detalhes">
              <h4>Fêmeas e Sêmen Atribuído:</h4>
              <div className="detalhes-lista">
                {loteFemeas.map(femea => {
                  const semen = getSemenAtribuido(femea.animalId);
                  return (
                    <div key={femea.animalId} className="detalhe-item">
                      <div className="detalhe-femea">
                        <span className="femea-id">{femea.animalId}</span>
                      </div>
                      <div className="detalhe-semen">
                        <span className="semen-touro">{semen?.nomeTouro}</span>
                        <span className="semen-raca">({semen?.raca})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="etapa-footer">
            <button 
              className="btn-voltar"
              onClick={() => setStep(1)}
            >
              ← Voltar
            </button>
            <button 
              className="btn-executar"
              onClick={executarProtocoloIATF}
            >
              🚀 Iniciar Protocolo IATF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManejoReprodutivo; 