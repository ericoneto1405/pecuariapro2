import axios from 'axios';

const API_URL = 'http://localhost:5050/api/central_semen';

export async function getDosesSemen() {
  const response = await axios.get(API_URL);
  return response.data;
}
