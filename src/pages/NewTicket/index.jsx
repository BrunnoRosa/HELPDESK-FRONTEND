import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './style.css';

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tickets', { title, description, priority });
      alert('Chamado aberto com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao salvar chamado.');
    }
  };

  return (
    <div className="form-page">
      <h3>Abrir Novo Chamado</h3>
      <form onSubmit={handleSubmit} className="ticket-form">
        <label>Título do Incidente</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
        
        <label>Descrição Detalhada (Equipamento, falha, etc)</label>
        <textarea rows="5" value={description} onChange={e => setDescription(e.target.value)} required />
        
        <label>Prioridade</label>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="BAIXA">Baixa</option>
          <option value="NORMAL">Normal</option>
          <option value="ALTA">Alta</option>
          <option value="CRÍTICA">Crítica</option>
        </select>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn-cancel">Cancelar</button>
          <button type="submit" className="btn-submit">Criar Chamado</button>
        </div>
      </form>
    </div>
  );
}