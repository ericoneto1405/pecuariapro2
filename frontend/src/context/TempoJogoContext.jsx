import React, { createContext, useEffect, useRef } from 'react';
import useGameTimeStore from '../state/useGameTimeStore';

const INTERVAL_NORMAL = 6670; // 6,67 segundos reais por dia do jogo
const INTERVAL_RAPIDA = 3330;  // 3,33 segundos reais por dia do jogo
const SEGUNDOS_POR_DIA = 86400;

const TempoJogoContext = createContext();

export function TempoJogoProvider({ children }) {
  const timerRef = useRef(null);
  const mountedRef = useRef(true);
  const velocidade = useGameTimeStore((state) => state.velocidade);
  const advanceTime = useGameTimeStore((state) => state.advanceTime);

  useEffect(() => {
    mountedRef.current = true;
    clearInterval(timerRef.current);

    if (velocidade === 'pausa') {
      return () => { mountedRef.current = false; };
    }


    // Calcula quantos segundos de jogo devem passar a cada tick
    const interval = velocidade === 'rapida' ? INTERVAL_RAPIDA : INTERVAL_NORMAL;
    // Proporção: INTERVAL_NORMAL (6,67s) = 1 dia de jogo (86400s)
    // Então, a cada tick, avança:
    const segundosPorTick = Math.round(SEGUNDOS_POR_DIA * (interval / 1000) / INTERVAL_NORMAL);

    // Avança o tempo imediatamente ao mudar para normal/rápida
    advanceTime(segundosPorTick);

    timerRef.current = setInterval(() => {
      if (mountedRef.current) {
        advanceTime(segundosPorTick);
      }
    }, interval);

    return () => {
      clearInterval(timerRef.current);
      mountedRef.current = false;
    };
  }, [velocidade, advanceTime]);

  return <>{children}</>;
}

export function useTempoJogo() {
    return useGameTimeStore();
}
