import { create } from 'zustand';
import { advanceGameTime, getGameTime } from '../api/timeService';

const BASE_DATE = new Date('2025-05-14T05:00:00');

const useGameTimeStore = create((set, get) => ({
  dataAtualJogo: new Date(BASE_DATE),
  velocidade: 'pausa',
  loading: false,
  error: null,


  fetchInitialTime: async () => {
    set({ loading: true });
    try {
      const data = await getGameTime();
      console.log('[useGameTimeStore] fetchInitialTime data:', data);
      let novaData = new Date(BASE_DATE);
      if (data && data.game_time && typeof data.game_time.seconds === 'number') {
        novaData = new Date(BASE_DATE.getTime() + (data.game_time.seconds * 1000));
      }
      console.log('[useGameTimeStore] fetchInitialTime novaData:', novaData);
      set({ dataAtualJogo: novaData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },


  // Avança o tempo do jogo em segundos
  advanceTime: async (seconds = 86400) => {
    set({ loading: true, error: null });
    try {
      console.log('[useGameTimeStore] advanceTime chamado, seconds:', seconds);
      const data = await advanceGameTime({ seconds });
      let novaData = new Date(BASE_DATE);
      if (data && data.game_time && typeof data.game_time.seconds === 'number') {
        novaData = new Date(BASE_DATE.getTime() + (data.game_time.seconds * 1000));
      }
      console.log('[useGameTimeStore] advanceTime novaData:', novaData);
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