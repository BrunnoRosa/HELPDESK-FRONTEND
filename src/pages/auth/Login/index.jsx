import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authApi } from '../../../services/api';
import Notification from '../../../components/Notification';
import './style.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const loginResponse = await authApi.login({
        email,
        senha: password,
      });

      // Salva os dados no Contexto
      login(loginResponse);

      // REDIRECIONAMENTO CORRETO BASEADO NO PERFIL
      // Verifica qual é o perfil que veio do backend
      const perfilUsuario = loginResponse.perfil; 

      if (perfilUsuario === 'ADMINISTRADOR') {
        navigate('/admin'); // Mande o Admin para a rota de Admin que você criou
      } else if (perfilUsuario === 'TECNICO') {
        navigate('/tecnico'); // (Deixe a tela do técnico para o seu colega)
      } else {
        navigate('/cliente'); // Rota de cliente/usuário comum
      }
      
    } catch (error) {
      console.error('Não foi possível realizar o login:', error.message);
      setErro('Erro ao logar. Verifique as credenciais.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>GLPI Desk</h2>
        <p className="auth-subtitle">Sistema de Gestão de Chamados</p>
        {erro && <Notification type="error" message={erro} />}
        
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
