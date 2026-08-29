import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function NewTicket() {
  const [formData, setFormData] = useState({
    empresa: '',
    equipamento: '',
    titulo: '',
    ocorrencia: 'INCIDENTE',
    descricao: ''
  });
  
  const [arquivo, setArquivo] = useState(null);
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
      await new Promise(resolve => setTimeout(resolve, 800));

      const novoChamado = {
        id: Date.now(),
        ...formData,
        status: 'NOVO',
        createdAt: new Date().toLocaleDateString('pt-BR')
      };

      const chamadosSalvos = JSON.parse(localStorage.getItem('@glpi:tickets')) || [];
      chamadosSalvos.unshift(novoChamado);
      localStorage.setItem('@glpi:tickets', JSON.stringify(chamadosSalvos));

      navigate('/cliente');
    } catch (error) {
      setErro('Erro ao salvar chamado. Verifique seus dados e tente novamente.');
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
            <label>Solicitante (Setor/Empresa)</label>
            <input 
              type="text" 
              name="empresa"
              placeholder="Ex: Setor Financeiro" 
              value={formData.empresa}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Equipamento (Patrimônio ou Modelo)</label>
            <input 
              type="text" 
              name="equipamento"
              placeholder="Ex: Desktop Samsung (Patrimônio 090988)" 
              value={formData.equipamento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Título / Problema Principal</label>
            <input 
              type="text" 
              name="titulo"
              placeholder="Ex: Sistema ERP travando no login" 
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição Detalhada</label>
            <textarea 
              name="descricao"
              rows="4"
              placeholder="Descreva o problema com o máximo de detalhes possível..."
              value={formData.descricao}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ocorrência</label>
              <select name="ocorrencia" value={formData.ocorrencia} onChange={handleChange}>
                <option value="INCIDENTE">Incidente (Falha)</option>
                <option value="REQUISICAO">Requisição (Novo Acesso/Equipamento)</option>
                <option value="DUVIDA">Dúvida</option>
              </select>
            </div>

            <div className="form-group">
              <label>Anexar Evidência</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setArquivo(e.target.files[0])}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/cliente')} disabled={salvando}>
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