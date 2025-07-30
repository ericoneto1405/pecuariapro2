// Utilitário para cálculo de receita de venda em frigorífico
// 1 arroba = 15kg carcaça

/**
 * Calcula o valor total recebido na venda para frigorífico
 * @param {Object} params
 * @param {number} params.pesoVivo Peso vivo do animal (kg)
 * @param {number} params.rendimentoCarcaca Rendimento de carcaça (ex: 0.54 para 54%)
 * @param {number} params.precoArroba Preço da arroba (R$)
 * @param {number} [params.bonificacao] Percentual de bonificação (ex: 5 para 5%)
 * @param {number} [params.prazoDias] Dias de prazo para pagamento (0 = à vista)
 * @returns {Object} { arrobas, valorBase, valorBonificado, valorFinal }
 */
export function calcularReceitaFrigorifico({ pesoVivo, rendimentoCarcaca, precoArroba, bonificacao = 0, prazoDias = 0 }) {
  const pesoCarcaca = pesoVivo * rendimentoCarcaca;
  const arrobas = pesoCarcaca / 15;
  const valorBase = arrobas * precoArroba;
  const valorBonificado = valorBase * (1 + bonificacao / 100);
  let valorFinal = valorBonificado;
  if (prazoDias > 0) {
    const meses = prazoDias / 30;
    valorFinal = valorBonificado * (1 + 0.03 * meses);
  }
  return { arrobas, valorBase, valorBonificado, valorFinal };
}
