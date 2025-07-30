import React, { useState, useEffect } from 'react';
import { criarLoteVenda } from '../api/lotesService';
import { listarFrigorificos } from '../api/frigorificosService';

function LoteVendaModal({ isOpen, onClose, animaisSelecionados, onSuccess }) {
  const [frigorificos, setFrigorificos] = useState([]);
  const [frigorificoSelecionado, setFrigorificoSelecionado] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarFrigorificos();
    }
  }, [isOpen]);

  const carregarFrigorificos = async () => {
    try {
      const frigorificosData = await listarFrigorificos();
      setFrigorificos(frigorificosData);
      if (frigorificosData.length > 0) {
        setFrigorificoSelecionado(frigorificosData[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar frigoríficos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!frigorificoSelecionado || !precoUnitario) {
      alert('Preencha todos os campos');
      return;
    }

    const preco = parseFloat(precoUnitario);
    if (isNaN(preco) || preco <= 0) {
      alert('Preço deve ser um valor válido');
      return;
    }

    setLoading(true);
    try {
      await criarLoteVenda(animaisSelecionados, preco, frigorificoSelecionado);
      onSuccess('Lote de venda criado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao criar lote de venda:', error);
      alert('Erro ao criar lote de venda');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#1e1e2e',
        borderRadius: 12,
        padding: 24,
        width: '90%',
        maxWidth: 500,
        border: '1px solid #313640'
      }}>
        <h2 style={{ color: '#fff', marginBottom: 20 }}>Criar Lote de Venda</h2>
        
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: '#90caf9' }}>
            {animaisSelecionados.length} animal{animaisSelecionados.length > 1 ? 'is' : ''} selecionado{animaisSelecionados.length > 1 ? 's' : ''}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: 8 }}>
              Frigorífico:
            </label>
            <select
              value={frigorificoSelecionado}
              onChange={(e) => setFrigorificoSelecionado(e.target.value)}
              style={{
                width: '100%',
                background: '#181a1f',
                color: '#fff',
                border: '1px solid #313640',
                borderRadius: 6,
                padding: '8px 12px'
              }}
            >
              <option value="">Selecione um frigorífico</option>
              {frigorificos.map(frigorifico => (
                <option key={frigorifico.id} value={frigorifico.id}>
                  {frigorifico.nome} - {frigorifico.cidade}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: 8 }}>
              Preço por animal (R$):
            </label>
            <input
              type="number"
              value={precoUnitario}
              onChange={(e) => setPrecoUnitario(e.target.value)}
              placeholder="0.00"
              step="0.01"
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

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#374151',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#eab308',
                color: '#23272f',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Criando...' : 'Criar Lote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoteVendaModal; 