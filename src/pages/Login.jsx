import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {user, login } = useAuth();

  const navigate = useNavigate();

  // Redireciona automaticamente assim que o estado do usuário for atualizado
  useEffect(() => {
    if (user) {
      navigate('/dashboard'); // Ou '/' dependendo de como está no seu App.jsx
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    await login(email, password);
    navigate('/dashboard'); // <-- Garanta que está em minúsculo
  } catch (err) {
    setError(err.response?.data?.error || 'Erro ao realizar login');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">GLPI Desk</h1>
          <p className="text-gray-400 mt-2">Sistema de Gestão de Chamados</p>
          
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200"
          >
            Entrar no Sistema
          </button>
          
        </form>
        {/* --- ADICIONE AQUI --- */}
        <div className="mt-6 text-center border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400">
            Ainda não tem acesso?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition">
              Criar nova conta
            </Link>
          </p>
        </div>
        {/* ---------------------- */}

        <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
          <p className="font-semibold text-gray-400">Contas de teste (Senha: 123456):</p>
          <p>Cliente: cliente@empresa.com | N1: n1@glpi.com</p>
          <p>N2: n2@glpi.com | N3: n3@glpi.com</p>
          
        </div>
      </div>
    </div>
  );
}