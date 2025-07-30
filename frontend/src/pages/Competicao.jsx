import React, { useState, useEffect } from 'react';
import './Competicao.css';
import { competicaoService, gameDataService, verificarBackendOnline, obterAnimaisNPCs } from '../api/competicaoService';

// Dados Mockados
const mockCalendarioEventos = [
  { 
    id: 'EVT01', 
    nome: '1ª Etapa - Circuito Vale do Ouro', 
    data: 'Março', 
    racas: ['Nelore'],
    local: 'Fazenda São João, MG',
    premio: 'R$ 15.000',
    descricao: 'Competição tradicional focada na rusticidade e funcionalidade do Nelore.'
  },
  { 
    id: 'EVT02', 
    nome: '2ª Etapa - ExpoAngus Prime', 
    data: 'Maio', 
    racas: ['Angus'],
    local: 'Centro de Eventos, RS',
    premio: 'R$ 25.000',
    descricao: 'Evento premium para animais de alto padrão genético e marmoreio.'
  },
  { 
    id: 'EVT03', 
    nome: '3ª Etapa - Feira Hereford do Pampa', 
    data: 'Julho', 
    racas: ['Hereford'],
    local: 'Pampa Gaúcho, RS',
    premio: 'R$ 18.000',
    descricao: 'Competição que valoriza a tradição e adaptabilidade do Hereford.'
  },
  { 
    id: 'EVT04', 
    nome: '4ª Etapa - ExpoZebu Master', 
    data: 'Setembro', 
    racas: ['Nelore', 'Hereford'],
    local: 'Centro de Exposições, SP',
    premio: 'R$ 30.000',
    descricao: 'Grande evento que reúne as melhores raças zebuínas do país.'
  },
  { 
    id: 'EVT05', 
    nome: '5ª Etapa - Copa Genética Taurina', 
    data: 'Novembro', 
    racas: ['Angus', 'Hereford'],
    local: 'Fazenda Modelo, PR',
    premio: 'R$ 35.000',
    descricao: 'Competição de elite para raças taurinas de alto padrão.'
  },
  { 
    id: 'EVT06', 
    nome: 'Finalíssima - Grande Campeão do Ano', 
    data: 'Dezembro', 
    racas: ['Nelore', 'Angus', 'Hereford'],
    local: 'Centro de Eventos Nacional, DF',
    premio: 'R$ 100.000',
    descricao: 'A maior competição do ano, reunindo os melhores animais de todas as raças.'
  }
];

const mockMeusAnimais = [
  { 
    animalId: 'VABE0001', 
    raca: 'Nelore', 
    categoria: 'Fêmea Jovem',
    nome: 'Estrela do Vale',
    idade: '18 meses',
    valor: 8500
  },
  { 
    animalId: 'VABE0002', 
    raca: 'Nelore', 
    categoria: 'Macho Jovem',
    nome: 'Touro do Sertão',
    idade: '24 meses',
    valor: 12000
  },
  { 
    animalId: 'ANGU0003', 
    raca: 'Angus', 
    categoria: 'Fêmea Adulta',
    nome: 'Rainha Negra',
    idade: '36 meses',
    valor: 18000
  },
  { 
    animalId: 'ANGU0004', 
    raca: 'Angus', 
    categoria: 'Macho Sênior',
    nome: 'Rei do Marmoreio',
    idade: '48 meses',
    valor: 25000
  },
  { 
    animalId: 'HERF0005', 
    raca: 'Hereford', 
    categoria: 'Fêmea Jovem',
    nome: 'Flor do Pampa',
    idade: '20 meses',
    valor: 9500
  },
  { 
    animalId: 'HERF0006', 
    raca: 'Hereford', 
    categoria: 'Macho Jovem',
    nome: 'Campeão Vermelho',
    idade: '22 meses',
    valor: 11000
  }
];

