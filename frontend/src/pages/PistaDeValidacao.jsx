import React, { useState } from 'react';
import './PistaDeValidacao.css';

// Dados Mockados
const mockCalendarioEventos = [
  { 
    id: 'EVT01', 
    nome: '1ª Avaliação Zebu - Etapa Nordeste', 
    data: 'Março', 
    racas: ['Nelore'],
    local: 'Centro de Exposições, Recife - PE',
    descricao: 'Avaliação especializada focada na rusticidade e adaptabilidade do Nelore no clima nordestino.',
    juiz: 'Dr. Arnaldo Pires',
    especialidade: 'Nelore',
    criterios: ['Rusticidade', 'Padrão Racial', 'Aprumos', 'Fertilidade']
  },
  { 
    id: 'EVT02', 
    nome: '1ª Avaliação Taurinos - Etapa Sul', 
    data: 'Maio', 
    racas: ['Angus', 'Hereford'],
    local: 'Centro de Eventos, Porto Alegre - RS',
    descricao: 'Avaliação de raças taurinas com foco em marmoreio, precocidade e qualidade de carne.',
    juiz: 'Isabelle Rochefort',
    especialidade: 'Angus',
    criterios: ['Marmoreio', 'Precocidade', 'Acabamento', 'Qualidade da Carne']
  },
  { 
    id: 'EVT03', 
    nome: '2ª Avaliação Zebu - Etapa Centro-Oeste', 
    data: 'Julho', 
    racas: ['Nelore'],
    local: 'Fazenda Modelo, Goiânia - GO',
    descricao: 'Avaliação no cerrado brasileiro, testando resistência e produtividade em pastagens tropicais.',
    juiz: 'Dr. Carlos Mendes',
    especialidade: 'Nelore',
    criterios: ['Resistência', 'Produtividade', 'Eficiência Alimentar', 'Adaptação Climática']
  },
  { 
    id: 'EVT04', 
    nome: '2ª Avaliação Taurinos - Etapa Sudeste', 
    data: 'Setembro', 
    racas: ['Angus'],
    local: 'Centro de Exposições, São Paulo - SP',
    descricao: 'Avaliação premium para mercado gourmet, focada em genética de elite e alto padrão.',
    juiz: 'Isabelle Rochefort',
    especialidade: 'Angus',
    criterios: ['Genética de Elite', 'Marmoreio Superior', 'Precocidade', 'Conformação']
  },
  { 
    id: 'EVT05', 
    nome: 'Classificatória Nacional de Genética', 
    data: 'Novembro', 
    racas: ['Nelore', 'Angus', 'Hereford'],
    local: 'Centro de Eventos Nacional, Brasília - DF',
    descricao: 'Avaliação nacional que define o ranking de performance genética para o ano seguinte.',
    juiz: 'Dr. Roberto Silva',
    especialidade: 'Múltiplas Raças',
    criterios: ['Performance Genética', 'Potencial Reprodutivo', 'Qualidade Racial', 'Mercado']
  },
  { 
    id: 'EVT06', 
    nome: 'Ranking Anual de Performance Genética', 
    data: 'Dezembro', 
    racas: ['Nelore', 'Angus', 'Hereford'],
    local: 'Centro de Eventos Nacional, Brasília - DF',
    descricao: 'Avaliação final do ano que consolida o ranking nacional e define os animais de elite.',
    juiz: 'Comissão Nacional de Genética',
    especialidade: 'Todas as Raças',
    criterios: ['Performance Geral', 'Potencial de Mercado', 'Qualidade Genética', 'Reputação']
  }
];

const mockMeusAnimais = [
  { 
    animalId: 'NELO1234', 
    raca: 'Nelore', 
    categoria: 'Fêmea Jovem',
    nome: 'Estrela do Sertão',
    idade: '18 meses',
    valor: 8500,
    genetica: 'Boa',
    ecc: 4.2
  },
  { 
    animalId: 'NELO1235', 
    raca: 'Nelore', 
    categoria: 'Macho Jovem',
    nome: 'Touro do Cerrado',
    idade: '24 meses',
    valor: 12000,
    genetica: 'Elite',
    ecc: 4.8
  },
  { 
    animalId: 'ANGU4567', 
    raca: 'Angus', 
    categoria: 'Fêmea Adulta',
    nome: 'Rainha Negra',
    idade: '36 meses',
    valor: 18000,
    genetica: 'Superior',
    ecc: 4.5
  },
  { 
    animalId: 'ANGU4568', 
    raca: 'Angus', 
    categoria: 'Macho Sênior',
    nome: 'Rei do Marmoreio',
    idade: '48 meses',
    valor: 25000,
    genetica: 'Elite',
    ecc: 4.9
  },
  { 
    animalId: 'HERF7890', 
    raca: 'Hereford', 
    categoria: 'Fêmea Jovem',
    nome: 'Flor do Pampa',
    idade: '20 meses',
    valor: 9500,
    genetica: 'Boa',
    ecc: 4.0
  },
  { 
    animalId: 'HERF7891', 
    raca: 'Hereford', 
    categoria: 'Macho Jovem',
    nome: 'Campeão Vermelho',
    idade: '22 meses',
    valor: 11000,
    genetica: 'Superior',
    ecc: 4.3
  }
];

