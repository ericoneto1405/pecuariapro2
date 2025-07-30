// Serviço para buscar o preço da arroba calculado (commodity internacional convertida)

const API_BASE = 'http://localhost:5050/api';

export async function getPrecoArroba() {
  const res = await fetch(`${API_BASE}/commodityprice?name=feeder_cattle`);
  if (!res.ok) throw new Error('Erro ao buscar preço da arroba');
  const data = await res.json();
  // O campo 'preco_arroba_brl' já vem convertido do backend para BRL/@
  return data.preco_arroba_brl;
}
