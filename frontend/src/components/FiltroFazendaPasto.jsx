// Filtro de fazenda e pasto para Meus Rebanhos
import React from 'react';

function FiltroFazendaPasto({ fazendas, pastos, fazendaSelecionada, pastoSelecionado, onFazendaChange, onPastoChange }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
      <div>
        <label>Fazenda: </label>
        <select value={fazendaSelecionada} onChange={e => onFazendaChange(e.target.value)}>
          <option value="">Todas</option>
          {fazendas.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>
      </div>
      {pastos && pastos.length > 0 && (
        <div>
          <label>Pasto: </label>
          <select value={pastoSelecionado} onChange={e => onPastoChange(e.target.value)}>
            <option value="">Todos</option>
            {pastos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

export default FiltroFazendaPasto;
