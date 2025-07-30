import { useEffect } from "react";
import useGameTimeStore from "./useGameTimeStore";
import useArrobaModalStore from "./useArrobaModalStore";


// Função utilitária para obter a BASE_DATE de forma flexível
function getBaseDate() {
  // 1. Tenta pegar de variável de ambiente (process.env)
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_BASE_DATE) {
    return new Date(process.env.REACT_APP_BASE_DATE);
  }
  // 2. Tenta pegar do localStorage (permite ajuste sem rebuild)
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('BASE_DATE');
    if (stored) return new Date(stored);
  }
  // 3. Valor padrão (retrocompatível)
  // Valor padrão: 14/05/2025 05:00
  return new Date('2025-05-14T05:00:00');
}

export default function useArrobaModalTrigger() {
  const dataAtualJogo = useGameTimeStore((state) => state.dataAtualJogo);
  const { showModal, setShowModal } = useArrobaModalStore();

  useEffect(() => {
    if (!dataAtualJogo) return;
    const baseDate = getBaseDate();
    const diffMs = dataAtualJogo.getTime() - baseDate.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDias > 0 && diffDias % 15 === 0 && !showModal) {
      setShowModal(true);
    }
  }, [dataAtualJogo, showModal, setShowModal]);
}
