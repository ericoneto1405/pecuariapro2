import { create } from 'zustand';

const useCarrinhoSemenStore = create((set, get) => ({
  itens: [],
  addItem: (dose) => set(state => {
    // Se já existe, soma quantidade
    const idx = state.itens.findIndex(i => i.id === dose.id);
    if (idx >= 0) {
      const novos = [...state.itens];
      novos[idx].quantidade += 1;
      return { itens: novos };
    }
    return { itens: [...state.itens, { ...dose, quantidade: 1 }] };
  }),
  removeItem: (id) => set(state => ({ itens: state.itens.filter(i => i.id !== id) })),
  clear: () => set({ itens: [] }),
}));

export default useCarrinhoSemenStore;
