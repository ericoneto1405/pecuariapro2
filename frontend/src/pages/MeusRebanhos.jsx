import React, { useState, useEffect } from 'react';
import { 
  CaretDown, 
  CaretRight, 
  MapPin, 
  Users, 
  Ruler, 
  Horse, 
  Cow, 
  ArrowsOutCardinal,
  Plus,
  Minus,
  Package
} from '@phosphor-icons/react';
import CriarPastoModal from '../components/CriarPastoModal';
import { obterInventarioInsumos } from '../api/pastosService';
import './MeusRebanhos.css';

// Dados mockados para desenvolvimento
const dadosMockados = {
  "assets": [
    {
      "assetId": "fazenda_inicial_01",
      "name": "Fazenda Vale Verde",
      "size_hectares": 300,
      "pastos": [
        {
          "pastoId": "fazenda_inicial_01_pasto_01",
          "nome": "Pasto Maternidade",
          "capacidade_ua": 45,
          "area_ha": 45,
          "tipo": "maternidade"
        },
        {
          "pastoId": "fazenda_inicial_01_pasto_02",
          "nome": "Pasto de Recria",
          "capacidade_ua": 75,
          "area_ha": 75,
          "tipo": "recria"
        },
        {
          "pastoId": "fazenda_inicial_01_pasto_03",
          "nome": "Pasto de Engorda",
          "capacidade_ua": 60,
          "area_ha": 60,
          "tipo": "engorda"
        },
        {
          "pastoId": "fazenda_inicial_01_pasto_04",
          "nome": "Pasto de Touros",
          "capacidade_ua": 30,
          "area_ha": 30,
          "tipo": "touros"
        }
      ]
    },
    {
      "assetId": "fazenda_02",
      "name": "Fazenda Serra Azul",
      "size_hectares": 450,
      "pastos": [
        {
          "pastoId": "fazenda_02_pasto_01",
          "nome": "Pasto Principal",
          "capacidade_ua": 90,
          "area_ha": 90,
          "tipo": "geral"
        },
        {
          "pastoId": "fazenda_02_pasto_02",
          "nome": "Pasto de Reserva",
          "capacidade_ua": 120,
          "area_ha": 120,
          "tipo": "reserva"
        }
      ]
    }
  ],
  "inventory": [
    {
      "animalId": "NELO1001",
      "localizacao": "fazenda_inicial_01_pasto_04",
      "breed": "Nelore",
      "sex": "Macho",
      "baseValue": 0.95,
      "nome": "Touro Nelore 001"
    },
    {
      "animalId": "MEST1002",
      "localizacao": "fazenda_inicial_01_pasto_01",
      "breed": "Mestiço",
      "sex": "Fêmea",
      "baseValue": 0.88,
      "nome": "Vaca Mestiça 002"
    },
    {
      "animalId": "ANGO1003",
      "localizacao": "fazenda_inicial_01_pasto_01",
      "breed": "Angus",
      "sex": "Fêmea",
      "baseValue": 0.92,
      "nome": "Vaca Angus 003"
    },
    {
      "animalId": "NELO1004",
      "localizacao": "fazenda_inicial_01_pasto_02",
      "breed": "Nelore",
      "sex": "Fêmea",
      "baseValue": 0.87,
      "nome": "Novilha Nelore 004"
    },
    {
      "animalId": "ANGO1005",
      "localizacao": "fazenda_02_pasto_01",
      "breed": "Angus",
      "sex": "Macho",
      "baseValue": 0.94,
      "nome": "Touro Angus 005"
    },
    {
      "animalId": "MEST1006",
      "localizacao": "fazenda_02_pasto_01",
      "breed": "Mestiço",
      "sex": "Fêmea",
      "baseValue": 0.89,
      "nome": "Vaca Mestiça 006"
    }
  ]
};

