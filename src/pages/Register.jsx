import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENTE');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { name, email, password, role, company });
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-blue-500 text-center mb-6">Criar Conta no GLPI</h2>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Nome Completo" required className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="E-mail" required className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" required className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="text" placeholder="Empresa (Opcional)" className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white" value={company} onChange={(e) => setCompany(e.target.value)} />
          
          <select className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="CLIENTE">Cliente / Solicitante</option>
            <option value="Nível 1">Técnico Nível 1 (Triagem)</option>
            <option value="Nível 2">Especialista Nível 2</option>
            <option value="Nível 3">Engenharia Nível 3</option>
          </select>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition">
            Cadastrar Conta
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Já possui conta? <Link to="/login" className="text-blue-400 hover:underline">Voltar para Login</Link>
        </p>
      </div>
    </div>
  );
}