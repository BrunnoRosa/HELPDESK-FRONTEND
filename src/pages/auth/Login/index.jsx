import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './style.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Se a função login() do contexto falhar por falta de Back-end,
      // podemos redirecionar diretamente para o Dashboard do cliente durante os testes:
      if (login) {
        await login(email, password);
      }
      navigate('/');
    } catch (error) {
      console.warn('Back-end offline. Redirecionando em modo de teste...');
      // Redireciona mesmo em caso de erro para você conseguir testar o Front-end
      navigate('/'); 
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
        
        <button type="submit" className="btn-primary">Entrar no Sistema</button>
        <div className="auth-links">
          <span>Ainda não tem acesso? <Link to="/register">Criar nova conta</Link></span>
        </div>
      </form>
    </div>
  );
}