import React, { useEffect, useState } from 'react';
import { getRelacionamentoFrigorifico } from '../api/frigorificoRelacionamentoService';

export default function BarraRelacionamentoFrigorifico({ frigorificoId, horizontal }) {
  const [valor, setValor] = useState(0);
  useEffect(() => {
    if (frigorificoId) {
      getRelacionamentoFrigorifico(frigorificoId).then(data => {
        setValor(data.relacionamento || 0);
      });
    }
  }, [frigorificoId]);

  let cor = '#b0bec5';
  if (valor >= 80) cor = '#00e676';
  else if (valor >= 50) cor = '#1976d2';
  else if (valor >= 30) cor = '#e6c200';
  else cor = '#e53935';

  if (horizontal) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 140 }}>
        <div style={{ fontSize: 13, color: '#b0bec5', marginBottom: 2, textAlign: 'right' }}>Relacionamento</div>
        <div style={{ background: '#23272f', borderRadius: 8, height: 18, width: 120, position: 'relative', overflow: 'hidden', margin: 0 }}>
          <div style={{ background: cor, width: `${valor}%`, height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', color: '#fff', fontWeight: 600, fontSize: 13, textAlign: 'center', lineHeight: '18px', pointerEvents: 'none' }}>{valor}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: '8px 0' }}>
      <div style={{ fontSize: 13, color: '#b0bec5', marginBottom: 2 }}>Relacionamento</div>
      <div style={{ background: '#23272f', borderRadius: 8, height: 18, width: 120, position: 'relative', overflow: 'hidden' }}>
        <div style={{ background: cor, width: `${valor}%`, height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', color: '#fff', fontWeight: 600, fontSize: 13, textAlign: 'center', lineHeight: '18px', pointerEvents: 'none' }}>{valor}</div>
      </div>
    </div>
  );
}
