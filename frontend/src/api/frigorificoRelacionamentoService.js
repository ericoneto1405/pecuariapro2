import axios from 'axios';

// Busca relacionamento do jogador
export async function getRelacionamentoFrigorifico(frigorificoId) {
  const res = await axios.get('/api/frigorificos/relacionamento', {
    params: { frigorifico_id: frigorificoId, tipo: 'jogador' }
  });
  return res.data;
}

// Atualiza relacionamento do jogador
export async function atualizarRelacionamentoFrigorifico(frigorificoId, delta) {
  const res = await axios.post('/api/frigorificos/relacionamento', {
    frigorifico_id: frigorificoId,
    tipo: 'jogador',
    delta
  });
  return res.data;
}
