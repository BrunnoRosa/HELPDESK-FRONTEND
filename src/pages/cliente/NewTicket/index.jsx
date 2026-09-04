import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamadoApi } from '../../../services/api';
import './style.css';

const initialFormData = {
  tituloChamado: '',
  ocorrenciaChamado: 'INFORMATICA',
  descricaoChamado: '',
  prioridadeChamado: 'MEDIA',
};

export default function NewTicket() {
  const [formData, setFormData] = useState(initialFormData);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      await chamadoApi.criar(formData);
      setFormData(initialFormData);
      alert('Chamado criado com sucesso.');
    } catch (error) {
      setErro(error.message || 'Erro ao salvar chamado. Verifique seus dados e tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="new-ticket-container">
      <div className="new-ticket-card">
        <h2>Abrir Novo Chamado</h2>
        <p className="subtitle">Preencha os dados abaixo, incluindo informações do equipamento e evidências fotográficas.</p>

        {erro && <div className="error-box">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título / Problema Principal</label>
            <input 
              type="text" 
              name="tituloChamado"
              placeholder="Ex: Sistema ERP travando no login" 
              value={formData.tituloChamado}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição Detalhada</label>
            <textarea 
              name="descricaoChamado"
              rows="4"
              placeholder="Descreva o problema com o máximo de detalhes possível..."
              value={formData.descricaoChamado}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ocorrência</label>
              <select name="ocorrenciaChamado" value={formData.ocorrenciaChamado} onChange={handleChange}>
                <option value="INFORMATICA">Informática</option>
                <option value="IMPRESSORA">Impressora</option>
                <option value="ELETRICA">Elétrica</option>
                <option value="CLIMATIZACAO">Climatização</option>
                <option value="MOBILIA">Mobília</option>
                <option value="SISTEMAINCENDIO">Sistema de incêndio</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prioridade</label>
              <select name="prioridadeChamado" value={formData.prioridadeChamado} onChange={handleChange}>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/')} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Criar Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
