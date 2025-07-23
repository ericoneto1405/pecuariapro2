// Card de instituição financeira
import React from 'react';

function InstituicaoFinanceiraCard({ nome, tipo, linhasCredito, taxas, vantagens, requisitos, logo, onSolicitarEmprestimo }) {
  return (
    <div
      style={{ background: '#23272f', borderRadius: 12, boxShadow: '0 2px 8px #0002', padding: 24, minWidth: 320, maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, cursor: 'pointer', border: '2px solid transparent', transition: 'border 0.2s' }}
      onClick={() => onSolicitarEmprestimo && onSolicitarEmprestimo({ nome, tipo, linhasCredito, taxas, vantagens, requisitos, logo })}
      onMouseOver={e => e.currentTarget.style.border = '#90caf9 2px solid'}
      onMouseOut={e => e.currentTarget.style.border = '2px solid transparent'}
      title="Clique para solicitar empréstimo"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        {logo && <img src={logo} alt={nome} style={{ width: 40, height: 40, borderRadius: 8, background: '#fff' }} />}
        <div>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#90caf9' }}>{nome}</div>
          <div style={{ fontSize: 13, color: '#b0bec5', fontWeight: 500 }}>{tipo}</div>
        </div>
      </div>
      <div style={{ fontSize: 14, color: '#b0bec5', marginBottom: 4 }}><b>Linhas de Crédito:</b> {linhasCredito.join(', ')}</div>
      <div style={{ fontSize: 14, color: '#b0bec5', marginBottom: 4 }}><b>Taxas:</b> {taxas}</div>
      <div style={{ fontSize: 14, color: '#b0bec5', marginBottom: 4 }}><b>Vantagens:</b> {vantagens}</div>
      <div style={{ fontSize: 13, color: '#b0bec5' }}><b>Requisitos:</b> {requisitos}</div>
    </div>
  );
}

export default InstituicaoFinanceiraCard;
