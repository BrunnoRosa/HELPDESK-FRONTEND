import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { chamadoApi } from '../../services/api';

export default function NovoChamado() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tituloChamado: '',
    descricaoChamado: '',
    prioridadeChamado: 'MEDIA', // Enum Criticidade
    ocorrenciaChamado: 'INFORMATICA' // Enum Ocorrencia
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tituloChamado.trim() || !formData.descricaoChamado.trim()) {
      toast.warn('Preencha todos os campos obrigatórios!');
      return;
    }

    setLoading(true);

    try {
      // Payload formatado de acordo com as propriedades do ChamadoRequestDTO
      const payload = {
        tituloChamado: formData.tituloChamado,
        descricaoChamado: formData.descricaoChamado,
        prioridadeChamado: formData.prioridadeChamado,
        ocorrenciaChamado: formData.ocorrenciaChamado
      };

      await chamadoApi.criar(payload);
      toast.success('Chamado aberto com sucesso!');
      navigate('/cliente/chamados');
    } catch (error) {
      console.error('Erro detalhado no backend:', error.response?.data);

      const mensagemBackend =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.defaultMessage ||
        'Erro ao criar o chamado. Verifique os dados fornecidos.';

      toast.error(mensagemBackend);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Abrir Novo Chamado</h1>
      <p className="text-gray-600 mb-6">Descreva o problema ou solicitação técnica detalhadamente.</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título / Resumo da Ocorrência *</label>
          <input
            type="text"
            name="tituloChamado"
            value={formData.tituloChamado}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Teclado parou de funcionar"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria da Ocorrência *</label>
          <select
            name="ocorrenciaChamado"
            value={formData.ocorrenciaChamado}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="INFORMATICA">Informática (Monitor / Computador / Mouse / Teclado)</option>
            <option value="IMPRESSORA">Impressora (Jato de Tinta / Fiscal / Laser)</option>
            <option value="ELETRICA">Elétrica (Iluminação / Tomadas / Interruptores)</option>
            <option value="CLIMATIZACAO">Climatização (Ar-Condicionado / Exaustor / Ventilador)</option>
            <option value="MOBILIA">Mobília (Mesa / Cadeira / Banqueta / Armário)</option>
            <option value="SISTEMAINCENDIO">Sistema de Incêndio (Extintores / Hidrante)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Grau de Urgência Estimado *</label>
          <select
            name="prioridadeChamado"
            value={formData.prioridadeChamado}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição Detalhada do Problema *</label>
          <textarea
            name="descricaoChamado"
            rows="5"
            value={formData.descricaoChamado}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Detalhe os sintomas e equipamentos envolvidos..."
            required
          ></textarea>
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/cliente/chamados')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Enviando...' : 'Criar Chamado'}
          </button>
        </div>
      </form>
    </div>
  );
}