import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  // Ajustado para buscar a chave exata salva pela sua aplicação
  const token = localStorage.getItem('@GLPI:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },
  registrar: async (userData) => {
    const response = await API.post('/auth/register', userData); 
    return response.data;
  },
};

export const chamadoApi = {
  listar: async () => {
    const response = await API.get('/chamados');
    return response.data;
  },
  buscar: async (id) => {
    const response = await API.get(`/chamados/${id}`);
    return response.data;
  },
  criar: async (chamado) => {
    const response = await API.post('/chamados', chamado);
    return response.data;
  },
};

export const atendimentoApi = {
  listar: async () => {
    const response = await API.get('/atendimentos');
    return response.data;
  },
  buscarPorChamado: async (chamadoId) => {
    const response = await API.get(`/atendimentos/chamado/${chamadoId}`);
    return response.data;
  },
  responder: async (dados) => {
    const response = await API.post('/atendimentos', dados);
    return response.data;
  }
};

export const adminApi = {
  listarUsuarios: async () => {
    const response = await API.get('/admin/usuarios');
    return response.data;
  },
};

export default API;