const mockResultados = {
  'EVT01': {
    juiz: 'Dr. Arnaldo Pires',
    especialidade: 'Nelore',
    criterios: ['Rusticidade', 'Padrão Racial', 'Aprumos', 'Fertilidade'],
    classificacao: [
      { posicao: 1, animalId: 'NELO1235', nome: 'Touro do Cerrado', dono: 'Jogador', pontuacao: 94.2, status: 'Elite', destaque: 'Genética de Elite' },
      { posicao: 2, animalId: 'NELO0015', nome: 'Princesa do Vale', dono: 'Fazenda Santa Maria', pontuacao: 91.8, status: 'Superior', destaque: 'Potencial Superior' },
      { posicao: 3, animalId: 'NELO0023', nome: 'Gigante do Sertão', dono: 'Fazenda Boa Vista', pontuacao: 89.5, status: 'Bom', destaque: null },
      { posicao: 4, animalId: 'NELO1234', nome: 'Estrela do Sertão', dono: 'Jogador', pontuacao: 87.3, status: 'Bom', destaque: null },
      { posicao: 5, animalId: 'NELO0045', nome: 'Vaqueiro do Nordeste', dono: 'Fazenda Nordeste', pontuacao: 85.1, status: 'Regular', destaque: null }
    ]
  },
  'EVT02': {
    juiz: 'Isabelle Rochefort',
    especialidade: 'Angus',
    criterios: ['Marmoreio', 'Precocidade', 'Acabamento', 'Qualidade da Carne'],
    classificacao: [
      { posicao: 1, animalId: 'ANGU4568', nome: 'Rei do Marmoreio', dono: 'Jogador', pontuacao: 96.8, status: 'Elite', destaque: 'Genética de Elite' },
      { posicao: 2, animalId: 'ANGU4567', nome: 'Rainha Negra', dono: 'Jogador', pontuacao: 93.5, status: 'Superior', destaque: 'Potencial Superior' },
      { posicao: 3, animalId: 'ANGU0012', nome: 'Black Diamond', dono: 'Fazenda Modelo', pontuacao: 90.2, status: 'Superior', destaque: 'Potencial Superior' },
      { posicao: 4, animalId: 'ANGU0034', nome: 'Premium Angus', dono: 'Fazenda Sul', pontuacao: 87.9, status: 'Bom', destaque: null },
      { posicao: 5, animalId: 'ANGU0056', nome: 'Classic Angus', dono: 'Fazenda Tradicional', pontuacao: 84.6, status: 'Regular', destaque: null }
    ]
  }
};

