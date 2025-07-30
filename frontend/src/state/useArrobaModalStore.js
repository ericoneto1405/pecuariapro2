import { create } from "zustand";

const useArrobaModalStore = create((set) => ({
  showModal: false,
  setShowModal: (value) => set({ showModal: value }),
}));

export default useArrobaModalStore;
