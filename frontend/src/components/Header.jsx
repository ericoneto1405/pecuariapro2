import React from 'react';
import './Header.css';
import { useTempoJogo } from '../context/TempoJogoContext';

const speedOptions = [
  { label: 'PAUSA', value: 'pausa' },
  { label: 'NORMAL', value: 'normal' },
  { label: 'RÁPIDA', value: 'rapida' },
];

export default function Header() {
  const { dataAtualJogo, velocidade, pausar, normal, rapida } = useTempoJogo();

  function handleSpeed(value) {
    if (value === 'pausa') pausar();
    else if (value === 'normal') normal();
    else if (value === 'rapida') rapida();
  }

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">PECUÁRIA PRO</span>
      </div>
      <div className="header-center">
        <span className="header-date">
          {dataAtualJogo instanceof Date && !isNaN(dataAtualJogo)
            ? dataAtualJogo.toLocaleDateString('pt-BR')
            : '--/--/----'}
        </span>
        <span className="header-clock">
          {dataAtualJogo instanceof Date && !isNaN(dataAtualJogo)
            ? dataAtualJogo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            : '--:--:--'}
        </span>
      </div>
      <div className="header-right">
        <div className="speed-controls">
          {speedOptions.map(opt => (
            <button
              key={opt.value}
              className={`speed-btn${velocidade === opt.value ? ' active' : ''}`}
              onClick={() => handleSpeed(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
} 