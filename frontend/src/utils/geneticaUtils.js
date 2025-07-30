// Utilitário para lógica genética bovina
// Implementa a função DeterminarFenotipo conforme especificação do prompt

/**
 * Determina o fenótipo (características visíveis) de um bovino a partir do genótipo.
 * @param {Object} genotipo - Objeto com os pares de alelos para cada locus.
 * Exemplo: { extension: ['E^D', 'e'], polled: ['p', 'p'], diluicao: ['d', 'd'] }
 * @returns {Object} fenotipo - Exemplo: { chifres: 'Aspado', pelagem: 'Preta' }
 */
export function DeterminarFenotipo(genotipo) {
  // Chifres (Locus Polled)
  const polled = genotipo.polled || [];
  const isMocho = polled.includes('P');
  const chifres = isMocho ? 'Mocho' : 'Aspado';

  // Cor base (Locus Extension)
  const extension = genotipo.extension || [];
  const isPreto = extension.includes('E^D');
  let corBase = isPreto ? 'Preta' : 'Vermelha';

  // Diluição (Locus Diluição)
  const diluicao = genotipo.diluicao || [];
  const hasDiluidor = diluicao.includes('D');
  let pelagem;
  if (hasDiluidor) {
    pelagem = corBase === 'Preta' ? 'Cinza-Fumaça' : 'Creme';
  } else {
    pelagem = corBase;
  }

  return {
    chifres,
    pelagem
  };
}


/**
 * Realiza o cruzamento genético entre dois animais, sorteando alelos dos pais para cada locus.
 * @param {Object} pai - Objeto com genotipo do pai (ex: { extension: ['E^D','e'], polled: ['P','p'], diluicao: ['d','d'] })
 * @param {Object} mae - Objeto com genotipo da mãe (mesmo formato)
 * @returns {Object} genotipoFilho - Novo objeto genotipo do bezerro
 */
export function RealizarCruzamento(pai, mae) {
  // Para cada locus, sorteia um alelo do pai e um da mãe
  function sortearAlelo(alelos) {
    if (!Array.isArray(alelos) || alelos.length !== 2) return '_';
    return alelos[Math.floor(Math.random() * 2)];
  }

  // Gera genótipo do bezerro
  const genotipo = {
    extension: [sortearAlelo(pai.extension), sortearAlelo(mae.extension)],
    polled: [sortearAlelo(pai.polled), sortearAlelo(mae.polled)],
    diluicao: [sortearAlelo(pai.diluicao), sortearAlelo(mae.diluicao)]
  };

  // Detecta heterose (Bos taurus x Bos indicus)
  const subespeciePai = pai.subespecie || '';
  const subespecieMae = mae.subespecie || '';
  const possuiHeterose =
    (subespeciePai === 'Bos taurus' && subespecieMae === 'Bos indicus') ||
    (subespeciePai === 'Bos indicus' && subespecieMae === 'Bos taurus');

  // Calcula DEPs (Diferença Esperada na Progênie)
  // Se não houver DEPs nos pais, usa valores padrão
  const depPai = pai.DEPs || { DEP_Crescimento: 0, DEP_Marmoreio: 0 };
  const depMae = mae.DEPs || { DEP_Crescimento: 0, DEP_Marmoreio: 0 };
  function varianciaAleatoria(magnitude = 0.2) {
    // Pequena variação aleatória entre -magnitude e +magnitude
    return (Math.random() * 2 - 1) * magnitude;
  }
  const DEPs = {
    DEP_Crescimento:
      ((depPai.DEP_Crescimento || 0) + (depMae.DEP_Crescimento || 0)) / 2 + varianciaAleatoria(0.2),
    DEP_Marmoreio:
      ((depPai.DEP_Marmoreio || 0) + (depMae.DEP_Marmoreio || 0)) / 2 + varianciaAleatoria(0.1)
  };

  // Retorna objeto completo do bezerro
  return {
    ...genotipo,
    possuiHeterose,
    DEPs
  };
}

// Exemplo de uso:
// DeterminarFenotipo({ extension: ['E^D', 'e'], polled: ['P', 'p'], diluicao: ['d', 'd'] })
// => { chifres: 'Mocho', pelagem: 'Preta' }
