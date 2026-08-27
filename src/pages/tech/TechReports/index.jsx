import './style.css';

export default function TechReports() {
  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>Plano de Manutenção e SLA</h2>
        <p>Monitoramento de logs, cronograma de manutenção e conformidade técnica.</p>
      </div>

      <div className="reports-grid">
        <div className="logs-section">
          <h3>Calendário de Manutenção</h3>
          <table className="logs-table">
            <thead>
              <tr>
                <th>Frequência</th>
                <th>Tarefa</th>
                <th>Status do Log</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Diária</strong></td>
                <td>Backup do Banco de Dados</td>
                <td><span className="status-ok">Realizado</span></td>
              </tr>
              <tr>
                <td><strong>Semanal</strong></td>
                <td>Verificação de Logs de Segurança</td>
                <td><span className="status-ok">Realizado</span></td>
              </tr>
              <tr>
                <td><strong>Mensal</strong></td>
                <td>Atualizações de Segurança</td>
                <td><span className="status-warn">Pendente</span></td>
              </tr>
              <tr>
                <td><strong>Trimestral</strong></td>
                <td>Revisão de Desempenho</td>
                <td><span className="status-ok">No Prazo</span></td>
              </tr>
              <tr>
                <td><strong>Anual</strong></td>
                <td>Auditoria Completa</td>
                <td><span className="status-ok">Agendado</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="logs-section norm-section">
          <h3>Conformidade com Normas ISO</h3>
          <ul className="norm-list">
            <li><strong>ISO/IEC 12207:</strong> Ciclo de vida do software implementado.</li>
            <li><strong>ISO/IEC 14764:</strong> Manutenção (Corretiva, Adaptativa, Evolutiva, Preventiva).</li>
            <li><strong>ISO/IEC 9126:</strong> Requisitos de qualidade de software.</li>
            <li><strong>ISO/IEC 20000:</strong> Gestão de serviços de TI e SLA.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}