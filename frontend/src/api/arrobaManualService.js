import axios from 'axios';

const API_URL = '/api/arroba_manual';

export async function getArrobaManual() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function setArrobaManual(arroba) {
  const res = await axios.post(API_URL, { arroba });
  return res.data;
}
