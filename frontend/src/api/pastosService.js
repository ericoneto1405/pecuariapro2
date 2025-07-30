// Serviço para gerenciar pastos e insumos

const API_BASE = 'http://localhost:5050/api';

/**
 * Cria um novo pasto em uma fazenda
 * @param {string} npcId - ID do NPC
 * @param {string} fazendaId - ID da fazenda
 * @param {string} nome - Nome do pasto
 * @param {number} areaHa - Área em hectares
 * @param {string} tipo - Tipo do pasto (maternidade, recria, engorda, touros, geral)
 * @returns {Promise<object>} resultado da criação
 */
export async function criarPasto(npcId, fazendaId, nome, areaHa, tipo = 'geral') {
  const response = await fetch(`${API_BASE}/pastos/criar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      npc_id: npcId,
      fazenda_id: fazendaId,
      nome: nome,
      area_ha: areaHa,
      tipo: tipo
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensagem || 'Erro ao criar pasto');
  }

  return response.json();
}

/**
 * Lista todos os pastos de uma fazenda
 * @param {string} npcId - ID do NPC
 * @param {string} fazendaId - ID da fazenda
 * @returns {Promise<object>} lista de pastos
 */
export async function listarPastos(npcId, fazendaId) {
  const response = await fetch(`${API_BASE}/pastos/${npcId}/${fazendaId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensagem || 'Erro ao listar pastos');
  }

  return response.json();
}

/**
 * Obtém o inventário de insumos de um NPC
 * @param {string} npcId - ID do NPC
 * @returns {Promise<object>} inventário de insumos
 */
export async function obterInventarioInsumos(npcId) {
  const response = await fetch(`${API_BASE}/insumos/${npcId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensagem || 'Erro ao obter inventário');
  }

  return response.json();
}

/**
 * Calcula o custo em insumos para criar um pasto
 * @param {number} areaHa - Área em hectares
 * @param {string} tipo - Tipo do pasto
 * @returns {Promise<object>} custo calculado
 */
export async function calcularCustoPasto(areaHa, tipo = 'geral') {
  const response = await fetch(`${API_BASE}/pastos/calcular-custo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      area_ha: areaHa,
      tipo: tipo
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensagem || 'Erro ao calcular custo');
  }

  return response.json();
}

/**
 * Remove um pasto de uma fazenda
 * @param {string} npcId - ID do NPC
 * @param {string} fazendaId - ID da fazenda
 * @param {string} pastoId - ID do pasto
 * @returns {Promise<object>} resultado da remoção
 */
export async function removerPasto(npcId, fazendaId, pastoId) {
  const response = await fetch(`${API_BASE}/pastos/remover`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      npc_id: npcId,
      fazenda_id: fazendaId,
      pasto_id: pastoId
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensagem || 'Erro ao remover pasto');
  }

  return response.json();
}

/**
 * Verifica se há insumos suficientes para criar um pasto
 * @param {object} inventario - Inventário atual
 * @param {object} custoInsumos - Custo necessário
 * @returns {object} resultado da verificação
 */
export function verificarInsumosSuficientes(inventario, custoInsumos) {
  const faltantes = [];
  const insuficientes = [];

  for (const [insumo, quantidadeNecessaria] of Object.entries(custoInsumos)) {
    if (!inventario[insumo]) {
      faltantes.push(insumo);
    } else if (inventario[insumo].quantidade < quantidadeNecessaria) {
      insuficientes.push({
        insumo,
        tem: inventario[insumo].quantidade,
        precisa: quantidadeNecessaria,
        nome: inventario[insumo].nome
      });
    }
  }

  return {
    temSuficiente: faltantes.length === 0 && insuficientes.length === 0,
    faltantes,
    insuficientes
  };
}

/**
 * Formata o custo de insumos para exibição
 * @param {object} custoInsumos - Custo em insumos
 * @param {object} inventario - Inventário atual (opcional)
 * @returns {string} texto formatado
 */
export function formatarCustoInsumos(custoInsumos, inventario = null) {
  const itens = [];
  
  for (const [insumo, quantidade] of Object.entries(custoInsumos)) {
    let texto = `${quantidade}`;
    
    if (inventario && inventario[insumo]) {
      texto += ` ${inventario[insumo].unidade}`;
      const tem = inventario[insumo].quantidade;
      const status = tem >= quantidade ? '✅' : '❌';
      texto += ` (tem ${tem} ${status})`;
    }
    
    itens.push(texto);
  }
  
  return itens.join(', ');
} 