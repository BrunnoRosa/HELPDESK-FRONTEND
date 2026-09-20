import { useState, useEffect, useMemo } from 'react';
import { adminApi } from '../../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordInput from '../../../components/PasswordInput';
import './style.css';

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('LISTA_USUARIOS'); 
  const [usuarios, setUsuarios] = useState([]);
  const [ordem, setOrdem] = useState('ID');
  
  // Estado para Cadastro de Novo Usuário
  const [formData, setFormData] = useState({ 
    nomeCompleto: '', 
    email: '', 
    senha: '', 
    perfilUsuario: 'USUARIO', 
    nivelSuporte: '' 
  });

  // Estados para Edição de Perfil
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nomeCompleto: '',
    email: '',
    perfilUsuario: 'USUARIO',
    nivelSuporte: ''
  });

  // Estados para Reset de Senha
  const [resetPassUser, setResetPassUser] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');

  // Estado para Exclusão de Usuário
  const [deletingUser, setDeletingUser] = useState(null);

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
      toast.error(erro.message || 'Erro ao buscar usuários.');
    }
  };

  const usuariosOrdenados = useMemo(() => {
    const copia = [...usuarios];
    if (ordem === 'NOME') {
      return copia.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    }
    return copia.sort((a, b) => a.id - b.id);
  }, [usuarios, ordem]);

  // Cadastrar Novo Usuário
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const payload = {
      nome: formData.nomeCompleto, 
      email: formData.email,
      senha: formData.senha,
      perfil: formData.perfilUsuario,
      nivelSuporte: formData.perfilUsuario === 'TECNICO' ? formData.nivelSuporte : null
    };

    try {
      await adminApi.criarUsuario(payload);
      toast.success('Usuário cadastrado com sucesso!');
      setFormData({ nomeCompleto: '', email: '', senha: '', perfilUsuario: 'USUARIO', nivelSuporte: '' });
      setActiveTab('LISTA_USUARIOS');
    } catch (error) {
      toast.error(error.message || 'Erro ao cadastrar usuário. Verifique os dados ou permissões.');
    }
  };

  // Abrir Modal de Edição de Perfil
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      nomeCompleto: user.nome || '',
      email: user.email || '',
      perfilUsuario: user.perfil || 'USUARIO',
      nivelSuporte: user.nivelSuporte || ''
    });
  };

  // Salvar Alterações do Perfil
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const payload = {
      nome: editFormData.nomeCompleto,
      email: editFormData.email,
      perfil: editFormData.perfilUsuario,
      nivelSuporte: editFormData.perfilUsuario === 'TECNICO' ? editFormData.nivelSuporte : null
    };

    try {
      await adminApi.atualizarUsuario(editingUser.id, payload);
      toast.success('Perfil do usuário atualizado com sucesso!');
      setEditingUser(null);
      carregarUsuarios();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao atualizar perfil do usuário.');
    }
  };

  // Resetar Senha do Usuário
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPassUser) return;

    try {
      await adminApi.resetarSenha(resetPassUser.id, { senha: novaSenha });
      toast.success('Senha redefinida com sucesso!');
      setResetPassUser(null);
      setNovaSenha('');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao redefinir a senha.');
    }
  };

  // Excluir Usuário
  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      await adminApi.deletarUsuario(deletingUser.id);
      toast.success('Usuário excluído com sucesso!');
      setDeletingUser(null);
      carregarUsuarios();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao excluir usuário.');
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer autoClose={3000} position="top-right" />

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
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosOrdenados.length === 0 ? (
                  <tr><td colSpan="5" className="empty-state">Nenhum usuário cadastrado.</td></tr>
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
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            className="tab-btn"
                            style={{ padding: '4px 10px', fontSize: '0.85rem' }}
                            onClick={() => handleOpenEdit(user)}
                            title="Editar Perfil"
                          >
                            ✏️ Editar
                          </button>
                          <button 
                            className="tab-btn"
                            style={{ padding: '4px 10px', fontSize: '0.85rem', borderColor: '#f59e0b', color: '#b45309' }}
                            onClick={() => { setResetPassUser(user); setNovaSenha(''); }}
                            title="Resetar Senha"
                          >
                            🔑 Reset Senha
                          </button>
                          <button 
                            className="tab-btn"
                            style={{ padding: '4px 10px', fontSize: '0.85rem', borderColor: '#ef4444', color: '#dc2626' }}
                            onClick={() => setDeletingUser(user)}
                            title="Excluir Usuário"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
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
            <PasswordInput
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              autoComplete="new-password"
              showStrength
              required
            />

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

      {/* MODAL DE EDIÇÃO DE PERFIL */}
      {editingUser && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="admin-panel white-panel" style={{ width: '100%', maxWidth: '500px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Editar Perfil #{editingUser.id}</h3>
              <button onClick={() => setEditingUser(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="admin-form">
              <label>Nome Completo:</label>
              <input 
                type="text" 
                value={editFormData.nomeCompleto} 
                onChange={(e) => setEditFormData({...editFormData, nomeCompleto: e.target.value})} 
                required 
              />

              <label>Email:</label>
              <input 
                type="email" 
                value={editFormData.email} 
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} 
                required 
              />

              <label>Perfil do Usuário:</label>
              <select 
                value={editFormData.perfilUsuario} 
                onChange={(e) => setEditFormData({...editFormData, perfilUsuario: e.target.value})}
              >
                <option value="USUARIO">Usuário Comum</option>
                <option value="TECNICO">Técnico</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>

              {editFormData.perfilUsuario === 'TECNICO' && (
                <>
                  <label>Nível de Suporte:</label>
                  <select 
                    value={editFormData.nivelSuporte} 
                    onChange={(e) => setEditFormData({...editFormData, nivelSuporte: e.target.value})} 
                    required
                  >
                    <option value="">Selecione o Nível...</option>
                    <option value="N1">N1 - Triagem e Básico</option>
                    <option value="N2">N2 - Especializado</option>
                    <option value="N3">N3 - Engenharia</option>
                  </select>
                </>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar Alterações</button>
                <button type="button" className="tab-btn" onClick={() => setEditingUser(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE RESETAR SENHA */}
      {resetPassUser && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="admin-panel white-panel" style={{ width: '100%', maxWidth: '450px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Resetar Senha</h3>
              <button onClick={() => setResetPassUser(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
              Definir nova senha para o usuário <strong>{resetPassUser.nome || resetPassUser.email}</strong>:
            </p>

            <form onSubmit={handleResetPassword} className="admin-form">
              <label>Nova Senha:</label>
              <PasswordInput
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                showStrength
                required
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirmar Nova Senha</button>
                <button type="button" className="tab-btn" onClick={() => setResetPassUser(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {deletingUser && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="admin-panel white-panel" style={{ width: '100%', maxWidth: '420px', padding: '25px' }}>
            <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>Confirmar Exclusão</h3>
            <p style={{ fontSize: '0.95rem', color: '#333', marginBottom: '20px' }}>
              Tem certeza que deseja excluir permanentemente o usuário <strong>{deletingUser.nome || deletingUser.email}</strong>? Esta ação não pode ser desfeita.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ flex: 1, backgroundColor: '#dc2626', borderColor: '#dc2626' }}
                onClick={handleDeleteUser}
              >
                Sim, Excluir
              </button>
              <button type="button" className="tab-btn" onClick={() => setDeletingUser(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}