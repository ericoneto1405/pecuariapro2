import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

// Serviço para gerenciar frigoríficos
export async function listarFrigorificos() {
  const resp = await axios.get(`${API_URL}/frigorificos`);
  return resp.data;
}

export async function obterFrigorifico(id) {
  const resp = await axios.get(`${API_URL}/frigorificos/${id}`);
  return resp.data;
}

export async function obterPrecosFrigorifico(frigorificoId) {
  const resp = await axios.get(`${API_URL}/frigorificos/${frigorificoId}/precos`);
  return resp.data;
}

export async function negociarLote(frigorificoId, loteId, proposta) {
  const resp = await axios.post(`${API_URL}/frigorificos/${frigorificoId}/negociar`, {
    lote_id: loteId,
    proposta
  });
  return resp.data;
} 