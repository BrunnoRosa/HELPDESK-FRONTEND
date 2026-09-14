import { useState, useEffect, useMemo } from 'react';
import { adminApi } from '../../../services/api';
import Notification from '../../../components/Notification';
import './style.css'; // Pode importar o mesmo CSS do AdminDashboard ou criar um específico

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('LISTA_USUARIOS'); 
  const [usuarios, setUsuarios] = useState([]);
  const [ordem, setOrdem] = useState('ID');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({ 
    nomeCompleto: '', 
    email: '', 
    senha: '', 
    perfilUsuario: 'USUARIO', 
    nivelSuporte: '' 
  });

  useEffect(() => {
    if (activeTab === 'LISTA_USUARIOS') {
      carregarUsuarios();
    }
  }, [activeTab]);

  const carregarUsuarios = async () => {
    try {
      const response = await adminApi.listarUsuarios();
      setUsuarios(Array.isArray(response) ? response : []);
    } catch (erro) {
      console.error('Erro ao buscar usuários:', erro);
    }
  };

  const usuariosOrdenados = useMemo(() => {
    const copia = [...usuarios];
    if (ordem === 'NOME') {
      return copia.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    }
    return copia.sort((a, b) => a.id - b.id);
  }, [usuarios, ordem]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    const payload = {
      nome: formData.nomeCompleto, 
      email: formData.email,
      senha: formData.senha,
      perfil: formData.perfilUsuario,
      nivelSuporte: formData.perfilUsuario === 'TECNICO' ? formData.nivelSuporte : null
    };

    try {
      await adminApi.criarUsuario(payload);
      setFeedback({ type: 'success', message: 'Usuário cadastrado com sucesso!' });
      setFormData({ nomeCompleto: '', email: '', senha: '', perfilUsuario: 'USUARIO', nivelSuporte: '' });
      setActiveTab('LISTA_USUARIOS');
    } catch (error) {
      console.error("Erro detalhado:", error);
      setFeedback({
        type: 'error',
        message: error.message || 'Erro ao cadastrar usuário. Verifique os dados ou permissões.'
      });
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Gestão de Usuários</h2>
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'LISTA_USUARIOS' ? 'active' : ''}`} 
            onClick={() => setActiveTab('LISTA_USUARIOS')}
          >
            Usuários Cadastrados
          </button>
          <button 
            className={`tab-btn ${activeTab === 'NOVO_USUARIO' ? 'active' : ''}`} 
            onClick={() => setActiveTab('NOVO_USUARIO')}
          >
            Novo Usuário
          </button>
        </div>
      </div>

      {feedback.message && <Notification type={feedback.type} message={feedback.message} />}

      {activeTab === 'LISTA_USUARIOS' && (
        <div className="admin-panel white-panel">
          <div className="user-sort">
            <label htmlFor="user-sort-select">Ordenar por:</label>
            <select id="user-sort-select" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
              <option value="ID">ID do Usuário</option>
              <option value="NOME">Ordem Alfabética</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome Completo</th>
                  <th>Email</th>
                  <th>Perfil</th>
                </tr>
              </thead>
              <tbody>
                {usuariosOrdenados.length === 0 ? (
                  <tr><td colSpan="4" className="empty-state">Nenhum usuário cadastrado.</td></tr>
                ) : (
                  usuariosOrdenados.map((user) => (
                    <tr key={user.id}>
                      <td><strong>#{user.id}</strong></td>
                      <td>{user.nome}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="role-badge">
                          {user.perfil}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'NOVO_USUARIO' && (
        <div className="admin-panel white-panel form-panel">
          <h3>Cadastrar Novo Acesso</h3>
          <form onSubmit={handleCreateUser} className="admin-form">
            <label>Nome Completo:</label>
            <input type="text" value={formData.nomeCompleto} onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})} required />

            <label>Email:</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />

            <label>Senha Temporária:</label>
            <input type="password" value={formData.senha} onChange={(e) => setFormData({...formData, senha: e.target.value})} required />

            <label>Perfil do Usuário:</label>
            <select value={formData.perfilUsuario} onChange={(e) => setFormData({...formData, perfilUsuario: e.target.value})}>
              <option value="USUARIO">Usuário Comum</option>
              <option value="TECNICO">Técnico</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>

            {formData.perfilUsuario === 'TECNICO' && (
              <>
                <label>Nível de Suporte:</label>
                <select value={formData.nivelSuporte} onChange={(e) => setFormData({...formData, nivelSuporte: e.target.value})} required>
                  <option value="">Selecione o Nível...</option>
                  <option value="N1">N1 - Triagem e Básico</option>
                  <option value="N2">N2 - Especializado</option>
                  <option value="N3">N3 - Engenharia</option>
                </select>
              </>
            )}
            <button type="submit" className="btn-primary">Cadastrar no Sistema</button>
          </form>
        </div>
      )}
    </div>
  );
}