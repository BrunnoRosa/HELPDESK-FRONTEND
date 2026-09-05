import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../../services/api';
import './style.css'; 

export default function Register() {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', perfil: 'USUARIO' });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await authApi.register(formData);
      alert('Conta criada com sucesso!');
      navigate('/login');
    } catch (error) {
      setErro(error.message || 'Erro ao criar conta.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Nova Conta</h2>
        
        <label>Nome Completo</label>
        <input 
          type="text" 
          value={formData.nome}
          onChange={(e) => setFormData({...formData, nome: e.target.value})} 
          required 
        />
        
        <label>E-mail</label>
        <input 
          type="email" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />
        
        <label>Senha</label>
        <input 
          type="password" 
          value={formData.senha}
          onChange={(e) => setFormData({...formData, senha: e.target.value})} 
          minLength="6"
          required 
        />
        
        <label>Perfil</label>
        <select 
          value={formData.perfil} 
          onChange={(e) => setFormData({...formData, perfil: e.target.value})}
        >
          <option value="USUARIO">Cliente (Solicitante)</option>
          <option value="TECNICO">Suporte técnico</option>
          <option value="ADMINISTRADOR">Administrador</option>
        </select>

        {erro && <div className="error-box">{erro}</div>}
        
        <button type="submit" className="btn-primary">Registrar</button>
        <div className="auth-links">
          <Link to="/login">Voltar ao Login</Link>
        </div>
      </form>
    </div>
  );
}