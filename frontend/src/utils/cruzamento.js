// Função utilitária para cruzamento de animais
export function cruzarAnimais(mae, pai, opcoes = {}) {
  // Herança mendeliana (exemplo: chifres)
  function sortearAlelo(alelosPai, alelosMae) {
    const aleloPai = alelosPai[Math.floor(Math.random() * alelosPai.length)];
    const aleloMae = alelosMae[Math.floor(Math.random() * alelosMae.length)];
    return aleloPai + aleloMae;
  }

  // Calcular grau de parentesco (simples: se pai e mãe compartilham algum ancestral direto)
  function grauParentesco(mae, pai) {
    // Exemplo simples: se pai e mãe têm mesmo pai ou mãe, parentesco alto
    if (!mae.genealogia || !pai.genealogia) return 0;
    const idsMae = [mae.genealogia.pai?.id, mae.genealogia.mae?.id];
    const idsPai = [pai.genealogia.pai?.id, pai.genealogia.mae?.id];
    const comuns = idsMae.filter(id => id && idsPai.includes(id));
    return comuns.length > 0 ? 0.25 : 0; // 25% se compartilham pai/mãe
  }

  // Verificar heterose: se não compartilham nenhuma raça principal
  function temHeterose(mae, pai) {
    const racasMae = Object.keys(mae.composicao_racial);
    const racasPai = Object.keys(pai.composicao_racial);
    return racasMae.some(r => !racasPai.includes(r)) && racasPai.some(r => !racasMae.includes(r));
  }

  // Genótipo mendeliano (exemplo para chifres e cor)
  const genotipo = {};
  for (const traço in mae.genotipo) {
    genotipo[traço] = sortearAlelo(
      pai.genotipo[traço]?.split('') || ['P', 'p'],
      mae.genotipo[traço]?.split('') || ['P', 'p']
    );
  }

  // Grau de parentesco e heterose
  const parentesco = grauParentesco(mae, pai);
  const heterose = temHeterose(mae, pai);

  // Herança poligênica
  const valores_geneticos = {};
  for (const vg in mae.valores_geneticos) {
    const media = (mae.valores_geneticos[vg] + (pai.valores_geneticos[vg] || 0)) / 2;
    let variacao = media * (Math.random() * 0.2 - 0.1); // ±10%
    // Heterose
    if (heterose) variacao += media * 0.05;
    // Endogamia
    if (parentesco > 0.125) variacao -= media * 0.05;
    valores_geneticos[vg] = +(media + variacao).toFixed(2);
  }

  // Composição racial
  const composicao_racial = {};
  for (const raca in mae.composicao_racial) {
    composicao_racial[raca] = (composicao_racial[raca] || 0) + mae.composicao_racial[raca] / 2;
  }
  for (const raca in pai.composicao_racial) {
    composicao_racial[raca] = (composicao_racial[raca] || 0) + pai.composicao_racial[raca] / 2;
  }

  // Genealogia
  const genealogia = {
    pai: { id: pai.id, nome: pai.nome, raca: Object.keys(pai.composicao_racial).join('/') },
    mae: { id: mae.id, nome: mae.nome, raca: Object.keys(mae.composicao_racial).join('/') },
    avos: {},
    bisavos: {}
  };

  // Geração de ID (exemplo)
  function gerarId(fazenda, ultimoNumero) {
    return fazenda + String(ultimoNumero + 1).padStart(4, '0');
  }

  // Retorno do novo animal
  return {
    id: 'NOVO_ID', // Substituir por lógica real
    nome: 'Bezerro',
    sexo: Math.random() < 0.5 ? 'M' : 'F',
    composicao_racial,
    puro: Object.keys(composicao_racial).length === 1,
    genealogia,
    genotipo,
    valores_geneticos,
    fenotipo: valores_geneticos, // por enquanto igual ao VG
    localizacao: mae.localizacao,
    historico_reprodutivo: [],
    parentesco,
    heterose
  };
} 