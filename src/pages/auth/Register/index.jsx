import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';
import './style.css'; 

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
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
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
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        />
        
        <label>Perfil</label>
        <select 
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="CLIENTE">Cliente (Solicitante)</option>
          <option value="N1">Suporte N1 (Triagem)</option>
          <option value="N2">Suporte N2 (Especializado)</option>
          <option value="N3">Suporte N3 (Engenharia / Dev)</option>
        </select>
        
        <button type="submit" className="btn-primary">Registrar</button>
        <div className="auth-links">
          <Link to="/login">Voltar ao Login</Link>
        </div>
      </form>
    </div>
  );
}