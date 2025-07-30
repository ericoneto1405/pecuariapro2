import React, { useEffect, useState } from 'react';
import './Header.css';
import { useTempoJogo } from '../context/TempoJogoContext';

const velocidadeOptions = [
  { label: 'PAUSA', value: 'pausa' },
  { label: 'NORMAL', value: 'normal' },
  { label: 'RÁPIDA', value: 'rapida' },
];

export default function Header() {
  const { dataAtualJogo, velocidade, setVelocidade, pausar } = useTempoJogo();
  const [relogioAnimado, setRelogioAnimado] = useState(dataAtualJogo);
  const relogioRef = React.useRef(dataAtualJogo);

  // Parâmetros de proporção
  const INTERVAL_NORMAL = 6670; // ms
  const INTERVAL_RAPIDA = 3330; // ms
  const SEGUNDOS_POR_DIA = 86400;

  // Atualiza o relógio animado localmente entre os ticks do backend
  useEffect(() => {
    // Só sincroniza se o backend estiver à frente do relógio animado local
    if (
      dataAtualJogo instanceof Date &&
      (!relogioAnimado || dataAtualJogo.getTime() > relogioAnimado.getTime())
    ) {
      relogioRef.current = dataAtualJogo;
      setRelogioAnimado(dataAtualJogo);
    }
    // Nunca volta o relógio para trás
    // eslint-disable-next-line
  }, [dataAtualJogo]);

  // Animação suave do relógio (cronômetro)
  useEffect(() => {
    if (velocidade === 'pausa') return;
    let frameId = null;
    let lastUpdate = performance.now();
    // Proporção correta: 1 dia do jogo (86400s) a cada 6,67s reais
    let segundosPorSegundoReal = 0;
    if (velocidade === 'normal') {
      segundosPorSegundoReal = SEGUNDOS_POR_DIA / (INTERVAL_NORMAL / 1000);
    } else if (velocidade === 'rapida') {
      segundosPorSegundoReal = SEGUNDOS_POR_DIA / (INTERVAL_RAPIDA / 1000);
    }
    const animate = () => {
      const now = performance.now();
      const diffReal = (now - lastUpdate) / 1000;
      lastUpdate = now;
      if (diffReal > 0) {
        setRelogioAnimado((prev) => {
          // Nunca volta no tempo
          const novo = new Date(Math.max(prev.getTime(), prev.getTime() + diffReal * segundosPorSegundoReal * 1000));
          return novo;
        });
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [velocidade, dataAtualJogo]);

  const horaJogo = relogioAnimado instanceof Date && !isNaN(relogioAnimado)
    ? relogioAnimado.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  function handleSpeed(value) {
    if (value === 'pausa') pausar();
    else setVelocidade(value);
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>PECUÁRIA PRO 2</h1>
        </div>
        <div className="header-center">
          <span className="game-date">{relogioAnimado instanceof Date && !isNaN(relogioAnimado) ? relogioAnimado.toLocaleDateString('pt-BR') : '--/--/----'}</span>
          <span className="header-clock">{horaJogo}</span>
        </div>
        <div className="speed-controls">
          {velocidadeOptions.map((opt) => (
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