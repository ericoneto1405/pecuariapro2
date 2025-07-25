import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

export const getGameTime = async () => {
  const response = await axios.get(`${API_URL}/time`);
  return response.data;
};

export const advanceGameTime = async (days = 1) => {
  const response = await axios.post(`${API_URL}/advance_time`, { days });
  return response.data;
};
