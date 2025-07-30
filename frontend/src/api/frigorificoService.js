// Serviço de integração do módulo Frigoríficos com o financeiro e relacionamento
import axios from 'axios';

// Registra venda no financeiro
export async function registrarVendaFrigorifico({
  descricao,
  valor,
  data,
  categoria = 'Venda de Gado',
  status = 'Recebida',
  frigorificoId,
  bonificacao = 0,
  barter = false,
  prazoDias = 0,
  detalhes = {}
}) {
  // O backend espera um objeto receita
  const payload = {
    descricao,
    valor,
    data,
    categoria,
    status,
    frigorificoId,
    bonificacao,
    barter,
    prazoDias,
    detalhes
  };
  const res = await axios.post('/api/financeiro/receitas', payload);
  return res.data;
}

// Atualiza o termômetro de relacionamento do frigorífico
export async function atualizarRelacionamentoFrigorifico({ frigorificoId, delta }) {
  const res = await axios.post(`/api/frigorificos/relacionamento`, { frigorificoId, delta });
  return res.data;
}
