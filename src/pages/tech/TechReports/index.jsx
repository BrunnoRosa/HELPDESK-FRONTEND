import React, { useEffect, useMemo, useState } from 'react';
import ChamadoCard from '../../../components/ChamadoCard';
import { atendimentoApi, chamadoApi } from '../../../services/api';
import './style.css';

export default function TechReports() {
  const [chamados, setChamados] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('TODOS');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  // Carrega os dados reais da API ao montar o componente
  useEffect(() => {
    Promise.all([chamadoApi.listar(), atendimentoApi.listar()])
      .then(([listaChamados, listaAtendimentos]) => {
        setChamados(listaChamados);
        setAtendimentos(listaAtendimentos);
      })
      .catch((error) => setErro(error.message || "Erro ao carregar os relatórios."))
      .finally(() => setLoading(false));
  }, []);

  // Mescla e filtra os chamados com base na busca e status selecionado
  const porChamado = useMemo(() => Object.fromEntries(atendimentos.map((item) => [item.chamadoId, item])), [atendimentos]);
  
  const filtrados = chamados.filter((chamado) => {
    const texto = `${chamado.id} ${chamado.tituloChamado} ${chamado.descricaoChamado}`.toLowerCase();
    const correspondeBusca = texto.includes(busca.toLowerCase());
    const correspondeStatus = status === 'TODOS' || porChamado[chamado.id]?.status === status;
    return correspondeBusca && correspondeStatus;
  });

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2 className="page-title">Relatórios, SLA e Auditoria</h2>
        <p className="page-subtitle">Monitoramento de logs, cronograma de manutenção e consulta geral de chamados.</p>
      </div>

      {erro && <div className="error-box">{erro}</div>}

      {/* BLOCO 1: MANTIDO DO SEU PROJETO (Guia de Manutenção e ISO) */}
      <div className="reports-grid">
        <div className="logs-section">
          <h3>Calendário de Manutenção Base</h3>
          <table className="logs-table">
            <thead>
              <tr>
                <th>Frequência</th>
                <th>Tarefa</th>
                <th>Status Padrão</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Diária</strong></td>
                <td>Backup do Banco de Dados</td>
                <td><span className="status-badge status-ok">Realizado</span></td>
              </tr>
              <tr>
                <td><strong>Semanal</strong></td>
                <td>Verificação de Logs de Segurança</td>
                <td><span className="status-badge status-ok">Realizado</span></td>
              </tr>
              <tr>
                <td><strong>Mensal</strong></td>
                <td>Atualizações de Segurança (Patch)</td>
                <td><span className="status-badge status-warn">Pendente</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="logs-section norm-section">
          <h3>Conformidade com Normas ISO</h3>
          <ul className="norm-list">
            <li><strong>ISO/IEC 12207:</strong> Ciclo de vida do software.</li>
            <li><strong>ISO/IEC 14764:</strong> Manutenção (Corretiva, Preventiva).</li>
            <li><strong>ISO/IEC 20000:</strong> Gestão de serviços de TI e SLA.</li>
          </ul>
        </div>
      </div>

      <hr className="section-divider" />

      {/* BLOCO 2: IMPLEMENTADO DO FRONTEND (Busca e Listagem Ativa) */}
      <div className="advanced-query-section">
        <h3>Consulta Avançada de Chamados</h3>
        
        <div className="chamados__filters">
          <input 
            type="text"
            value={busca} 
            onChange={(event) => setBusca(event.target.value)} 
            placeholder="Buscar por ID, título ou descrição..." 
            className="search-input"
          />
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="status-select">
            <option value="TODOS">Todos os status</option>
            <option value="ABERTO">Aberto</option>
            <option value="EM_TRIAGEM">Em triagem</option>
            <option value="EM_ATENDIMENTO">Em atendimento</option>
            <option value="PENDENTE_EVIDENCIA">Pendente evidência</option>
            <option value="RESOLVIDO">Resolvido</option>
            <option value="FECHADO">Fechado</option>
          </select>
        </div>

        {loading ? (
          <p className="loading-text">Carregando base de chamados...</p>
        ) : (
          <div className="chamados__grid">
            {filtrados.length > 0 ? (
              filtrados.map((chamado) => (
                <ChamadoCard key={chamado.id} chamado={chamado} atendimento={porChamado[chamado.id]} />
              ))
            ) : (
              <p className="no-results">Nenhum chamado encontrado para os filtros aplicados.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
