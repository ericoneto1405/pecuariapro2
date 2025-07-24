import { create } from 'zustand';
import { advanceGameTime, getGameTime } from '../api/timeService';

const BASE_DATE = new Date('2025-07-22T12:00:00');

const useGameTimeStore = create((set, get) => ({
  dataAtualJogo: new Date(BASE_DATE),
  velocidade: 'pausa',
  loading: false,
  error: null,

  fetchInitialTime: async () => {
    set({ loading: true });
    try {
      const data = await getGameTime();
      const novaData = new Date(BASE_DATE.getTime() + (data.day * 24 * 60 * 60 * 1000));
      set({ dataAtualJogo: novaData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  advanceTime: async (days = 1) => {
    set({ loading: true, error: null });
    try {
      const data = await advanceGameTime(days);
      const novaData = new Date(BASE_DATE.getTime() + (data.game_time.day * 24 * 60 * 60 * 1000));
      set({ dataAtualJogo: novaData, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  setVelocidade: (velocidade) => set({ velocidade }),
  pausar: () => set({ velocidade: 'pausa' }),
  normal: () => set({ velocidade: 'normal' }),
  rapida: () => set({ velocidade: 'rapida' }),
}));

export default useGameTimeStore;