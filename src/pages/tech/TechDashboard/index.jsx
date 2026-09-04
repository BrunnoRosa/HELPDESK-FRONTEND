import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chamadoApi } from '../../../services/api';
import './style.css';

export default function TechDashboard() {
  const [chamados, setChamados] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarChamados = async () => {
      try {
        const response = await chamadoApi.listar();
        setChamados(Array.isArray(response) ? response : []);
      } catch (error) {
        setErro(error.message || 'Não foi possível carregar os chamados.');
      }
    };

    carregarChamados();
  }, []);

  const stats = useMemo(() => ({
    total: chamados.length,
    urgentes: chamados.filter((chamado) => chamado?.prioridadeChamado === 'URGENTE').length,
    altas: chamados.filter((chamado) => chamado?.prioridadeChamado === 'ALTA').length,
    medias: chamados.filter((chamado) => chamado?.prioridadeChamado === 'MEDIA').length,
  }), [chamados]);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2 className="page-title">Painel Operacional Técnico</h2>
        <p className="page-subtitle">Visão consolidada dos chamados em atendimento.</p>
      </div>

      {erro && <div className="error-box">{erro}</div>}

      <div className="dashboard__stats">
        <article><strong>{stats.total}</strong><span>Total de chamados</span></article>
        <article className="stat-urgente"><strong>{stats.urgentes}</strong><span>Urgentes</span></article>
        <article><strong>{stats.altas}</strong><span>Prioridade alta</span></article>
        <article><strong>{stats.medias}</strong><span>Prioridade média</span></article>
      </div>

      <div className="table-wrapper">
        <table className="tech-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Ocorrência</th>
              <th>Descrição</th>
              <th>Prioridade</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {chamados.map((chamado, index) => (
              <tr key={chamado?.id ?? index}>
                <td><strong>#{chamado?.id ?? '---'}</strong></td>
                <td>{chamado?.tituloChamado ?? 'Sem título'}</td>
                <td>{chamado?.ocorrenciaChamado ?? 'Não informada'}</td>
                <td>{chamado?.descricaoChamado ?? 'Descrição não informada.'}</td>
                <td>{chamado?.prioridadeChamado ?? 'MEDIA'}</td>
                <td>
                  <Link to={`/tecnico/chamado/${chamado?.id ?? ''}`} className="btn-action">
                    Atender
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
