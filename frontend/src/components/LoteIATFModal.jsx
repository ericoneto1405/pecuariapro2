import React, { useState, useEffect } from 'react';
import { criarLoteIATF } from '../api/lotesService';
import { getCatalogoSemen } from '../api/reproductiveService';

function LoteIATFModal({ isOpen, onClose, animaisSelecionados, onSuccess }) {
  const [catalogoSemen, setCatalogoSemen] = useState([]);
  const [touroSelecionado, setTouroSelecionado] = useState('');
  const [protocolo, setProtocolo] = useState('protocolo_7_dias');
  const [semenSexado, setSemenSexado] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarCatalogoSemen();
    }
  }, [isOpen]);

  const carregarCatalogoSemen = async () => {
    try {
      const catalogo = await getCatalogoSemen();
      setCatalogoSemen(catalogo);
      if (catalogo.length > 0) {
        setTouroSelecionado(catalogo[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar catálogo de sêmen:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!touroSelecionado) {
      alert('Selecione um touro');
      return;
    }

    setLoading(true);
    try {
      const configuracao = {
        touro_id: touroSelecionado,
        protocolo,
        semen_sexado: semenSexado
      };

      await criarLoteIATF(animaisSelecionados, configuracao);
      onSuccess('Lote de IATF criado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao criar lote IATF:', error);
      alert('Erro ao criar lote de IATF');
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
        <h2 style={{ color: '#fff', marginBottom: 20 }}>Criar Lote de IATF</h2>
        
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: '#90caf9' }}>
            {animaisSelecionados.length} animal{animaisSelecionados.length > 1 ? 'is' : ''} selecionado{animaisSelecionados.length > 1 ? 's' : ''}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: 8 }}>
              Touro:
            </label>
            <select
              value={touroSelecionado}
              onChange={(e) => setTouroSelecionado(e.target.value)}
              style={{
                width: '100%',
                background: '#181a1f',
                color: '#fff',
                border: '1px solid #313640',
                borderRadius: 6,
                padding: '8px 12px'
              }}
            >
              <option value="">Selecione um touro</option>
              {catalogoSemen.map(touro => (
                <option key={touro.id} value={touro.id}>
                  {touro.nome} - {touro.raca} (R$ {touro.precoDose})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: 8 }}>
              Protocolo:
            </label>
            <select
              value={protocolo}
              onChange={(e) => setProtocolo(e.target.value)}
              style={{
                width: '100%',
                background: '#181a1f',
                color: '#fff',
                border: '1px solid #313640',
                borderRadius: 6,
                padding: '8px 12px'
              }}
            >
              <option value="protocolo_7_dias">Protocolo 7 dias</option>
              <option value="protocolo_9_dias">Protocolo 9 dias</option>
              <option value="protocolo_11_dias">Protocolo 11 dias</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={semenSexado}
                onChange={(e) => setSemenSexado(e.target.checked)}
                style={{ margin: 0 }}
              />
              Sêmen sexado
            </label>
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
                background: '#4ade80',
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

export default LoteIATFModal; 