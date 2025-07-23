import React, { useState, useMemo } from 'react';
import KPIsRebanho from '../components/KPIsRebanho';
import FiltroFazendaPasto from '../components/FiltroFazendaPasto';
import TabelaAnimais from '../components/TabelaAnimais';

// MOCKS INICIAIS
const MOCK_FAZENDAS = [
  { id: 'faz1', nome: 'Fazenda Santa Rita', pastos: [ { id: 'p1', nome: 'Pasto 1' }, { id: 'p2', nome: 'Pasto 2' } ] },
  { id: 'faz2', nome: 'Fazenda Boa Vista', pastos: [] },
];
import { validaCategoriaBovino, sugereCategoriaBovino } from '../utils/validacaoCategoriaBovino';

// Exemplo de animais mockados com dados completos para validação
const MOCK_ANIMAIS = [
  {
    id: 'ABCD0001',
    raca: 'Nelore',
    sexo: 'M',
    idadeMeses: 6,
    categoria: 'Bezerro',
    castrado: false,
    pariu: false,
    prenha: false,
    qtdPartos: 0,
    localizacao: 'Fazenda Santa Rita / Pasto 1'
  },
  {
    id: 'EFGH0002',
    raca: 'Angus',
    sexo: 'F',
    idadeMeses: 16,
    categoria: 'Novilha',
    castrado: false,
    pariu: false,
    prenha: true,
    qtdPartos: 0,
    localizacao: 'Fazenda Santa Rita / Pasto 2'
  },
  {
    id: 'IJKL0003',
    raca: 'Nelore',
    sexo: 'M',
    idadeMeses: 36,
    categoria: 'Touro',
    castrado: false,
    pariu: false,
    prenha: false,
    qtdPartos: 0,
    localizacao: 'Fazenda Boa Vista'
  },
  {
    id: 'MNOP0004',
    raca: 'Nelore',
    sexo: 'M',
    idadeMeses: 40,
    categoria: 'Boi',
    castrado: true,
    pariu: false,
    prenha: false,
    qtdPartos: 0,
    localizacao: 'Fazenda Boa Vista'
  },
  {
    id: 'QRST0005',
    raca: 'Angus',
    sexo: 'F',
    idadeMeses: 50,
    categoria: 'Vaca',
    castrado: false,
    pariu: true,
    prenha: false,
    qtdPartos: 3,
    localizacao: 'Fazenda Santa Rita / Pasto 2'
  },
];

function MeusRebanhos() {
  const [fazendaSelecionada, setFazendaSelecionada] = useState('');
  const [pastoSelecionado, setPastoSelecionado] = useState('');
  const [selecionados, setSelecionados] = useState([]);
  const [animais, setAnimais] = useState(MOCK_ANIMAIS);

  // Filtragem de animais conforme fazenda/pasto
  const animaisFiltrados = useMemo(() => {
    let filtrados = animais;
    if (fazendaSelecionada) {
      filtrados = filtrados.filter(a => a.localizacao.includes(MOCK_FAZENDAS.find(f => f.id === fazendaSelecionada).nome));
    }
    if (pastoSelecionado) {
      filtrados = filtrados.filter(a => a.localizacao.includes(MOCK_FAZENDAS.find(f => f.id === fazendaSelecionada).pastos.find(p => p.id === pastoSelecionado).nome));
    }
    return filtrados;
  }, [fazendaSelecionada, pastoSelecionado, animais]);

  // KPIs
  const totalAnimais = animaisFiltrados.length;
  const totaisPorCategoria = useMemo(() => {
    const cat = {};
    animaisFiltrados.forEach(a => { cat[a.categoria] = (cat[a.categoria] || 0) + 1; });
    return cat;
  }, [animaisFiltrados]);

  // Pastos disponíveis para filtro
  const pastos = useMemo(() => {
    if (!fazendaSelecionada) return [];
    const faz = MOCK_FAZENDAS.find(f => f.id === fazendaSelecionada);
    return faz && faz.pastos ? faz.pastos : [];
  }, [fazendaSelecionada]);

  // Seleção de animais
  const onSelecionar = (id, checked) => {
    setSelecionados(sel => checked ? [...sel, id] : sel.filter(s => s !== id));
  };
  const onSelecionarTodos = (checked) => {
    setSelecionados(checked ? animaisFiltrados.map(a => a.id) : []);
  };

  // Atualiza categoria do animal editado
  const onCategoriaChange = (id, novaCategoria) => {
    setAnimais(animaisAntigos => animaisAntigos.map(a =>
      a.id === id ? { ...a, categoria: novaCategoria } : a
    ));
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Meus Rebanhos</h2>
      <FiltroFazendaPasto
        fazendas={MOCK_FAZENDAS}
        pastos={pastos}
        fazendaSelecionada={fazendaSelecionada}
        pastoSelecionado={pastoSelecionado}
        onFazendaChange={setFazendaSelecionada}
        onPastoChange={setPastoSelecionado}
      />
      <KPIsRebanho totalAnimais={totalAnimais} totaisPorCategoria={totaisPorCategoria} />
      <TabelaAnimais
        animais={animaisFiltrados.map(animal => ({
          ...animal,
          categoriaValida: validaCategoriaBovino(animal),
          categoriaSugerida: sugereCategoriaBovino(animal)
        }))}
        selecionados={selecionados}
        onSelecionar={onSelecionar}
        onSelecionarTodos={onSelecionarTodos}
        onCategoriaChange={onCategoriaChange}
      />
    </div>
  );
}

export default MeusRebanhos;