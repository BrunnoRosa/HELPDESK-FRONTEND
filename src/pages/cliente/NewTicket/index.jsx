import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamadoApi } from '../../../services/api';
import './style.css';

const initialFormData = {
  tituloChamado: '',
  ocorrenciaChamado: 'INFORMATICA',
  descricaoChamado: '',
  prioridadeChamado: 'MEDIA',
  imagemChamado: '', // Novo campo para guardar a imagem em Base64
};

export default function NewTicket() {
  const [formData, setFormData] = useState(initialFormData);
  const [previewImagem, setPreviewImagem] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para ler o arquivo e converter para Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validação de tamanho (máximo 2MB para não pesar a requisição)
      if (file.size > 2 * 1024 * 1024) {
        setErro('A imagem selecionada deve ter no máximo 2MB.');
        return;
      }

      setErro('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagemChamado: reader.result }));
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover a imagem selecionada
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imagemChamado: '' }));
    setPreviewImagem('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      await chamadoApi.criar(formData);
      setFormData(initialFormData);
      setPreviewImagem('');
      alert('Chamado criado com sucesso!');
      navigate('/');
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
        <p className="subtitle">
          Preencha os dados detalhados abaixo, incluindo informações do equipamento e evidências fotográficas.
        </p>

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

          {/* NOVO CAMPO: Evidência / Anexo de Imagem */}
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