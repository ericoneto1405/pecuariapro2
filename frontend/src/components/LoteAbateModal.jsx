import React, { useState, useEffect } from 'react';
import { criarLoteAbate } from '../api/lotesService';
import { listarFrigorificos } from '../api/frigorificosService';

function LoteAbateModal({ isOpen, onClose, animaisSelecionados, onSuccess }) {
  const [frigorificos, setFrigorificos] = useState([]);
  const [frigorificoSelecionado, setFrigorificoSelecionado] = useState('');
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
    if (!frigorificoSelecionado) {
      alert('Selecione um frigorífico');
      return;
    }

    setLoading(true);
    try {
      await criarLoteAbate(animaisSelecionados, frigorificoSelecionado);
      onSuccess('Lote de abate criado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao criar lote de abate:', error);
      alert('Erro ao criar lote de abate');
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
        <h2 style={{ color: '#fff', marginBottom: 20 }}>Criar Lote de Abate</h2>
        
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: '#90caf9' }}>
            {animaisSelecionados.length} animal{animaisSelecionados.length > 1 ? 'is' : ''} selecionado{animaisSelecionados.length > 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ 
          background: '#ef4444', 
          color: '#fff', 
          padding: 12, 
          borderRadius: 6, 
          marginBottom: 20,
          fontSize: 14
        }}>
          ⚠️ Atenção: Esta ação enviará os animais selecionados para abate no frigorífico escolhido.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
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
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Criando...' : 'Criar Lote de Abate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoteAbateModal; 