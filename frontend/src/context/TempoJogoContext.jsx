import { createContext, useEffect, useRef } from 'react';
import useGameTimeStore from '../state/useGameTimeStore';

const INTERVAL_NORMAL = 10000; // 10s
const INTERVAL_RAPIDA = 5000;  // 5s

const TempoJogoContext = createContext();

export function TempoJogoProvider({ children }) {
  const timerRef = useRef(null);
  const velocidade = useGameTimeStore((state) => state.velocidade);
  const advanceTime = useGameTimeStore((state) => state.advanceTime);

  useEffect(() => {
    clearInterval(timerRef.current);

    if (velocidade === 'pausa') {
      return;
    }

    const interval = velocidade === 'rapida' ? INTERVAL_RAPIDA : INTERVAL_NORMAL;
    
    timerRef.current = setInterval(() => {
      advanceTime(1);
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [velocidade, advanceTime]);

  return <>{children}</>;
}

export function useTempoJogo() {
    return useGameTimeStore();
}
