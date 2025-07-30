import React, { useState } from 'react';
import './FiltroMapa.css';
import { MagnifyingGlass, Funnel, X, MapPin, CurrencyDollar, Ruler } from '@phosphor-icons/react';

const BIOMAS_ICONES = {
  'Amazônia': '🌳',
  'Cerrado': '🌾',
  'Caatinga': '🌵',
  'Mata Atlântica': '🌿',
  'Pampa': '🌱',
  'Pantanal': '🦆'
};

const FiltroMapa = ({
  filtros,
  onFiltrosChange,
  fazendas,
  onBuscaChange
}) => {
  const [painelAberto, setPainelAberto] = useState(false);
  const [busca, setBusca] = useState('');

  // Obter biomas únicos das fazendas
  const biomas = Array.from(new Set(fazendas.map(f => f.bioma))).filter(Boolean);

  // Calcular ranges para os sliders
  const tamanhos = fazendas.map(f => f.tamanho_ha);
  const valores = fazendas.map(f => f.valor_total_dinamico);
  const minTamanho = Math.min(...tamanhos);
  const maxTamanho = Math.max(...tamanhos);
  const minValor = Math.min(...valores);
  const maxValor = Math.max(...valores);

  const handleBuscaChange = (e) => {
    const valor = e.target.value;
    setBusca(valor);
    onBuscaChange(valor);
  };

  const removerFiltro = (tipo, valor) => {
    const novosFiltros = { ...filtros };
    
    switch (tipo) {
      case 'bioma':
        novosFiltros.bioma = '';
        break;
      case 'tamanho':
        novosFiltros.tamanhoMin = minTamanho;
        novosFiltros.tamanhoMax = maxTamanho;
        break;
      case 'valor':
        novosFiltros.valorMin = minValor;
        novosFiltros.valorMax = maxValor;
        break;
      case 'disponiveis':
        novosFiltros.soDisponiveis = false;
        break;
      case 'minhas':
        novosFiltros.minhasFazendas = false;
        break;
    }
    
    onFiltrosChange(novosFiltros);
  };

  const formatarValor = (valor) => {
    if (valor >= 1000000) {
      return `R$ ${(valor / 1000000).toFixed(1)}M`;
    } else if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(0)}K`;
    }
    return `R$ ${valor.toLocaleString('pt-BR')}`;
  };

  const formatarTamanho = (tamanho) => {
    if (tamanho >= 1000) {
      return `${(tamanho / 1000).toFixed(1)}K ha`;
    }
    return `${tamanho} ha`;
  };

  // Contar filtros ativos
  const filtrosAtivos = [
    filtros.bioma && { tipo: 'bioma', label: `Bioma: ${filtros.bioma}`, valor: filtros.bioma },
    (filtros.tamanhoMin !== minTamanho || filtros.tamanhoMax !== maxTamanho) && {
      tipo: 'tamanho',
      label: `Tamanho: ${formatarTamanho(filtros.tamanhoMin)} - ${formatarTamanho(filtros.tamanhoMax)}`,
      valor: 'tamanho'
    },
    (filtros.valorMin !== minValor || filtros.valorMax !== maxValor) && {
      tipo: 'valor',
      label: `Valor: ${formatarValor(filtros.valorMin)} - ${formatarValor(filtros.valorMax)}`,
      valor: 'valor'
    },
    filtros.soDisponiveis && { tipo: 'disponiveis', label: 'Disponíveis', valor: 'disponiveis' },
    filtros.minhasFazendas && { tipo: 'minhas', label: 'Minhas Fazendas', valor: 'minhas' }
  ].filter(Boolean);

  return (
    <div className="filtro-mapa">
      {/* Barra Principal */}
      <div className="filtro-barra-principal">
        <div className="filtro-busca">
          <MagnifyingGlass size={20} className="icone-busca" />
          <input
            type="text"
            placeholder="Buscar fazendas por nome ou município..."
            value={busca}
            onChange={handleBuscaChange}
            className="campo-busca"
          />
        </div>

        <button
          className={`botao-filtros ${painelAberto ? 'ativo' : ''}`}
          onClick={() => setPainelAberto(!painelAberto)}
        >
          <Funnel size={18} />
          Filtros Avançados
          {filtrosAtivos.length > 0 && (
            <span className="contador-filtros">{filtrosAtivos.length}</span>
          )}
        </button>
      </div>

      {/* Pílulas de Filtros Ativos */}
      {filtrosAtivos.length > 0 && (
        <div className="filtro-pilulas">
          {filtrosAtivos.map((filtro, index) => (
            <div key={index} className="pilula-filtro">
              <span>{filtro.label}</span>
              <button
                onClick={() => removerFiltro(filtro.tipo, filtro.valor)}
                className="remover-filtro"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              onFiltrosChange({
                bioma: '',
                tamanhoMin: minTamanho,
                tamanhoMax: maxTamanho,
                valorMin: minValor,
                valorMax: maxValor,
                soDisponiveis: false,
                minhasFazendas: false
              });
            }}
            className="limpar-todos"
          >
            Limpar Todos
          </button>
        </div>
      )}

      {/* Painel de Filtros Avançados */}
      {painelAberto && (
        <div className="filtro-painel">
          <div className="painel-header">
            <h3>Filtros Avançados</h3>
            <button
              onClick={() => setPainelAberto(false)}
              className="fechar-painel"
            >
              <X size={20} />
            </button>
          </div>

          <div className="painel-conteudo">
            {/* Filtro por Tamanho */}
            <div className="filtro-secao">
              <div className="secao-header">
                <Ruler size={20} />
                <h4>Tamanho da Fazenda</h4>
              </div>
              <div className="slider-container">
                <div className="slider-labels">
                  <span>{formatarTamanho(filtros.tamanhoMin)}</span>
                  <span>{formatarTamanho(filtros.tamanhoMax)}</span>
                </div>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min={minTamanho}
                    max={maxTamanho}
                    value={filtros.tamanhoMin}
                    onChange={(e) => onFiltrosChange({
                      ...filtros,
                      tamanhoMin: parseInt(e.target.value)
                    })}
                    className="slider slider-min"
                  />
                  <input
                    type="range"
                    min={minTamanho}
                    max={maxTamanho}
                    value={filtros.tamanhoMax}
                    onChange={(e) => onFiltrosChange({
                      ...filtros,
                      tamanhoMax: parseInt(e.target.value)
                    })}
                    className="slider slider-max"
                  />
                </div>
              </div>
            </div>

            {/* Filtro por Valor */}
            <div className="filtro-secao">
                             <div className="secao-header">
                 <CurrencyDollar size={20} />
                 <h4>Valor da Fazenda</h4>
               </div>
              <div className="slider-container">
                <div className="slider-labels">
                  <span>{formatarValor(filtros.valorMin)}</span>
                  <span>{formatarValor(filtros.valorMax)}</span>
                </div>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min={minValor}
                    max={maxValor}
                    value={filtros.valorMin}
                    onChange={(e) => onFiltrosChange({
                      ...filtros,
                      valorMin: parseInt(e.target.value)
                    })}
                    className="slider slider-min"
                  />
                  <input
                    type="range"
                    min={minValor}
                    max={maxValor}
                    value={filtros.valorMax}
                    onChange={(e) => onFiltrosChange({
                      ...filtros,
                      valorMax: parseInt(e.target.value)
                    })}
                    className="slider slider-max"
                  />
                </div>
              </div>
            </div>

            {/* Filtro por Bioma */}
            <div className="filtro-secao">
              <div className="secao-header">
                <MapPin size={20} />
                <h4>Bioma</h4>
              </div>
              <div className="biomas-grid">
                <button
                  className={`bioma-botao ${!filtros.bioma ? 'ativo' : ''}`}
                  onClick={() => onFiltrosChange({ ...filtros, bioma: '' })}
                >
                  🌍 Todos
                </button>
                {biomas.map(bioma => (
                  <button
                    key={bioma}
                    className={`bioma-botao ${filtros.bioma === bioma ? 'ativo' : ''}`}
                    onClick={() => onFiltrosChange({ ...filtros, bioma })}
                  >
                    {BIOMAS_ICONES[bioma] || '🌍'} {bioma}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros de Status */}
            <div className="filtro-secao">
              <div className="secao-header">
                <Funnel size={20} />
                <h4>Status</h4>
              </div>
              <div className="status-toggles">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={filtros.soDisponiveis}
                    onChange={(e) => onFiltrosChange({
                      ...filtros,
                      soDisponiveis: e.target.checked
                    })}
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">Disponíveis para compra</span>
                </label>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={filtros.minhasFazendas}
                    onChange={(e) => onFiltrosChange({
                      ...filtros,
                      minhasFazendas: e.target.checked
                    })}
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">Minhas Fazendas</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltroMapa; 