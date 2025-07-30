// Serviço para registrar venda de lote para frigorífico
const API_BASE = 'http://localhost:5050/api/financeiro';

export async function registrarVendaFrigorifico({ frigorificoId, animais, valor, bonificacao, prazoDias, data }) {
  // Monta o payload compatível com o backend Flask
  const payload = {
    descricao: `Venda de ${animais.length} animais para frigorífico ${frigorificoId}`,
    valor,
    data,
    categoria: 'Venda de Gado',
    status: 'Recebida',
    frigorificoId,
    bonificacao,
    prazoDias,
    animais
  };
  const res = await fetch(`${API_BASE}/receitas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao registrar venda');
  return res.json();
}