const mockResultados = {
  'EVT01': {
    juiz: 'Dr. Arnaldo Pires',
    especialidade: 'Nelore',
    podio: [
      { posicao: 1, animalId: 'VABE0002', nome: 'Touro do Sertão', dono: 'Jogador', pontuacao: 92.5, medalha: '🥇' },
      { posicao: 2, animalId: 'NELO0015', nome: 'Princesa do Vale', dono: 'Fazenda Santa Maria', pontuacao: 89.3, medalha: '🥈' },
      { posicao: 3, animalId: 'NELO0023', nome: 'Gigante do Sertão', dono: 'Fazenda Boa Vista', pontuacao: 87.1, medalha: '🥉' }
    ]
  },
  'EVT02': {
    juiz: 'Isabelle Rochefort',
    especialidade: 'Angus',
    podio: [
      { posicao: 1, animalId: 'ANGU0004', nome: 'Rei do Marmoreio', dono: 'Jogador', pontuacao: 95.8, medalha: '🥇' },
      { posicao: 2, animalId: 'ANGU0003', nome: 'Rainha Negra', dono: 'Jogador', pontuacao: 91.2, medalha: '🥈' },
      { posicao: 3, animalId: 'ANGU0012', nome: 'Black Diamond', dono: 'Fazenda Modelo', pontuacao: 88.7, medalha: '🥉' }
    ]
  }
};

