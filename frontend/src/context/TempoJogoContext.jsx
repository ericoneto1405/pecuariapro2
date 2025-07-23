import { createContext, useContext, useState, useEffect, useRef } from 'react';

const PROPORCAO_NORMAL = 400 / 30; // minutos de jogo por minuto real ≈ 13.33
const PROPORCAO_RAPIDA = PROPORCAO_NORMAL * 2; // ≈ 26.66

const TempoJogoContext = createContext();

export function TempoJogoProvider({ children }) {
  const [dataAtualJogo, setDataAtualJogo] = useState(new Date('2025-07-22T12:00:00'));
  const [velocidade, setVelocidade] = useState('normal'); // 'pausa', 'normal', 'rapida'
  const timerRef = useRef(null);

  useEffect(() => {
    if (velocidade === 'pausa') {
      clearInterval(timerRef.current);
      return;
    }
    const proporcao = velocidade === 'rapida' ? PROPORCAO_RAPIDA : PROPORCAO_NORMAL;
    timerRef.current = setInterval(() => {
      setDataAtualJogo(prev => {
        const minutosJogo = proporcao / 60; // a cada 1s real, avança X minutos de jogo
        return new Date(prev.getTime() + minutosJogo * 60 * 1000);
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [velocidade]);

  function pausar() { setVelocidade('pausa'); }
  function normal() { setVelocidade('normal'); }
  function rapida() { setVelocidade('rapida'); }

  return (
    <TempoJogoContext.Provider value={{ dataAtualJogo, velocidade, pausar, normal, rapida }}>
      {children}
    </TempoJogoContext.Provider>
  );
}

export function useTempoJogo() {
  return useContext(TempoJogoContext);
} 