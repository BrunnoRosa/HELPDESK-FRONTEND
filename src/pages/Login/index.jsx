import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho se necessário (context ou contexts)
import { useNavigate, Link } from 'react-router-dom';
import './style.css'; // Importação do CSS

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login } = useAuth();

  const navigate = useNavigate();

  // Redireciona automaticamente assim que o estado do usuário for atualizado
  useEffect(() => {
    if (user) {
      navigate('/dashboard'); 
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao realizar login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">GLPI Desk</h1>
          <p className="login-subtitle">Sistema de Gestão de Chamados</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit">
            Entrar no Sistema
          </button>
        </form>

        <div className="register-section">
          <p>
            Ainda não tem acesso?{' '}
            <Link to="/register" className="register-link">
              Criar nova conta
            </Link>
          </p>
        </div>

        <div className="test-accounts">
          <p className="test-accounts-title">Contas de teste (Senha: 123456):</p>
          <p>Cliente: cliente@empresa.com | N1: n1@glpi.com</p>
          <p>N2: n2@glpi.com | N3: n3@glpi.com</p>
        </div>
      </div>
    </div>
  );
}