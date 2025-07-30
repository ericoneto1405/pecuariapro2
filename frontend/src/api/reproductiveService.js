// reproductiveService.js
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

export async function getCatalogoSemen() {
  const resp = await axios.get(`${API_URL}/catalog/semen`);
  return resp.data;
}

export async function simularIATF({ vacas, touroId, protocolo, semenSexado }) {
  const resp = await axios.post(`${API_URL}/reproduction/iatf`, {
    vacas,
    touroId,
    protocolo,
    semenSexado
  });
  return resp.data;
}

export async function simularMontaNatural({ vacas, touroId }) {
  const resp = await axios.post(`${API_URL}/reproduction/natural-mating`, {
    vacas,
    touroId
  });
  return resp.data;
}
