import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { authApi } from '../../../services/api';
import './style.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const responseData = await authApi.login({ email, senha: password });

      // Salva o token e atualiza o estado global no AuthContext
      login(responseData);

      toast.success('Login realizado com sucesso!');
      
      // O IndexRouter cuidará do redirecionamento com base no perfil (Cliente, Técnico ou Admin)
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Falha ao realizar login. Verifique e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>GLPI Desk</h2>
        <p className="auth-subtitle">Sistema de Gestão de Chamados</p>

        <label>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu.email@empresa.com"
          required
        />

        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar no Sistema'}
        </button>

        <div className="auth-links">
          <span>Ainda não tem acesso? <Link to="/register">Criar nova conta</Link></span>
        </div>
      </form>
    </div>
  );
}