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

// Novo: Registrar empréstimo aprovado como receita
export async function registrarEmprestimo({ instituicao, valor, linha, parcelas, taxaMes }) {
  const dataAtual = new Date().toISOString().slice(0, 10);
  const valorParcela = (valor * taxaMes * Math.pow(1 + taxaMes, parcelas)) / (Math.pow(1 + taxaMes, parcelas) - 1);
  const totalPago = valorParcela * parcelas;
  
  const payload = {
    descricao: `Empréstimo ${linha} - ${instituicao}`,
    valor: valor,
    data: dataAtual,
    categoria: 'Empréstimo',
    status: 'Recebida',
    obs: `Instituição: ${instituicao} | Linha: ${linha} | Parcelas: ${parcelas}x | Total a pagar: R$ ${totalPago.toLocaleString('pt-BR')}`
  };

  const res = await fetch(`${API_BASE}/receitas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) throw new Error('Erro ao registrar empréstimo');
  return res.json();
}

// Novo: Registrar parcela de empréstimo como despesa
export async function registrarParcelaEmprestimo({ instituicao, valorParcela, numeroParcela, totalParcelas, dataVencimento }) {
  const payload = {
    descricao: `Parcela ${numeroParcela}/${totalParcelas} - ${instituicao}`,
    valor: valorParcela,
    vencimento: dataVencimento,
    categoria: 'Empréstimo',
    status: 'A Pagar',
    obs: `Parcela ${numeroParcela} de ${totalParcelas}`
  };

  // Por enquanto, simulamos localmente até ter endpoint POST para despesas
  return {
    id: Math.floor(Math.random() * 100000),
    ...payload
  };
}
