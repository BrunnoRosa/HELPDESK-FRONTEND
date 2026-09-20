import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authApi } from '../../../services/api';
import { notify } from '../../../components/Notification';
import './style.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await authApi.login({
        email,
        senha: password,
      });

      login(loginResponse);

      const perfilUsuario = loginResponse.perfil;

      if (perfilUsuario === 'ADMINISTRADOR') {
        navigate('/admin');
      } else if (perfilUsuario === 'TECNICO') {
        navigate('/tecnico');
      } else {
        navigate('/chamados');
      }
      
    } catch (error) {
      console.error('Não foi possível realizar o login:', error.message);
      // Dispara a notificação flutuante diretamente no erro
      notify('error', 'Erro ao logar. Verifique as credenciais.');
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
      </form>
    </div>
  );
}