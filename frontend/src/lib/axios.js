import axios from 'axios';
const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api';
const api = axios.create({
  baseURL: baseURL,

});
export default api;