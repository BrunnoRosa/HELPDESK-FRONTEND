import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function NewTicket() {
  const [empresa, setEmpresa] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('NORMAL');
  const [arquivo, setArquivo] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // 1. Cria o objeto com os dados preenchidos no formulário
      const novoChamado = {
        id: Date.now(), // Gera um ID único numérico
        empresa,
        equipamento,
        titulo,
        descricao,
        prioridade,
        status: 'NOVO',
        createdAt: new Date().toLocaleDateString('pt-BR')
      };

      // 2. Busca os chamados existentes no localStorage ou inicia uma lista vazia
      const chamadosSalvos = JSON.parse(localStorage.getItem('@glpi:tickets')) || [];

      // 3. Adiciona o novo chamado no início da lista
      chamadosSalvos.unshift(novoChamado);

      // 4. Salva a lista atualizada no localStorage
      localStorage.setItem('@glpi:tickets', JSON.stringify(chamadosSalvos));

      alert('Chamado criado com sucesso! (Salvo localmente)');
      navigate('/');
    } catch (error) {
      alert('Erro ao salvar chamado. Tente novamente.');
    }
  };

  return (
    <div className="new-ticket-container">
      <div className="new-ticket-card">
        <h2>Abrir Novo Chamado</h2>
        <p className="subtitle">Preencha os dados abaixo, incluindo informações do equipamento e evidências fotográficas.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Solicitante (Setor/Empresa)</label>
            <input 
              type="text" 
              placeholder="Ex: Setor Financeiro" 
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Equipamento (Patrimônio ou Modelo)</label>
            <input 
              type="text" 
              placeholder="Ex: Desktop Samsung (Patrimônio 090988)" 
              value={equipamento}
              onChange={(e) => setEquipamento(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Título / Problema Principal</label>
            <input 
              type="text" 
              placeholder="Ex: Sistema ERP travando no login" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição Detalhada</label>
            <textarea 
              rows="4"
              placeholder="Descreva o problema com o máximo de detalhes possível..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prioridade</label>
              <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                <option value="BAIXA">Baixa</option>
                <option value="NORMAL">Normal</option>
                <option value="ALTA">Alta</option>
                <option value="CRÍTICA">Crítica</option>
              </select>
            </div>

            <div className="form-group">
              <label>Anexar Evidência (Foto/Print)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setArquivo(e.target.files[0])}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Criar Chamado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}