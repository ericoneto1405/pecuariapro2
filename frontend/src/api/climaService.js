// Serviço para buscar clima atual de uma fazenda pelo backend

const API_BASE = 'http://localhost:5050/api/clima';

/**
 * Busca o clima para uma latitude e longitude
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<object>} dados do clima
 */
export async function getClima(lat, lon) {
  const res = await fetch(`${API_BASE}?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Erro ao buscar clima');
  return res.json();
}

/**
 * Busca o clima para todas as fazendas
 * @param {Array<{id: number, nome: string, latitude: number, longitude: number}>} fazendas
 * @returns {Promise<Array<{fazendaId: number, nome: string, clima: object}>>}
 */
export async function getClimaParaFazendas(fazendas) {
  // Executa as requisições em paralelo
  const results = await Promise.all(
    fazendas.map(async fazenda => {
      try {
        const clima = await getClima(fazenda.latitude, fazenda.longitude);
        return { fazendaId: fazenda.id, nome: fazenda.nome, clima };
      } catch (e) {
        return { fazendaId: fazenda.id, nome: fazenda.nome, clima: null, error: e.message };
      }
    })
  );
  return results;
}
