import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [supportLevel, setSupportLevel] = useState('');
  const [file, setFile] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
      setStatus(res.data.status);
      setSupportLevel(res.data.supportLevel);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/tickets/${id}/status`, {
        status,
        supportLevel,
        comment,
      });
      setComment('');
      fetchTicket();
    } catch (err) {
      alert('Erro ao atualizar chamado');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/tickets/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      fetchTicket();
    } catch (err) {
      alert('Erro ao enviar imagem');
    }
  };

  if (!ticket) return <div className="p-8 text-center text-gray-500">Carregando detalhes...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={() => navigate('/')} className="text-blue-600 font-semibold mb-4 hover:underline">
          ← Voltar para o Painel
        </button>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
              <p className="text-sm text-gray-500">
                Solicitado por <strong>{ticket.requester?.name}</strong> ({ticket.requester?.company || 'Sem empresa'})
              </p>
            </div>
            <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs">
              {ticket.status}
            </span>
          </div>

          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg mb-4">{ticket.description}</p>

          {ticket.equipment && (
            <div className="text-xs bg-amber-50 text-amber-800 p-3 rounded border border-amber-200 mb-4">
              📌 Equipamento Vinculado: <strong>{ticket.equipment.name}</strong> (S/N: {ticket.equipment.serialNumber}) - Local: {ticket.equipment.location}
            </div>
          )}

          {/* Controle de Fluxo N1/N2/N3 */}
          {user.role !== 'CLIENTE' && (
            <form onSubmit={handleUpdateStatus} className="mt-6 border-t pt-4 space-y-3">
              <h3 className="font-bold text-gray-800">Transição de Status & Nível de Suporte</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold">Status Atual</label>
                  <select
                    className="w-full border rounded p-2 text-sm mt-1"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="ABERTO">ABERTO</option>
                    <option value="EM_TRIAGEM">EM_TRIAGEM</option>
                    <option value="EM_ATENDIMENTO">EM_ATENDIMENTO</option>
                    <option value="PENDENTE_EVIDENCIA">PENDENTE_EVIDENCIA</option>
                    <option value="RESOLVIDO">RESOLVIDO</option>
                    <option value="FECHADO">FECHADO</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold">Nível Responsável</label>
                  <select
                    className="w-full border rounded p-2 text-sm mt-1"
                    value={supportLevel}
                    onChange={(e) => setSupportLevel(e.target.value)}
                  >
                    <option value="N1">Nível 1 (Triagem/Básico)</option>
                    <option value="N2">Nível 2 (Especializado)</option>
                    <option value="N3">Nível 3 (Engenharia/Dev)</option>
                  </select>
                </div>
              </div>
              <textarea
                placeholder="Adicionar parecer técnico ou nota de evolução..."
                className="w-full border rounded p-2 text-sm"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black font-semibold">
                Atualizar Estado
              </button>
            </form>
          )}
        </div>

        {/* Anexos de Evidência Fotográfica */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Evidências Fotográficas</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {ticket.attachments?.map((att) => (
              <a
                key={att.id}
                href={`http://localhost:3333/uploads/${att.filename}`}
                target="_blank"
                rel="noreferrer"
                className="border p-2 rounded hover:border-blue-500 block text-center bg-gray-50"
              >
                <img
                  src={`http://localhost:3333/uploads/${att.filename}`}
                  alt="Evidência"
                  className="h-28 w-full object-cover rounded mb-2"
                />
                <span className="text-xs text-gray-600 truncate block">{att.filename}</span>
              </a>
            ))}
          </div>

          <form onSubmit={handleFileUpload} className="flex items-center space-x-3 border-t pt-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700">
              Enviar Foto
            </button>
          </form>
        </div>

        {/* Histórico Auditável */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Histórico do Chamado</h3>
          <div className="space-y-4">
            {ticket.histories?.map((h) => (
              <div key={h.id} className="border-l-4 border-blue-500 pl-4 py-1 bg-gray-50/50 rounded-r p-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-gray-700">{h.author?.name} (Nível {h.supportLevel})</span>
                  <span>{new Date(h.createdAt).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-sm text-gray-800">{h.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}