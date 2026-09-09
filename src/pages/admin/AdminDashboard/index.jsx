import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, chamadoApi } from '../../../services/api';
import './style.css';

export default function AdminDashboard() {
  // Controle de Abas: CHAMADOS, LISTA_USUARIOS, NOVO_USUARIO
  const [activeTab, setActiveTab] = useState('CHAMADOS'); 
  
  // Estados de Chamados
  const [filaAtiva, setFilaAtiva] = useState('N1'); 
  const [filtroStatus, setFiltroStatus] = useState('TODOS'); 
  const [chamados, setChamados] = useState([]);
  
  // Estados de Usuários
  const [usuarios, setUsuarios] = useState([]);
  const [ordem, setOrdem] = useState('ID');
  const [formData, setFormData] = useState({ nomeCompleto: '', email: '', senha: '', perfilUsuario: 'USUARIO', nivelSuporte: '' });

  useEffect(() => {
    if (activeTab === 'CHAMADOS') carregarChamados();
    if (activeTab === 'LISTA_USUARIOS') carregarUsuarios();
  }, [activeTab]);

  const carregarChamados = async () => {
    try {
      const response = await chamadoApi.listar();
      setChamados(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar chamados', error);
    }
  };

  const carregarUsuarios = async () => {
    try {
      const response = await adminApi.listarUsuarios();
      setUsuarios(Array.isArray(response) ? response : []);
    } catch (erro) {
      console.error('Erro ao buscar usuários:', erro);
    }
  };

  const chamadosFiltrados = useMemo(() => {
    return chamados.filter(c => {
      const nivelMatch = (c.nivelSuporte || 'N1') === filaAtiva;
      let statusMatch = true;
      if (filtroStatus === 'ABERTO') {
        statusMatch = ['ABERTO', 'EM_ANDAMENTO'].includes(c.statusChamado);
      } else if (filtroStatus === 'ESCALONADO') {
        statusMatch = ['ALTA', 'URGENTE'].includes(c.prioridadeChamado); 
      }
      return nivelMatch && statusMatch;
    });
  }, [chamados, filaAtiva, filtroStatus]);

  const usuariosOrdenados = useMemo(() => {
    const copia = [...usuarios];
    if (ordem === 'NOME') {
      return copia.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    }
    return copia.sort((a, b) => a.id - b.id);
  }, [usuarios, ordem]);

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
      alert('Usuário cadastrado com sucesso!');
      setFormData({ nomeCompleto: '', email: '', senha: '', perfilUsuario: 'USUARIO', nivelSuporte: '' });
      if (activeTab === 'LISTA_USUARIOS') carregarUsuarios();
    } catch (error) {
      console.error("Erro detalhado:", error);
      alert(error.message || 'Erro ao cadastrar usuário. Verifique os dados ou permissões.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Painel Administrativo</h2>
        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'CHAMADOS' ? 'active' : ''}`} onClick={() => setActiveTab('CHAMADOS')}>Gestão de Chamados</button>
          <button className={`tab-btn ${activeTab === 'LISTA_USUARIOS' ? 'active' : ''}`} onClick={() => setActiveTab('LISTA_USUARIOS')}>Usuários Cadastrados</button>
          <button className={`tab-btn ${activeTab === 'NOVO_USUARIO' ? 'active' : ''}`} onClick={() => setActiveTab('NOVO_USUARIO')}>Novo Usuário</button>
        </div>
      </div>

      {activeTab === 'CHAMADOS' && (
        <div className="admin-panel white-panel">
          <div className="queue-tabs">
            {['N1', 'N2', 'N3'].map(fila => (
              <button key={fila} className={`queue-btn ${filaAtiva === fila ? 'active' : ''}`} onClick={() => setFilaAtiva(fila)}>Fila {fila}</button>
            ))}
          </div>

          <div className="filter-group-admin">
            {['TODOS', 'ABERTO', 'ESCALONADO'].map(filtro => (
              <button key={filtro} className={`filter-btn ${filtroStatus === filtro ? 'active' : ''}`} onClick={() => setFiltroStatus(filtro)}>
                {filtro}
              </button>
            ))}
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Título</th>
                  <th>Prioridade</th>
                  <th>Responsável</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {chamadosFiltrados.length === 0 ? (
                  <tr><td colSpan="6" className="empty-state">Nenhum chamado nesta fila/filtro.</td></tr>
                ) : (
                  chamadosFiltrados.map(c => (
                    <tr key={c.id}>
                      <td><strong>#{c.id}</strong></td>
                      <td><span className={`badge badge-${c.statusChamado?.toLowerCase() || 'gray'}`}>{c.statusChamado}</span></td>
                      <td>{c.tituloChamado}</td>
                      <td><span className={`badge badge-${c.prioridadeChamado?.toLowerCase() || 'gray'}`}>{c.prioridadeChamado}</span></td>
                      <td>{c.tecnicoResponsavel?.nome || 'Não Atribuído'}</td>
                      <td><Link to={`/admin/chamado/${c.id}`} className="btn-outline-small">Gerenciar</Link></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'LISTA_USUARIOS' && (
        <div className="admin-panel white-panel">
          <div className="filter-group-admin" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>Ordenar por:</label>
            <select value={ordem} onChange={(e) => setOrdem(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
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
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Nenhum usuário cadastrado.</td></tr>
                ) : (
                  usuariosOrdenados.map((user) => (
                    <tr key={user.id}>
                      <td><strong>#{user.id}</strong></td>
                      <td>{user.nome}</td>
                      <td>{user.email}</td>
                      <td>
                        <span style={{ padding: '0.25rem 0.75rem', background: '#f3f4f6', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '600' }}>
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
            <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cadastrar no Sistema</button>
          </form>
        </div>
      )}
    </div>
  );
}