// Card de loja de agropecuária
import React from 'react';

function LojaAgropecuariaCard({ nome, descricao, onClick, logo }) {
  return (
    <div style={{ background: '#23272f', borderRadius: 12, boxShadow: '0 2px 8px #0002', padding: 24, minWidth: 260, maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        {logo && <img src={logo} alt={nome} style={{ width: 40, height: 40, borderRadius: 8, background: '#fff' }} />}
        <div>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#90caf9' }}>{nome}</div>
        </div>
      </div>
      <div style={{ fontSize: 14, color: '#b0bec5' }}>{descricao}</div>
    </div>
  );
}

export default LojaAgropecuariaCard;
