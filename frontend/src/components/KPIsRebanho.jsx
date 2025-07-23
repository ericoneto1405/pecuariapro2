// KPIs do módulo Meus Rebanhos
import React from 'react';

function KPIsRebanho({ totalAnimais, totaisPorCategoria }) {
  return (
    <div style={{ display: 'flex', gap: 32, marginBottom: 32, alignItems: 'center' }}>
      <div style={{ background: '#23272f', borderRadius: 12, padding: '18px 32px', minWidth: 140, boxShadow: '0 2px 8px #0002', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600, marginBottom: 4, letterSpacing: 0.5, textAlign: 'center' }}>Total de Animais</span>
        <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1, textAlign: 'center' }}>{totalAnimais}</span>
      </div>
      {Object.entries(totaisPorCategoria).map(([cat, val]) => (
        <div key={cat} style={{ background: '#23272f', borderRadius: 12, padding: '18px 32px', minWidth: 140, boxShadow: '0 2px 8px #0002', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#b0bec5', fontSize: 13, fontWeight: 600, marginBottom: 4, letterSpacing: 0.5, textAlign: 'center' }}>{cat}</span>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1, textAlign: 'center' }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

export default KPIsRebanho;
