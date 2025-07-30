// Serviço para buscar clima atual de uma fazenda pelo backend

const API_BASE = 'http://localhost:5050/api/clima';

/**
 * Busca o clima para uma latitude e longitude
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<object>} dados do clima
 */
export async function getClima(lat, lon) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
  
  try {
    const res = await fetch(`${API_BASE}?lat=${lat}&lon=${lon}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error(`Erro ao buscar clima: ${res.status}`);
    const data = await res.json();
    return data.clima;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Timeout ao buscar clima');
    }
    throw error;
  }
}

/**
 * Busca o clima para todas as fazendas
 * @param {Array<{id: number, nome: string, latitude: number, longitude: number}>} fazendas
 * @returns {Promise<Array<{fazendaId: number, nome: string, clima: object}>>}
 */
export async function getClimaParaFazendas(fazendas) {
  // Processa as requisições em lotes de 5 para evitar sobrecarga
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < fazendas.length; i += batchSize) {
    const batch = fazendas.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(async fazenda => {
        try {
          const clima = await getClima(fazenda.latitude, fazenda.longitude);
          return { fazendaId: fazenda.id, nome: fazenda.nome, clima };
        } catch (e) {
          console.warn(`Erro ao buscar clima para ${fazenda.nome}:`, e.message);
          return { fazendaId: fazenda.id, nome: fazenda.nome, clima: null, error: e.message };
        }
      })
    );
    
    results.push(...batchResults);
    
    // Pausa entre lotes para não sobrecarregar o servidor
    if (i + batchSize < fazendas.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Busca a previsão diária de até 7 dias para uma latitude e longitude
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Array>} previsão diária
 */
export async function getPrevisaoClima(lat, lon) {
  const res = await fetch(`http://localhost:5050/api/clima/previsao?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Erro ao buscar previsão do clima');
  const data = await res.json();
  return data.previsao || [];
}
