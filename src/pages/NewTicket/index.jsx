import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function NewTicket() {
  // Variáveis agora 100% em português
  const [empresa, setEmpresa] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('NORMAL');
  const [arquivo, setArquivo] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simulação do envio (Substituiremos pelo api.post no futuro)
    console.log("Dados do chamado:", { empresa, equipamento, titulo, descricao, prioridade, arquivo });
    
    alert('Chamado aberto com sucesso! (Simulação)');
    navigate('/');
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h3>Abrir Novo Chamado</h3>
        <p>Preencha os dados abaixo, incluindo informações do equipamento e evidências fotográficas.</p>
      </div>

      <form onSubmit={handleSubmit} className="ticket-form">
        
        {/* Identificação da Empresa ou Setor */}
        <div className="form-group">
          <label>Solicitante (Setor)</label>
          <input 
            type="text" 
            value={empresa} 
            onChange={e => setEmpresa(e.target.value)} 
            placeholder="Ex: Setor Financeiro"
            required 
          />
        </div>

        {/* Informações do Equipamento */}
        <div className="form-group">
          <label>Equipamento (Patrimônio ou Modelo)</label>
          <input 
            type="text" 
            value={equipamento} 
            onChange={e => setEquipamento(e.target.value)} 
            placeholder="Ex: Desktop Dell (Patrimônio 12345)"
            required 
          />
        </div>

        <div className="form-group">
          <label>Título do Incidente</label>
          <input 
            type="text"
            value={titulo} 
            onChange={e => setTitulo(e.target.value)} 
            placeholder="Ex: Tela do monitor ficou azul"
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Descrição Detalhada</label>
          <textarea 
            rows="5" 
            value={descricao} 
            onChange={e => setDescricao(e.target.value)} 
            placeholder="Descreva a falha, como e quando ocorreu..."
            required 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Prioridade</label>
            <select value={prioridade} onChange={e => setPrioridade(e.target.value)}>
              <option value="BAIXA">Baixa</option>
              <option value="NORMAL">Normal</option>
              <option value="ALTA">Alta</option>
              <option value="CRÍTICA">Crítica</option>
            </select>
          </div>

          {/* Anexo de Evidências */}
          <div className="form-group">
            <label>Anexar Evidência (Foto/Print)</label>
            <input 
              type="file" 
              accept="image/*, .pdf" 
              onChange={e => setArquivo(e.target.files[0])} 
              className="file-input"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn-cancel">Cancelar</button>
          <button type="submit" className="btn-submit">Criar Chamado</button>
        </div>
      </form>
    </div>
  );
}