const PistaDeValidacao = () => {
  const [telaAtual, setTelaAtual] = useState('calendario'); // 'calendario', 'inscricao', 'relatorio'
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [animaisSelecionados, setAnimaisSelecionados] = useState([]);
  const [resultadoAtual, setResultadoAtual] = useState(null);

  // Função para obter categorias disponíveis para uma raça
  const getCategoriasDisponiveis = (raca) => {
    const categorias = ['Fêmea Jovem', 'Fêmea Adulta', 'Macho Jovem', 'Macho Sênior'];
    return categorias;
  };

  // Função para filtrar animais elegíveis
  const getAnimaisElegiveis = (raca, categoria) => {
    return mockMeusAnimais.filter(animal => 
      animal.raca === raca && animal.categoria === categoria
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
  const confirmarInscricao = () => {
    if (animaisSelecionados.length === 0) {
      alert('Selecione pelo menos um animal para avaliação!');
      return;
    }

    // Simular chamada ao backend
    setTimeout(() => {
      setResultadoAtual(mockResultados[eventoSelecionado.id] || {
        juiz: 'Especialista',
        especialidade: eventoSelecionado.racas[0],
        criterios: ['Performance', 'Genética', 'Mercado', 'Reputação'],
        classificacao: [
          { posicao: 1, animalId: animaisSelecionados[0], nome: 'Animal Avaliado', dono: 'Jogador', pontuacao: 90.0, status: 'Bom', destaque: null },
          { posicao: 2, animalId: 'NPC001', nome: 'Animal NPC', dono: 'NPC', pontuacao: 85.0, status: 'Regular', destaque: null },
          { posicao: 3, animalId: 'NPC002', nome: 'Outro Animal', dono: 'NPC', pontuacao: 80.0, status: 'Regular', destaque: null }
        ]
      });
      setTelaAtual('relatorio');
    }, 1500);
  };

  // Função para voltar ao calendário
  const voltarAoCalendario = () => {
    setTelaAtual('calendario');
    setEventoSelecionado(null);
    setAnimaisSelecionados([]);
    setResultadoAtual(null);
  };

  // Função para obter classe CSS baseada na pontuação
  const getStatusClass = (pontuacao) => {
    if (pontuacao >= 95) return 'status-elite';
    if (pontuacao >= 90) return 'status-superior';
    if (pontuacao >= 85) return 'status-bom';
    if (pontuacao >= 80) return 'status-regular';
    return 'status-baixo';
  };

  // Função para obter ícone de destaque
  const getDestaqueIcon = (destaque) => {
    if (destaque === 'Genética de Elite') return '👑';
    if (destaque === 'Potencial Superior') return '⭐';
    return null;
  };

  // Renderizar tela de calendário
  const renderCalendario = () => (
    <div className="validacao-container">
      <div className="validacao-header">
        <h1>🏛️ Exposições e Pistas</h1>
        <p>Sistema de avaliação especializada para validação de genética e reputação no mercado</p>
      </div>

      <div className="eventos-grid">
        {mockCalendarioEventos.map((evento) => (
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
              <p className="evento-descricao">{evento.descricao}</p>
            </div>

            <div className="evento-especialista">
              <h4>Especialista Responsável</h4>
              <div className="especialista-info">
                <span className="especialista-nome">{evento.juiz}</span>
                <span className="especialidade">{evento.especialidade}</span>
              </div>
            </div>

            <div className="evento-racas">
              <h4>Raças Avaliadas:</h4>
              <div className="racas-tags">
                {evento.racas.map(raca => (
                  <span key={raca} className="raca-tag">{raca}</span>
                ))}
              </div>
            </div>

            <div className="evento-criterios">
              <h4>Critérios de Avaliação:</h4>
              <div className="criterios-lista">
                {evento.criterios.map(criterio => (
                  <span key={criterio} className="criterio-tag">{criterio}</span>
                ))}
              </div>
            </div>

            <div className="evento-acoes">
              <button className="btn-inscrever">
                Inscrever para Avaliação →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar tela de inscrição
  const renderInscricao = () => (
    <div className="validacao-container">
      <div className="validacao-header">
        <button className="btn-voltar" onClick={voltarAoCalendario}>
          ← Voltar ao Calendário
        </button>
        <h1>📋 Inscrição para Avaliação</h1>
        <p>Selecione os animais que deseja submeter à avaliação especializada</p>
      </div>

      <div className="inscricao-content">
        <div className="evento-info">
          <h3>Detalhes da Avaliação</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Evento:</strong> {eventoSelecionado.nome}
            </div>
            <div className="info-item">
              <strong>Data:</strong> {eventoSelecionado.data}
            </div>
            <div className="info-item">
              <strong>Local:</strong> {eventoSelecionado.local}
            </div>
            <div className="info-item">
              <strong>Especialista:</strong> {eventoSelecionado.juiz}
            </div>
            <div className="info-item">
              <strong>Especialidade:</strong> {eventoSelecionado.especialidade}
            </div>
            <div className="info-item">
              <strong>Critérios:</strong> {eventoSelecionado.criterios.join(', ')}
            </div>
          </div>
        </div>

        <div className="categorias-section">
          <h3>Animais Elegíveis por Categoria</h3>
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
                                  <span className="animal-id">{animal.animalId}</span>
                                  <span className="animal-detalhes">
                                    {animal.idade} • ECC: {animal.ecc} • Genética: {animal.genetica}
                                  </span>
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
            <p className="info-avaliacao">
              ℹ️ Os animais serão avaliados pelos critérios: {eventoSelecionado.criterios.join(', ')}
            </p>
          </div>
          <button 
            className="btn-confirmar"
            onClick={confirmarInscricao}
            disabled={animaisSelecionados.length === 0}
          >
            Confirmar Inscrição para Avaliação
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar tela de relatório
  const renderRelatorio = () => (
    <div className="validacao-container">
      <div className="validacao-header">
        <button className="btn-voltar" onClick={voltarAoCalendario}>
          ← Voltar ao Calendário
        </button>
        <h1>📊 Relatório de Performance Genética</h1>
        <p>Avaliação realizada por {resultadoAtual.juiz} - Especialista em {resultadoAtual.especialidade}</p>
      </div>

      <div className="relatorio-content">
        <div className="especialista-info">
          <h3>Especialista Responsável</h3>
          <div className="especialista-card">
            <div className="especialista-avatar">👨‍⚖️</div>
            <div className="especialista-detalhes">
              <h4>{resultadoAtual.juiz}</h4>
              <p>Especialista em {resultadoAtual.especialidade}</p>
              <div className="criterios-avaliacao">
                <strong>Critérios avaliados:</strong> {resultadoAtual.criterios.join(', ')}
              </div>
            </div>
          </div>
        </div>

        <div className="classificacao-section">
          <h3>Classificação de Performance</h3>
          <div className="classificacao-tabela">
            <div className="tabela-header">
              <div className="col-posicao">Pos.</div>
              <div className="col-animal">Animal</div>
              <div className="col-dono">Proprietário</div>
              <div className="col-pontuacao">Pontuação</div>
              <div className="col-status">Status</div>
              <div className="col-destaque">Destaque</div>
            </div>
            
            {resultadoAtual.classificacao.map((animal) => (
              <div key={animal.animalId} className={`tabela-row ${getStatusClass(animal.pontuacao)}`}>
                <div className="col-posicao">
                  <span className="posicao-numero">{animal.posicao}º</span>
                </div>
                <div className="col-animal">
                  <div className="animal-info-relatorio">
                    <strong>{animal.nome}</strong>
                    <span className="animal-id">{animal.animalId}</span>
                  </div>
                </div>
                <div className="col-dono">
                  <span className="dono-nome">{animal.dono}</span>
                </div>
                <div className="col-pontuacao">
                  <span className="pontuacao-valor">{animal.pontuacao.toFixed(1)}</span>
                </div>
                <div className="col-status">
                  <span className={`status-badge ${getStatusClass(animal.pontuacao)}`}>
                    {animal.status}
                  </span>
                </div>
                <div className="col-destaque">
                  {animal.destaque && (
                    <div className="destaque-badge">
                      <span className="destaque-icon">{getDestaqueIcon(animal.destaque)}</span>
                      <span className="destaque-texto">{animal.destaque}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="estatisticas-section">
          <h3>Estatísticas da Avaliação</h3>
          <div className="estatisticas-grid">
            <div className="estatistica-card">
              <h4>Total de Animais</h4>
              <span className="estatistica-valor">{resultadoAtual.classificacao.length}</span>
            </div>
            <div className="estatistica-card">
              <h4>Média Geral</h4>
              <span className="estatistica-valor">
                {(resultadoAtual.classificacao.reduce((sum, a) => sum + a.pontuacao, 0) / resultadoAtual.classificacao.length).toFixed(1)}
              </span>
            </div>
            <div className="estatistica-card">
              <h4>Elite (95+)</h4>
              <span className="estatistica-valor">
                {resultadoAtual.classificacao.filter(a => a.pontuacao >= 95).length}
              </span>
            </div>
            <div className="estatistica-card">
              <h4>Superior (90+)</h4>
              <span className="estatistica-valor">
                {resultadoAtual.classificacao.filter(a => a.pontuacao >= 90).length}
              </span>
            </div>
          </div>
        </div>

        <div className="relatorio-acoes">
          <button className="btn-nova-avaliacao" onClick={voltarAoCalendario}>
            Participar de Outra Avaliação
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar componente baseado na tela atual
  return (
    <div className="validacao-page">
      {telaAtual === 'calendario' && renderCalendario()}
      {telaAtual === 'inscricao' && renderInscricao()}
      {telaAtual === 'relatorio' && renderRelatorio()}
    </div>
  );
};

export default PistaDeValidacao; 