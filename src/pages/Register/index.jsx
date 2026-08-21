import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './style.css'; // Compartilha o estilo base do Login (crie um arquivo unificado se preferir)

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CLIENTE' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', formData);
      alert('Conta criada com sucesso!');
      navigate('/login');
    } catch (error) {
      alert('Erro ao criar conta.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Nova Conta</h2>
        
        <label>Nome Completo</label>
        <input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        
        <label>E-mail</label>
        <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        
        <label>Senha</label>
        <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        
        <label>Perfil</label>
        <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
          <option value="CLIENTE">Cliente (Solicitante)</option>
          <option value="N1">Suporte N1 (Triagem)</option>
          <option value="N2">Suporte N2 (Especializado)</option>
        </select>
        
        <button type="submit" className="btn-primary">Registrar</button>
        <div className="auth-links">
          <Link to="/login">Voltar ao Login</Link>
        </div>
      </form>
    </div>
  );
}