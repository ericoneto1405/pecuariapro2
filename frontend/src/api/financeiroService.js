// Serviço para buscar dados financeiros do backend

const API_BASE = 'http://localhost:5050/api/financeiro';

export async function getReceitas() {
  const res = await fetch(`${API_BASE}/receitas`);
  if (!res.ok) throw new Error('Erro ao buscar receitas');
  return res.json();
}

export async function getDespesas() {
  const res = await fetch(`${API_BASE}/despesas`);
  if (!res.ok) throw new Error('Erro ao buscar despesas');
  return res.json();
}

export async function getFazendasJogador() {
  const res = await fetch(`${API_BASE}/fazendas`);
  if (!res.ok) throw new Error('Erro ao buscar fazendas do jogador');
  return res.json();
}

export async function getDRE() {
  const res = await fetch(`${API_BASE}/dre`);
  if (!res.ok) throw new Error('Erro ao buscar DRE');
  return res.json();
}

// Novo: Lançar despesa (compra em loja)
export async function lancarDespesa({ descricao, valor, categoria, data, status = 'Paga', obs = '' }) {
  // O backend ainda não implementa POST, então simulamos localmente
  // Quando houver endpoint, troque por POST real
  return {
    id: Math.floor(Math.random() * 100000),
    descricao,
    valor,
    vencimento: data,
    categoria,
    status,
    obs,
  };
}
