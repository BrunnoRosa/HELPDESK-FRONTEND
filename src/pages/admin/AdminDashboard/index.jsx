import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminApi, chamadoApi } from '../../../services/api';
import './style.css';

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('usuarios'); // 'usuarios' | 'metricas'

  // Form para novo usuário
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    role: 'TECNICO_N1',
    senha: ''
  });
  const [salvandoUser, setSalvandoUser] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [listaUsers, listaChamados] = await Promise.all([
        adminApi.listarUsuarios().catch(() => []),
        chamadoApi.listar().catch(() => [])
      ]);
      setUsuarios(Array.isArray(listaUsers) ? listaUsers : []);
      setChamados(Array.isArray(listaChamados) ? listaChamados : []);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar dados do painel administrativo.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
      toast.warn('Preencha todos os campos obrigatórios.');
      return;
    }

    setSalvandoUser(true);
    try {
      await adminApi.criarUsuario(novoUsuario);
      toast.success('Novo usuário cadastrado com sucesso!');
      setNovoUsuario({ nome: '', email: '', role: 'TECNICO_N1', senha: '' });
      carregarDados();
    } catch (error) {
      toast.error(error.message || 'Erro ao cadastrar usuário.');
    } finally {
      setSalvandoUser(false);
    }
  };

  const handleAlterarRole = async (userId, novaRole) => {
    try {
      await adminApi.atualizarPermissao(userId, { role: novaRole });
      toast.success('Permissão atualizada!');
      setUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: novaRole } : u))
      );
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar permissão.');
    }
  };

  if (loading) {
    return <div className="dashboard-content"><p className="loading-text">Carregando painel administrativo...</p></div>;
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2 className="page-title">Painel do Administrador</h2>
        <p className="page-subtitle">Gestão global de usuários, perfis de acesso e auditoria do sistema.</p>
      </div>

      <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className={`btn-action ${abaAtiva === 'usuarios' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('usuarios')}
        >
          Gestão de Usuários
        </button>
        <button 
          className={`btn-action ${abaAtiva === 'metricas' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('metricas')}
        >
          Métricas Globais
        </button>
      </div>

      {abaAtiva === 'usuarios' && (
        <>
          <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
            <h3>Cadastrar Novo Usuário</h3>
            <form onSubmit={handleCriarUsuario} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Nome Completo</label>
                <input 
                  type="text" 
                  name="nome" 
                  value={novoUsuario.nome} 
                  onChange={handleInputChange} 
                  placeholder="Ex: João Silva" 
                  required 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>E-mail</label>
                <input 
                  type="email" 
                  name="email" 
                  value={novoUsuario.email} 
                  onChange={handleInputChange} 
                  placeholder="joao@empresa.com" 
                  required 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Senha Inicial</label>
                <input 
                  type="password" 
                  name="senha" 
                  value={novoUsuario.senha} 
                  onChange={handleInputChange} 
                  placeholder="******" 
                  required 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>Perfil / Nível</label>
                <select 
                  name="role" 
                  value={novoUsuario.role} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="CLIENTE">Cliente / Solicitante</option>
                  <option value="TECNICO_N1">Técnico N1</option>
                  <option value="TECNICO_N2">Técnico N2</option>
                  <option value="TECNICO_N3">Técnico N3</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                <button type="submit" className="btn-action" disabled={salvandoUser}>
                  {salvandoUser ? 'Cadastrando...' : '+ Cadastrar Usuário'}
                </button>
              </div>
            </form>
          </div>

          <div className="table-wrapper">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil Atual</th>
                  <th>Alterar Nível</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum usuário cadastrado.</td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id}>
                      <td><strong>#{u.id}</strong></td>
                      <td>{u.nome || u.name}</td>
                      <td>{u.email}</td>
                      <td><span className="status-badge">{u.role || u.perfil}</span></td>
                      <td>
                        <select 
                          value={u.role || u.perfil} 
                          onChange={(e) => handleAlterarRole(u.id, e.target.value)}
                          className="priority-select"
                        >
                          <option value="CLIENTE">CLIENTE</option>
                          <option value="TECNICO_N1">TECNICO_N1</option>
                          <option value="TECNICO_N2">TECNICO_N2</option>
                          <option value="TECNICO_N3">TECNICO_N3</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {abaAtiva === 'metricas' && (
        <div className="dashboard__stats">
          <article>
            <strong>{usuarios.length}</strong>
            <span>Usuários Cadastrados</span>
          </article>
          <article>
            <strong>{chamados.length}</strong>
            <span>Total de Chamados</span>
          </article>
          <article>
            <strong>{chamados.filter(c => ['RESOLVIDO', 'Resolvido'].includes(c.status || c.statusChamado)).length}</strong>
            <span>Chamados Resolvidos</span>
          </article>
          <article className="stat-urgente">
            <strong>{chamados.filter(c => ['CRITICA', 'CRÍTICA', 'ALTA', 'Alto'].includes(c.prioridade || c.prioridadeChamado)).length}</strong>
            <span>Chamados Críticos</span>
          </article>
        </div>
      )}
    </div>
  );
}