import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Mantém a instância do Axios do seu projeto, apontando para a porta do backend
const api = axios.create({
  baseURL: API_URL,
});

// Injeta o token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@GLPI:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata as respostas e erros
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

export default api;

// ==========================================
// EXPORTAÇÕES DE ROTAS
// ==========================================

export const authApi = {
  login: (payload) => api.post('/auth/login', payload)
};

export const chamadoApi = {
  listar: () => api.get('/chamados'),
  buscar: (id) => api.get(`/chamados/${id}`),
  criar: (payload) => api.post('/chamados', payload),
  atualizar: (id, payload) => api.put(`/chamados/${id}`, payload),
  // Anexa uma NOVA evidência sem apagar as fotos já enviadas antes
  // (diferente do "atualizar", que substitui o chamado inteiro).
  adicionarEvidencia: (id, payload) => api.post(`/chamados/${id}/evidencias`, payload),
  deletar: (id) => api.delete(`/chamados/${id}`)
};

export const atendimentoApi = {
  listar: () => api.get('/atendimentos'),
  buscarPorChamado: (chamadoId) => api.get(`/atendimentos/chamado/${chamadoId}`),
  atualizar: (payload) => api.put('/atendimentos', payload)
};

export const adminApi = {
  criarUsuario: (payload) => api.post('/admin/usuarios', payload),
  listarUsuarios: () => api.get('/admin/usuarios'),
  listarTecnicos: () => api.get('/admin/tecnicos'),
  
  // CORREÇÃO 1: Rota de atualização alinhada com o backend (/perfil)
  atualizarUsuario: (id, payload) => api.put(`/admin/usuarios/${id}/perfil`, payload),
  
  // CORREÇÃO 2: Rota de reset alinhada com o backend (/reset-senha)
  // E enviando a chave 'novaSenha' que o seu DTO (ResetPasswordDTO) espera
  resetarSenha: (id, payload) => api.put(`/admin/usuarios/${id}/reset-senha`, { 
    novaSenha: payload.senha 
  }),
  
  // Rota de exclusão (Esta já estava correta, igual ao backend)
  deletarUsuario: (id) => api.delete(`/admin/usuarios/${id}`),
  
  resumo: () => api.get('/admin/relatorios/resumo')
};

export const usuarioApi = {
  alterarSenha: (payload) => api.put('/usuarios/alterar-senha', payload)
};