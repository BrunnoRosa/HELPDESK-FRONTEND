import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css';

export default function ClientTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dados simulados do chamado (futuramente integrados com a API)
  const [chamado] = useState({
    id: id || '1',
    titulo: 'Sistema ERP travando no login',
    empresa: 'Setor Financeiro',
    equipamento: 'Desktop Dell - Patrimônio 004512',
    descricao: 'Ao tentar realizar o login no sistema ERP, a tela congela na mensagem "Carregando perfil" e fecha sozinha após 2 minutos.',
    status: 'EM ANDAMENTO',
    prioridade: 'ALTA',
    dataCriacao: '24/08/2026 às 14:30',
    imagemUrl: 'https://via.placeholder.com/600x300?text=Evidencia+do+Erro', // Exemplo de imagem anexada
  });

  const [historico, setHistorico] = useState([
    {
      id: 1,
      autor: 'Suporte Técnico (N1)',
      mensagem: 'Olá! Recebemos seu chamado. Estamos analisando os logs do servidor ERP.',
      data: '24/08/2026 15:00',
      tipo: 'tech',
    },
    {
      id: 2,
      autor: 'Você',
      mensagem: 'Obrigado! O erro acontece com todos aqui do setor financeiro.',
      data: '24/08/2026 15:10',
      tipo: 'client',
    },
  ]);

  const [novoComentario, setNovoComentario] = useState('');

  const handleEnviarComentario = (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    const novaMensagem = {
      id: Date.now(),
      autor: 'Você',
      mensagem: novoComentario,
      data: new Date().toLocaleString('pt-BR'),
      tipo: 'client',
    };

    setHistorico([...historico, novaMensagem]);
    setNovoComentario('');
  };

  return (
    <div className="details-container">
      {/* Botão de Voltar */}
      <button onClick={() => navigate('/')} className="btn-back">
        &larr; Voltar para Meus Chamados
      </button>

      {/* Cartão de Detalhes Principais */}
      <div className="details-card">
        <div className="details-header">
          <div>
            <span className="ticket-id">Chamado #{chamado.id}</span>
            <h2>{chamado.titulo}</h2>
          </div>
          <div className="badges-group">
            <span className={`badge status-${chamado.status.toLowerCase().replace(' ', '-')}`}>
              {chamado.status}
            </span>
            <span className={`badge badge-${chamado.prioridade.toLowerCase()}`}>
              Prioridade: {chamado.prioridade}
            </span>
          </div>
        </div>

        <div className="details-grid">
          <div className="info-item">
            <label>Solicitante / Setor</label>
            <p>{chamado.empresa}</p>
          </div>
          <div className="info-item">
            <label>Equipamento / Ativo</label>
            <p>{chamado.equipamento}</p>
          </div>
          <div className="info-item">
            <label>Data de Abertura</label>
            <p>{chamado.dataCriacao}</p>
          </div>
        </div>

        <div className="details-section">
          <label>Descrição do Problema</label>
          <p className="description-text">{chamado.descricao}</p>
        </div>

        {/* Anexo de Foto / Evidência */}
        {chamado.imagemUrl && (
          <div className="details-section">
            <label>Evidência Fotográfica Anexada</label>
            <div className="evidence-container">
              <img src={chamado.imagemUrl} alt="Evidência do problema" />
            </div>
          </div>
        )}
      </div>

      {/* Seção de Histórico de Interações / Comentários */}
      <div className="comments-card">
        <h3>Histórico do Atendimento</h3>

        <div className="comments-list">
          {historico.map((item) => (
            <div key={item.id} className={`comment-item ${item.tipo}`}>
              <div className="comment-header">
                <strong>{item.autor}</strong>
                <span>{item.data}</span>
              </div>
              <p>{item.mensagem}</p>
            </div>
          ))}
        </div>

        {/* Formulário para Enviar Nova Mensagem */}
        <form onSubmit={handleEnviarComentario} className="comment-form">
          <textarea
            rows="3"
            placeholder="Digite uma mensagem ou resposta para a equipe técnica..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
          />
          <button type="submit" className="btn-submit">
            Enviar Mensagem
          </button>
        </form>
      </div>
    </div>
  );
}