import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

export const getGameTime = async () => {
  const response = await axios.get(`${API_URL}/time`);
  return response.data;
};


// Avança o tempo do jogo em segundos (preferencialmente), ou dias (legado)
export const advanceGameTime = async ({ seconds = null, days = null } = {}) => {
  const payload = {};
  if (seconds !== null) payload.seconds = seconds;
  if (days !== null) payload.days = days;
  const response = await axios.post(`${API_URL}/advance_time`, payload);
  return response.data;
};
