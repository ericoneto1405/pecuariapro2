// Função utilitária para validar categoria de bovinos conforme idade, sexo e histórico reprodutivo
// Baseado no documento de categorização fornecido

/**
 * Valida se a categoria informada é compatível com idade, sexo e histórico reprodutivo
 * @param {Object} animal - { idadeMeses: number, sexo: 'M'|'F', categoria: string, pariu: boolean }
 * @returns {boolean}
 */
export function validaCategoriaBovino({ idadeMeses, sexo, categoria, pariu, castrado }) {
  // castrado: boolean (apenas para machos)
  if (sexo === 'M') {
    if (categoria === 'Bezerro') return idadeMeses >= 0 && idadeMeses < 12;
    if (categoria === 'Garrote' || categoria === 'Novilho') return idadeMeses >= 12 && idadeMeses < 30;
    if (categoria === 'Boi') return idadeMeses >= 24 && castrado === true;
    if (categoria === 'Touro') return idadeMeses >= 24 && castrado === false;
    return false;
  }
  if (sexo === 'F') {
    if (categoria === 'Bezerra') return idadeMeses >= 0 && idadeMeses < 12;
    if (categoria === 'Novilha') return idadeMeses >= 12 && !pariu;
    if (categoria === 'Vaca') return pariu === true;
    return false;
  }
  return false;
}

/**
 * Sugere categoria ideal para um animal, dado idade, sexo e histórico reprodutivo
 * @param {Object} animal - { idadeMeses: number, sexo: 'M'|'F', pariu: boolean }
 * @returns {string}
 */
export function sugereCategoriaBovino({ idadeMeses, sexo, pariu, castrado }) {
  if (sexo === 'M') {
    if (idadeMeses < 12) return 'Bezerro';
    if (idadeMeses < 30) return 'Garrote';
    if (idadeMeses >= 24) {
      if (castrado === true) return 'Boi';
      if (castrado === false) return 'Touro';
      return 'Boi ou Touro';
    }
  }
  if (sexo === 'F') {
    if (idadeMeses < 12) return 'Bezerra';
    if (!pariu && idadeMeses >= 12) return 'Novilha';
    if (pariu) return 'Vaca';
  }
  return 'Desconhecido';
}
