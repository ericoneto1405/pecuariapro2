// iatfService.js
// Serviço de integração para operações de IATF
import axios from 'axios';

const API_URL = 'http://localhost:5050/iatf';

export async function contratarIATF({
  vacasIds,
  touroId,
  semenSexado,
  protocolo
}) {
  // Envia requisição para registrar serviço de IATF
  const resp = await axios.post(API_URL + '/contratar', {
    vacasIds,
    touroId,
    semenSexado,
    protocolo
  });
  return resp.data;
}

export async function obterResultadoIATF(idServico) {
  // Consulta resultado do serviço de IATF
  const resp = await axios.get(API_URL + '/resultado/' + idServico);
  return resp.data;
}
