import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ajuste o caminho conforme a estrutura da sua pasta
import './style.css'; // Importação do CSS

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIA');
  const [equipmentId, setEquipmentId] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/equipments')
       .then((res) => setEquipments(res.data))
       .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tickets', {
        title,
        description,
        priority,
        equipmentId: equipmentId || null,
      });
      navigate('/');
    } catch (err) {
      alert('Erro ao abrir chamado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-ticket-container">
      <div className="new-ticket-card">
        <h2 className="new-ticket-title">Abrir Novo Chamado</h2>

        <form onSubmit={handleSubmit} className="new-ticket-form">
          <div className="form-group">
            <label className="form-label">Título do Incidente</label>
            <input
              type="text"
              required
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição Detalhada</label>
            <textarea
              required
              rows={4}
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Prioridade</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Equipamento (Opcional)</label>
              <select
                className="form-control"
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
              >
                <option value="">Nenhum equipamento</option>
                {equipments.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} ({eq.serialNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Enviando...' : 'Criar Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}