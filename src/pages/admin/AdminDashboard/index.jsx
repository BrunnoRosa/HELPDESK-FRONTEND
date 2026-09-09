import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, chamadoApi } from '../../../services/api';
import './style.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('CHAMADOS'); // CHAMADOS ou USUARIOS
  const [filaAtiva, setFilaAtiva] = useState('N1'); // N1, N2, N3
  const [filtroStatus, setFiltroStatus] = useState('TODOS'); // TODOS, ABERTO, ESCALONADO
  
  const [chamados, setChamados] = useState([]);
  const [formData, setFormData] = useState({ nomeCompleto: '', email: '', senha: '', perfilUsuario: 'USUARIO', nivelSuporte: '' });

  useEffect(() => {
    if (activeTab === 'CHAMADOS') {
      carregarChamados();
    }
  }, [activeTab]);

  const carregarChamados = async () => {
    try {
      const response = await chamadoApi.listar();
      setChamados(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar chamados', error);
    }
  };

  const chamadosFiltrados = useMemo(() => {
    return chamados.filter(c => {
      // Filtra por fila (Nível de Suporte)
      const nivelMatch = (c.nivelSuporte || 'N1') === filaAtiva;
      
      // Filtra por status/situação
      let statusMatch = true;
      if (filtroStatus === 'ABERTO') {
        statusMatch = ['ABERTO', 'EM_ANDAMENTO'].includes(c.statusChamado);
      } else if (filtroStatus === 'ESCALONADO') {
        // Exemplo: consideramos escalonado se mudou de nível ou tem prioridade alta
        statusMatch = ['ALTA', 'URGENTE'].includes(c.prioridadeChamado); 
      }
      return nivelMatch && statusMatch;
    });
  }, [chamados, filaAtiva, filtroStatus]);

  const handleCreateUser = async (e) => {
  e.preventDefault();
  
  // Mapeia o estado do React para o formato exato que o backend costuma pedir
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
  } catch (error) {
    // Agora o console vai exibir o erro exato para você debugar
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
          <button className={`tab-btn ${activeTab === 'USUARIOS' ? 'active' : ''}`} onClick={() => setActiveTab('USUARIOS')}>Novo Usuário</button>
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

      {activeTab === 'USUARIOS' && (
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