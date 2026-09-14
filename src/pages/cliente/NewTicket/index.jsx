import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamadoApi } from '../../../services/api';
import Notification from '../../../components/Notification';
import './style.css';

const initialFormData = {
  tituloChamado: '',
  ocorrenciaChamado: 'INFORMATICA',
  descricaoChamado: '',
  prioridadeChamado: 'BAIXA', // Valor padrão chumbado, invisível para o cliente
  imagemChamado: '',
};

export default function NewTicket() {
  const [formData, setFormData] = useState(initialFormData);
  const [previewImagem, setPreviewImagem] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [salvando, setSalvando] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFeedback({ type: 'error', message: 'A imagem selecionada deve ter no máximo 2MB.' });
        return;
      }
      setFeedback({ type: '', message: '' });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagemChamado: reader.result }));
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imagemChamado: '' }));
    setPreviewImagem('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    setSalvando(true);

    try {
      await chamadoApi.criar(formData);
      setFormData(initialFormData);
      setPreviewImagem('');
      setFeedback({ type: 'success', message: 'Chamado criado com sucesso! Redirecionando...' });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Erro ao salvar chamado. Verifique seus dados e tente novamente.',
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="new-ticket-container">
      <div className="new-ticket-card">
        <h2>Abrir Novo Chamado</h2>
        <p className="subtitle">
          Preencha os dados detalhados abaixo, incluindo informações do equipamento e evidências fotográficas.
        </p>

        {/* Componente de Notificação Padronizado */}
        <Notification type={feedback.type} message={feedback.message} />

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
            <label>Evidência Fotográfica (Opcional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
            />
            {previewImagem && (
              <div className="image-preview-container">
                <img src={previewImagem} alt="Pré-visualização do anexo" />
                <button type="button" className="btn-remove-image" onClick={handleRemoveImage}>
                  Remover Foto
                </button>
              </div>
            )}
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