const Competicao = () => {
  const [telaAtual, setTelaAtual] = useState('calendario'); // 'calendario', 'inscricao', 'resultados'
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [animaisSelecionados, setAnimaisSelecionados] = useState([]);
  const [resultadoAtual, setResultadoAtual] = useState(null);
  
  // Estados para dados da API
  const [calendarioEventos, setCalendarioEventos] = useState([]);
  const [meusAnimais, setMeusAnimais] = useState([]);
  const [animaisNPCs, setAnimaisNPCs] = useState([]);
  const [juizes, setJuizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Verificar se o backend está online
        const online = await verificarBackendOnline();
        setBackendOnline(online);
        
        if (online) {
          // Carregar dados do backend
          const [juizesData, animaisNPCsData] = await Promise.all([
            competicaoService.listarJuizes(),
            obterAnimaisNPCs()
          ]);
          
          setJuizes(juizesData.juizes || []);
          setAnimaisNPCs(animaisNPCsData);
        }
        
        // Carregar dados mockados (sempre disponíveis)
        const [calendarioData, meusAnimaisData] = await Promise.all([
          gameDataService.obterCalendarioEventos(),
          gameDataService.obterMeusAnimais()
        ]);
        
        setCalendarioEventos(calendarioData);
        setMeusAnimais(meusAnimaisData);
        
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Verifique se o backend está rodando.');
        
        // Carregar dados mockados em caso de erro
        const [calendarioData, meusAnimaisData] = await Promise.all([
          gameDataService.obterCalendarioEventos(),
          gameDataService.obterMeusAnimais()
        ]);
        
        setCalendarioEventos(calendarioData);
        setMeusAnimais(meusAnimaisData);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);

  // Função para obter categorias disponíveis para uma raça
  const getCategoriasDisponiveis = (raca) => {
    const categorias = ['Fêmea Jovem', 'Fêmea Adulta', 'Macho Jovem', 'Macho Sênior'];
    return categorias;
  };

  // Função para filtrar animais elegíveis
  const getAnimaisElegiveis = (raca, categoria) => {
    // Combinar animais do jogador e NPCs
    const todosAnimais = [...meusAnimais, ...animaisNPCs];
    return todosAnimais.filter(animal => 
      animal.breed === raca && animal.categoria === categoria
    );
  };

  // Função para alternar seleção de animal
  const toggleAnimalSelecao = (animalId) => {
    setAnimaisSelecionados(prev => {
      if (prev.includes(animalId)) {
        return prev.filter(id => id !== animalId);
      } else {
        return [...prev, animalId];
      }
    });
  };

  // Função para confirmar inscrição
  const confirmarInscricao = async () => {
    if (animaisSelecionados.length === 0) {
      alert('Selecione pelo menos um animal para inscrever!');
      return;
    }

    try {
      setLoading(true);
      
      if (backendOnline) {
        // Usar API real do backend
        const resultado = await competicaoService.julgarCompeticao(
          eventoSelecionado.racas[0], // Usar primeira raça do evento
          'Macho Jovem', // Categoria padrão - pode ser expandida
          animaisSelecionados
        );
        
        if (resultado.sucesso) {
          setResultadoAtual(resultado);
          setTelaAtual('resultados');
        } else {
          alert('Erro ao processar competição: ' + resultado.mensagem);
        }
      } else {
        // Usar dados mockados se backend offline
        setTimeout(() => {
          setResultadoAtual(mockResultados[eventoSelecionado.id] || {
            juiz: 'Juiz Especialista',
            especialidade: eventoSelecionado.racas[0],
            podio: [
              { posicao: 1, animalId: animaisSelecionados[0], nome: 'Vencedor', dono: 'Jogador', pontuacao: 90.0, medalha: '🥇' },
              { posicao: 2, animalId: 'NPC001', nome: 'Segundo Lugar', dono: 'NPC', pontuacao: 85.0, medalha: '🥈' },
              { posicao: 3, animalId: 'NPC002', nome: 'Terceiro Lugar', dono: 'NPC', pontuacao: 80.0, medalha: '🥉' }
            ]
          });
          setTelaAtual('resultados');
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao confirmar inscrição:', error);
      alert('Erro ao processar competição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para voltar ao calendário
  const voltarAoCalendario = () => {
    setTelaAtual('calendario');
    setEventoSelecionado(null);
    setAnimaisSelecionados([]);
    setResultadoAtual(null);
  };

  // Renderizar tela de calendário
  const renderCalendario = () => (
    <div className="competicao-container">
      <div className="competicao-header">
        <h1>🏆 Calendário de Competições</h1>
        <p>Participe dos principais eventos de julgamento do ano</p>
        {!backendOnline && (
          <div className="backend-status">
            <span className="status-offline">⚠️ Modo Offline - Dados Mockados</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando competições...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>Tentar Novamente</button>
        </div>
      ) : (
        <div className="eventos-grid">
          {calendarioEventos.map((evento) => (
          <div 
            key={evento.id} 
            className="evento-card"
            onClick={() => {
              setEventoSelecionado(evento);
              setTelaAtual('inscricao');
            }}
          >
            <div className="evento-header">
              <h3>{evento.nome}</h3>
              <span className="evento-data">{evento.data}</span>
            </div>
            
            <div className="evento-detalhes">
              <p className="evento-local">📍 {evento.local}</p>
              <p className="evento-premio">💰 {evento.premio}</p>
              <p className="evento-descricao">{evento.descricao}</p>
            </div>

            <div className="evento-racas">
              <h4>Raças Participantes:</h4>
              <div className="racas-tags">
                {evento.racas.map(raca => (
                  <span key={raca} className="raca-tag">{raca}</span>
                ))}
              </div>
            </div>

            <div className="evento-acoes">
              <button className="btn-inscrever">
                Inscrever Animais →
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );

  // Renderizar tela de inscrição
  const renderInscricao = () => (
    <div className="competicao-container">
      <div className="competicao-header">
        <button className="btn-voltar" onClick={voltarAoCalendario}>
          ← Voltar ao Calendário
        </button>
        <h1>📝 Inscrição - {eventoSelecionado.nome}</h1>
        <p>Selecione os animais que deseja inscrever</p>
      </div>

      <div className="inscricao-content">
        <div className="evento-info">
          <h3>Informações do Evento</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Data:</strong> {eventoSelecionado.data}
            </div>
            <div className="info-item">
              <strong>Local:</strong> {eventoSelecionado.local}
            </div>
            <div className="info-item">
              <strong>Prêmio:</strong> {eventoSelecionado.premio}
            </div>
            <div className="info-item">
              <strong>Juiz:</strong> Especialista em {eventoSelecionado.racas.join(', ')}
            </div>
          </div>
        </div>

        <div className="categorias-section">
          <h3>Categorias Disponíveis</h3>
          {eventoSelecionado.racas.map(raca => (
            <div key={raca} className="raca-categoria">
              <h4>{raca}</h4>
              <div className="categorias-grid">
                {getCategoriasDisponiveis(raca).map(categoria => {
                  const animaisElegiveis = getAnimaisElegiveis(raca, categoria);
                  return (
                    <div key={categoria} className="categoria-card">
                      <h5>{categoria}</h5>
                      {animaisElegiveis.length > 0 ? (
                        <div className="animais-lista">
                          {animaisElegiveis.map(animal => (
                            <div key={animal.animalId} className="animal-item">
                              <label className="checkbox-container">
                                <input
                                  type="checkbox"
                                  checked={animaisSelecionados.includes(animal.animalId)}
                                  onChange={() => toggleAnimalSelecao(animal.animalId)}
                                />
                                <span className="checkmark"></span>
                                <div className="animal-info">
                                  <strong>{animal.nome}</strong>
                                  <span>{animal.animalId}</span>
                                  <span>{animal.idade}</span>
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="sem-animais">Nenhum animal elegível</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="inscricao-acoes">
          <div className="resumo-inscricao">
            <h4>Resumo da Inscrição</h4>
            <p>Animais selecionados: {animaisSelecionados.length}</p>
            {!backendOnline && (
              <p className="modo-offline">📡 Modo Offline - Resultados Simulados</p>
            )}
          </div>
          <button 
            className="btn-confirmar"
            onClick={confirmarInscricao}
            disabled={animaisSelecionados.length === 0 || loading}
          >
            {loading ? 'Processando...' : 'Confirmar Inscrição'}
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar tela de resultados
  const renderResultados = () => (
    <div className="competicao-container">
      <div className="competicao-header">
        <button className="btn-voltar" onClick={voltarAoCalendario}>
          ← Voltar ao Calendário
        </button>
        <h1>🏆 Resultados - {eventoSelecionado.nome}</h1>
        <p>Julgamento realizado por {resultadoAtual.juiz}</p>
      </div>

      <div className="resultados-content">
        <div className="juiz-info">
          <h3>Juiz Responsável</h3>
          <div className="juiz-card">
            <div className="juiz-avatar">👨‍⚖️</div>
            <div className="juiz-detalhes">
              <h4>{resultadoAtual.juiz}</h4>
              <p>Especialista em {resultadoAtual.especialidade}</p>
            </div>
          </div>
        </div>

        <div className="podio-section">
          <h3>Pódio da Competição</h3>
          <div className="podio-container">
            {/* 2º Lugar */}
            {resultadoAtual.podio[1] && (
              <div className="podio-item segundo-lugar">
                <div className="medalha">{resultadoAtual.podio[1].medalha}</div>
                <div className="posicao">2º</div>
                <div className="animal-info">
                  <h4>{resultadoAtual.podio[1].nome}</h4>
                  <p>{resultadoAtual.podio[1].animalId}</p>
                  <p className="dono">{resultadoAtual.podio[1].dono}</p>
                </div>
                <div className="pontuacao">
                  {resultadoAtual.podio[1].pontuacao} pts
                </div>
              </div>
            )}

            {/* 1º Lugar */}
            {resultadoAtual.podio[0] && (
              <div className="podio-item primeiro-lugar">
                <div className="medalha">{resultadoAtual.podio[0].medalha}</div>
                <div className="posicao">1º</div>
                <div className="animal-info">
                  <h4>{resultadoAtual.podio[0].nome}</h4>
                  <p>{resultadoAtual.podio[0].animalId}</p>
                  <p className="dono">{resultadoAtual.podio[0].dono}</p>
                </div>
                <div className="pontuacao">
                  {resultadoAtual.podio[0].pontuacao} pts
                </div>
              </div>
            )}

            {/* 3º Lugar */}
            {resultadoAtual.podio[2] && (
              <div className="podio-item terceiro-lugar">
                <div className="medalha">{resultadoAtual.podio[2].medalha}</div>
                <div className="posicao">3º</div>
                <div className="animal-info">
                  <h4>{resultadoAtual.podio[2].nome}</h4>
                  <p>{resultadoAtual.podio[2].animalId}</p>
                  <p className="dono">{resultadoAtual.podio[2].dono}</p>
                </div>
                <div className="pontuacao">
                  {resultadoAtual.podio[2].pontuacao} pts
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="resultados-acoes">
          <button className="btn-nova-competicao" onClick={voltarAoCalendario}>
            Participar de Outra Competição
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar componente baseado na tela atual
  return (
    <div className="competicao-page">
      {telaAtual === 'calendario' && renderCalendario()}
      {telaAtual === 'inscricao' && renderInscricao()}
      {telaAtual === 'resultados' && renderResultados()}
    </div>
  );
};

export default Competicao; 