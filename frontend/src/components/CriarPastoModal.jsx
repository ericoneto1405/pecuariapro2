import React, { useState, useEffect } from 'react';
import { criarPasto, calcularCustoPasto, obterInventarioInsumos, verificarInsumosSuficientes, formatarCustoInsumos } from '../api/pastosService';
import { X, Plus, Calculator, Package } from '@phosphor-icons/react';
import './CriarPastoModal.css';

const TIPOS_PASTO = [
  { value: 'maternidade', label: 'Maternidade', descricao: 'Para fêmeas prenhas e bezerros' },
  { value: 'recria', label: 'Recria', descricao: 'Para animais em crescimento' },
  { value: 'engorda', label: 'Engorda', descricao: 'Para animais em terminação' },
  { value: 'touros', label: 'Touros', descricao: 'Para reprodutores' },
  { value: 'geral', label: 'Geral', descricao: 'Para uso múltiplo' }
];

function CriarPastoModal({ aberta, fazenda, npcId, onFechar, onPastoCriado }) {
  const [nome, setNome] = useState('');
  const [areaHa, setAreaHa] = useState('');
  const [tipo, setTipo] = useState('geral');
  const [custoCalculado, setCustoCalculado] = useState(null);
  const [inventario, setInventario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carregar inventário quando o modal abrir
  useEffect(() => {
    if (aberta && npcId) {
      carregarInventario();
    }
  }, [aberta, npcId]);

  // Calcular custo quando área ou tipo mudar
  useEffect(() => {
    if (areaHa && tipo) {
      calcularCusto();
    }
  }, [areaHa, tipo]);

  const carregarInventario = async () => {
    try {
      const data = await obterInventarioInsumos(npcId);
      setInventario(data.inventario);
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
    }
  };

  const calcularCusto = async () => {
    try {
      const data = await calcularCustoPasto(parseFloat(areaHa), tipo);
      setCustoCalculado(data);
    } catch (error) {
      console.error('Erro ao calcular custo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome.trim() || !areaHa || parseFloat(areaHa) <= 0) {
      setError('Preencha todos os campos corretamente');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const resultado = await criarPasto(npcId, fazenda.assetId, nome, parseFloat(areaHa), tipo);
      
      // Limpar formulário
      setNome('');
      setAreaHa('');
      setTipo('geral');
      setCustoCalculado(null);
      
      // Fechar modal e notificar
      onPastoCriado(resultado.pasto);
      onFechar();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verificarDisponibilidade = () => {
    if (!custoCalculado || !inventario) return null;
    
    return verificarInsumosSuficientes(inventario, custoCalculado.custo_insumos);
  };

  const disponibilidade = verificarDisponibilidade();

  if (!aberta) return null;

  return (
    <div className="criar-pasto-modal-overlay">
      <div className="criar-pasto-modal">
        <div className="modal-header">
          <h2>🆕 Criar Novo Pasto</h2>
          <button onClick={onFechar} className="btn-fechar">
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="fazenda-info">
            <h3>🏡 {fazenda.name}</h3>
            <p>Tamanho: {fazenda.size_hectares} ha</p>
            <p>Pastos atuais: {fazenda.pastos?.length || 0}</p>
          </div>

          <form onSubmit={handleSubmit} className="form-criar-pasto">
            <div className="form-group">
              <label htmlFor="nome">Nome do Pasto</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Pasto Maternidade"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">Área (hectares)</label>
              <input
                type="number"
                id="area"
                value={areaHa}
                onChange={(e) => setAreaHa(e.target.value)}
                placeholder="Ex: 50"
                min="1"
                max={fazenda.size_hectares}
                step="0.1"
                required
              />
              <small>Máximo: {fazenda.size_hectares} ha</small>
            </div>

            <div className="form-group">
              <label htmlFor="tipo">Tipo de Pasto</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                {TIPOS_PASTO.map(tipoPasto => (
                  <option key={tipoPasto.value} value={tipoPasto.value}>
                    {tipoPasto.label} - {tipoPasto.descricao}
                  </option>
                ))}
              </select>
            </div>

            {custoCalculado && (
              <div className="custo-section">
                <h4><Calculator size={20} /> Custo em Insumos</h4>
                <div className="custo-detalhes">
                  <p><strong>Capacidade estimada:</strong> {custoCalculado.capacidade_ua_estimada} UA</p>
                  <p><strong>Insumos necessários:</strong></p>
                  <ul className="lista-insumos">
                    {Object.entries(custoCalculado.custo_insumos).map(([insumo, quantidade]) => {
                      const itemInventario = inventario?.[insumo];
                      const temSuficiente = itemInventario && itemInventario.quantidade >= quantidade;
                      
                      return (
                        <li key={insumo} className={temSuficiente ? 'suficiente' : 'insuficiente'}>
                          <span className="nome-insumo">{itemInventario?.nome || insumo}:</span>
                          <span className="quantidade">
                            {quantidade} {itemInventario?.unidade || 'un'}
                            {itemInventario && (
                              <span className="status">
                                (tem {itemInventario.quantidade} {temSuficiente ? '✅' : '❌'})
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {disponibilidade && !disponibilidade.temSuficiente && (
              <div className="aviso-insumos">
                <h4><Package size={20} /> Insumos Insuficientes</h4>
                {disponibilidade.faltantes.length > 0 && (
                  <p><strong>Faltando:</strong> {disponibilidade.faltantes.join(', ')}</p>
                )}
                {disponibilidade.insuficientes.length > 0 && (
                  <div>
                    <p><strong>Quantidade insuficiente:</strong></p>
                    <ul>
                      {disponibilidade.insuficientes.map(item => (
                        <li key={item.insumo}>
                          {item.nome}: tem {item.tem}, precisa {item.precisa}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                onClick={onFechar}
                className="btn-secundario"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primario"
                disabled={loading || (disponibilidade && !disponibilidade.temSuficiente)}
              >
                {loading ? 'Criando...' : (
                  <>
                    <Plus size={20} />
                    Criar Pasto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CriarPastoModal; 