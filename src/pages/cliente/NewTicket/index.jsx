import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { chamadoApi } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import './style.css';

export default function NewTicket() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tituloChamado: '',
    ocorrenciaChamado: '',
    prioridadeChamado: 'Médio',
    empresa: user?.name || user?.nome || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tituloChamado || !formData.ocorrenciaChamado) {
      toast.warn('Preencha o título e a descrição da ocorrência.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        tituloChamado: formData.tituloChamado,
        ocorrenciaChamado: formData.ocorrenciaChamado,
        descricaoChamado: `Aberto por: ${user?.name || user?.nome || 'Cliente'} (${user?.email || 'N/A'})`,
        prioridadeChamado: formData.prioridadeChamado,
        statusChamado: 'Aberto',
        empresa: formData.empresa
      };

      await chamadoApi.criar(payload);
      toast.success('Chamado aberto com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Erro ao abrir chamado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-ticket-page" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2>Abrir Novo Chamado</h2>
        <p>Descreva o problema ou solicitação técnica detalhadamente.</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
            Título / Resumo da Ocorrência *
          </label>
          <input 
            type="text" 
            name="tituloChamado" 
            value={formData.tituloChamado} 
            onChange={handleChange} 
            placeholder="Ex: Erro ao acessar o sistema financeiro" 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
            Grau de Urgência Estimado
          </label>
          <select 
            name="prioridadeChamado" 
            value={formData.prioridadeChamado} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Baixo">Baixo (Dúvida / Solicitação Simples)</option>
            <option value="Médio">Médio (Problema isolado)</option>
            <option value="Alto">Alto (Sistema inoperante / Urgente)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
            Descrição Detalhada do Problema *
          </label>
          <textarea 
            name="ocorrenciaChamado" 
            rows="6" 
            value={formData.ocorrenciaChamado} 
            onChange={handleChange} 
            placeholder="Informe mensagens de erro, horário que ocorreu ou passos para reproduzir..." 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="btn-action"
            style={{ backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ padding: '10px 18px', borderRadius: '4px' }}
          >
            {loading ? 'Enviando...' : 'Criar Chamado'}
          </button>
        </div>
      </form>
    </div>
  );
}