const MeusRebanhos = () => {
  const [dados, setDados] = useState(dadosMockados);
  const [fazendasExpandidas, setFazendasExpandidas] = useState(new Set());
  const [pastosExpandidos, setPastosExpandidos] = useState(new Set());
  const [animalArrastado, setAnimalArrastado] = useState(null);
  const [pastoDestino, setPastoDestino] = useState(null);
  const [modalCriarPasto, setModalCriarPasto] = useState({ aberta: false, fazenda: null });
  const [inventarioInsumos, setInventarioInsumos] = useState(null);

  // Calcular estatísticas para uma fazenda
  const calcularEstatisticasFazenda = (fazenda) => {
    const animaisFazenda = dados.inventory.filter(animal => 
      fazenda.pastos.some(pasto => pasto.pastoId === animal.localizacao)
    );
    
    const totalAnimais = animaisFazenda.length;
    const totalCapacidade = fazenda.pastos.reduce((sum, pasto) => sum + pasto.capacidade_ua, 0);
    const lotacaoAtual = totalAnimais;
    
    return {
      totalAnimais,
      totalCapacidade,
      lotacaoAtual,
      percentualLotacao: totalCapacidade > 0 ? (lotacaoAtual / totalCapacidade) * 100 : 0
    };
  };

  // Calcular estatísticas para um pasto
  const calcularEstatisticasPasto = (pasto) => {
    const animaisPasto = dados.inventory.filter(animal => animal.localizacao === pasto.pastoId);
    
    const machos = animaisPasto.filter(animal => animal.sex === 'Macho').length;
    const femeas = animaisPasto.filter(animal => animal.sex === 'Fêmea').length;
    
    const resumo = [];
    if (machos > 0) resumo.push(`${machos} ${machos === 1 ? 'Macho' : 'Machos'}`);
    if (femeas > 0) resumo.push(`${femeas} ${femeas === 1 ? 'Fêmea' : 'Fêmeas'}`);
    
    return {
      totalAnimais: animaisPasto.length,
      machos,
      femeas,
      resumo: resumo.join(', '),
      percentualLotacao: pasto.capacidade_ua > 0 ? (animaisPasto.length / pasto.capacidade_ua) * 100 : 0
    };
  };

  // Obter animais de um pasto
  const obterAnimaisPasto = (pastoId) => {
    return dados.inventory.filter(animal => animal.localizacao === pastoId);
  };

  // Toggle expansão de fazenda
  const toggleFazenda = (fazendaId) => {
    const novasFazendas = new Set(fazendasExpandidas);
    if (novasFazendas.has(fazendaId)) {
      novasFazendas.delete(fazendaId);
    } else {
      novasFazendas.add(fazendaId);
    }
    setFazendasExpandidas(novasFazendas);
  };

  // Toggle expansão de pasto
  const togglePasto = (pastoId) => {
    const novosPastos = new Set(pastosExpandidos);
    if (novosPastos.has(pastoId)) {
      novosPastos.delete(pastoId);
    } else {
      novosPastos.add(pastoId);
    }
    setPastosExpandidos(novosPastos);
  };

  // Iniciar drag
  const iniciarDrag = (animal) => {
    setAnimalArrastado(animal);
  };

  // Finalizar drag
  const finalizarDrag = () => {
    if (animalArrastado && pastoDestino) {
      // Verificar se o pasto de destino tem capacidade
      const estatisticasPasto = calcularEstatisticasPasto(pastoDestino);
      if (estatisticasPasto.totalAnimais < pastoDestino.capacidade_ua) {
        // Mover animal
        const novosDados = {
          ...dados,
          inventory: dados.inventory.map(animal => 
            animal.animalId === animalArrastado.animalId 
              ? { ...animal, localizacao: pastoDestino.pastoId }
              : animal
          )
        };
        setDados(novosDados);
      }
    }
    setAnimalArrastado(null);
    setPastoDestino(null);
  };

  // Drag over
  const handleDragOver = (e, pasto) => {
    e.preventDefault();
    setPastoDestino(pasto);
  };

  // Drag leave
  const handleDragLeave = () => {
    setPastoDestino(null);
  };

  // Obter ícone da raça
  const getIconeRaca = (raca) => {
    switch (raca.toLowerCase()) {
      case 'nelore':
        return <Cow size={16} />;
      case 'angus':
        return <Horse size={16} />;
      default:
        return <Cow size={16} />;
    }
  };

  // Obter cor do status de lotação
  const getCorLotacao = (percentual) => {
    if (percentual >= 90) return '#ef4444'; // Vermelho
    if (percentual >= 70) return '#f59e0b'; // Amarelo
    return '#10b981'; // Verde
  };

  // Carregar inventário de insumos
  const carregarInventarioInsumos = async () => {
    try {
      // Usar NPC jogador (npc_01 como exemplo)
      const data = await obterInventarioInsumos('npc_01');
      setInventarioInsumos(data.inventario);
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
    }
  };

  // Abrir modal de criar pasto
  const abrirModalCriarPasto = (fazenda) => {
    setModalCriarPasto({ aberta: true, fazenda });
  };

  // Fechar modal de criar pasto
  const fecharModalCriarPasto = () => {
    setModalCriarPasto({ aberta: false, fazenda: null });
  };

  // Callback quando um pasto é criado
  const onPastoCriado = (novoPasto) => {
    const novosDados = {
      ...dados,
      assets: dados.assets.map(fazenda => 
        fazenda.assetId === modalCriarPasto.fazenda.assetId
          ? {
              ...fazenda,
              pastos: [...fazenda.pastos, novoPasto]
            }
          : fazenda
      )
    };
    setDados(novosDados);
    
    // Recarregar inventário
    carregarInventarioInsumos();
  };

  // Carregar inventário ao montar componente
  useEffect(() => {
    carregarInventarioInsumos();
  }, []);

  return (
    <div className="meus-rebanhos">
      <div className="rebanhos-header">
        <h1>🐄 Meus Rebanhos</h1>
        <p>Gerencie seus animais distribuídos por fazendas e pastos</p>
      </div>

      <div className="rebanhos-container">
        {dados.assets.map((fazenda) => {
          const statsFazenda = calcularEstatisticasFazenda(fazenda);
          const isExpandida = fazendasExpandidas.has(fazenda.assetId);

          return (
            <div key={fazenda.assetId} className="fazenda-painel">
              {/* Cabeçalho da Fazenda */}
              <div className="fazenda-header">
                <div 
                  className="fazenda-info"
                  onClick={() => toggleFazenda(fazenda.assetId)}
                >
                  <div className="fazenda-icon">
                    {isExpandida ? <CaretDown size={20} /> : <CaretRight size={20} />}
                  </div>
                  <div className="fazenda-detalhes">
                    <h3>{fazenda.name}</h3>
                    <div className="fazenda-stats">
                      <span className="stat">
                        <Users size={16} />
                        {statsFazenda.totalAnimais} animais
                      </span>
                      <span className="stat">
                        <Ruler size={16} />
                        {fazenda.size_hectares} ha
                      </span>
                      <span 
                        className="stat lotacao"
                        style={{ color: getCorLotacao(statsFazenda.percentualLotacao) }}
                      >
                        <MapPin size={16} />
                        {statsFazenda.lotacaoAtual}/{statsFazenda.totalCapacidade} UA
                        ({statsFazenda.percentualLotacao.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="fazenda-acoes">
                  <button
                    className="btn-criar-pasto"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModalCriarPasto(fazenda);
                    }}
                    title="Criar novo pasto"
                  >
                    <Plus size={16} />
                    Novo Pasto
                  </button>
                </div>
              </div>

              {/* Conteúdo da Fazenda */}
              {isExpandida && (
                <div className="fazenda-conteudo">
                  <div className="pastos-grid">
                    {fazenda.pastos.map((pasto) => {
                      const statsPasto = calcularEstatisticasPasto(pasto);
                      const animaisPasto = obterAnimaisPasto(pasto.pastoId);
                      const isPastoExpandido = pastosExpandidos.has(pasto.pastoId);
                      const isDestino = pastoDestino?.pastoId === pasto.pastoId;

                      return (
                        <div 
                          key={pasto.pastoId} 
                          className={`pasto-card ${isDestino ? 'destino-drag' : ''}`}
                          onDragOver={(e) => handleDragOver(e, pasto)}
                          onDragLeave={handleDragLeave}
                          onDrop={finalizarDrag}
                        >
                          {/* Cabeçalho do Pasto */}
                          <div 
                            className="pasto-header"
                            onClick={() => togglePasto(pasto.pastoId)}
                          >
                            <div className="pasto-info">
                              <div className="pasto-icon">
                                {isPastoExpandido ? <CaretDown size={16} /> : <CaretRight size={16} />}
                              </div>
                              <div className="pasto-detalhes">
                                <h4>{pasto.nome}</h4>
                                <div className="pasto-stats">
                                  <span className="stat">
                                    {statsPasto.totalAnimais}/{pasto.capacidade_ua} UA
                                  </span>
                                  <span 
                                    className="stat lotacao"
                                    style={{ color: getCorLotacao(statsPasto.percentualLotacao) }}
                                  >
                                    {statsPasto.percentualLotacao.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="pasto-resumo">
                                  {statsPasto.resumo || 'Vazio'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Lista de Animais */}
                          {isPastoExpandido && (
                            <div className="animais-lista">
                              {animaisPasto.length > 0 ? (
                                animaisPasto.map((animal) => (
                                  <div 
                                    key={animal.animalId}
                                    className="animal-card"
                                    draggable
                                    onDragStart={() => iniciarDrag(animal)}
                                  >
                                    <div className="animal-icon">
                                      {getIconeRaca(animal.breed)}
                                    </div>
                                    <div className="animal-info">
                                      <div className="animal-nome">
                                        {animal.nome || `${animal.breed} ${animal.animalId}`}
                                      </div>
                                      <div className="animal-detalhes">
                                        <span className="animal-sexo">
                                          {animal.sex === 'Macho' ? '♂' : '♀'}
                                        </span>
                                        <span className="animal-raca">
                                          {animal.breed}
                                        </span>
                                        <span className="animal-valor">
                                          {(animal.baseValue * 100).toFixed(0)}%
                                        </span>
                                      </div>
                                    </div>
                                    <div className="animal-drag-icon">
                                      <ArrowsOutCardinal size={16} />
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="pasto-vazio">
                                  <span>Nenhum animal neste pasto</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instruções */}
      <div className="instrucoes">
        <h3>💡 Como usar:</h3>
        <ul>
          <li>Clique no cabeçalho da fazenda para expandir/contrair</li>
          <li>Clique no card do pasto para ver os animais</li>
          <li>Arraste animais entre pastos para reorganizar</li>
          <li>As cores indicam a lotação: Verde (OK), Amarelo (Atenção), Vermelho (Lotado)</li>
          <li>Use o botão "Novo Pasto" para criar novos pastos (consome insumos)</li>
        </ul>
      </div>

      {/* Modal de Criar Pasto */}
      <CriarPastoModal
        aberta={modalCriarPasto.aberta}
        fazenda={modalCriarPasto.fazenda}
        npcId="npc_01"
        onFechar={fecharModalCriarPasto}
        onPastoCriado={onPastoCriado}
      />
    </div>
  );
};

export default MeusRebanhos;