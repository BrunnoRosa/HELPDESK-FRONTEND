import axios from 'axios';

// Mantém a instância do Axios do seu projeto, apontando para a porta do backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // Ajuste para a porta do seu backend atual
});

// Injeta o token nas requisições (seu padrão)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@GLPI:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata as respostas e erros (padrão do frontend)
api.interceptors.response.use(
  (response) => response.data, // Retorna diretamente o body (data)
  (error) => {
    // Se o token expirar (401), limpa o storage e emite evento
    if (error.response?.status === 401) {
      localStorage.removeItem('@GLPI:token');
      localStorage.removeItem('@GLPI:user');
      window.dispatchEvent(new Event('helpdesk-auth-expired'));
    }
    
    // Formatação de erros do backend
    const message = error.response?.data?.Mensagem || error.response?.data?.message || 'Erro ao processar a requisição';
    const validation = error.response?.data?.erros ? `: ${Object.values(error.response.data.erros).join(' | ')}` : '';
    
    return Promise.reject(new Error(`${message}${validation}`));
  }
);

// Mantém o export default para retrocompatibilidade com telas antigas
export default api;

// ==========================================
// EXPORTAÇÕES DE ROTAS (Requisitadas pelas novas telas)
// ==========================================

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload)
};

export const chamadoApi = {
  listar: () => api.get('/chamados'),
  buscar: (id) => api.get(`/chamados/${id}`),
  criar: (payload) => api.post('/chamados', payload),
  atualizar: (id, payload) => api.put(`/chamados/${id}`, payload),
  deletar: (id) => api.delete(`/chamados/${id}`)
};

export const atendimentoApi = {
  listar: () => api.get('/atendimentos'),
  buscarPorChamado: (chamadoId) => api.get(`/atendimentos/chamado/${chamadoId}`),
  atualizar: (payload) => api.put('/atendimentos', payload)
};

export const adminApi = {
  listarUsuarios: () => api.get('/admin/usuarios'),
  listarTecnicos: () => api.get('/admin/tecnicos'),
  atualizarPerfil: (id, perfil) => api.put(`/admin/usuarios/${id}/perfil`, { perfil }),
  deletarUsuario: (id) => api.delete(`/admin/usuarios/${id}`),
  resumo: () => api.get('/admin/relatorios/resumo')
};