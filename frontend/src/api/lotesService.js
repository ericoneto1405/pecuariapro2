import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

// Serviço para gerenciar lotes de animais
export async function criarLoteIATF(animaisIds, configuracao) {
  const resp = await axios.post(`${API_URL}/lotes/iatf`, {
    animais_ids: animaisIds,
    configuracao
  });
  return resp.data;
}

export async function criarLoteVenda(animaisIds, precoUnitario, frigorificoId) {
  const resp = await axios.post(`${API_URL}/lotes/venda`, {
    animais_ids: animaisIds,
    preco_unitario: precoUnitario,
    frigorifico_id: frigorificoId
  });
  return resp.data;
}

export async function criarLoteAbate(animaisIds, frigorificoId) {
  const resp = await axios.post(`${API_URL}/lotes/abate`, {
    animais_ids: animaisIds,
    frigorifico_id: frigorificoId
  });
  return resp.data;
}

export async function listarLotes() {
  const resp = await axios.get(`${API_URL}/lotes`);
  return resp.data;
}

export async function obterLote(id) {
  const resp = await axios.get(`${API_URL}/lotes/${id}`);
  return resp.data;
}

export async function cancelarLote(id) {
  const resp = await axios.delete(`${API_URL}/lotes/${id}`);
  return resp.data;
} 