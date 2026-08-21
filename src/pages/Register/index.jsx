import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; // Ajuste o caminho conforme a estrutura do seu projeto
import './style.css'; // Importação do CSS

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
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Criar Conta no GLPI</h2>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="register-form">
          <input 
            type="text" 
            placeholder="Nome Completo" 
            required 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          
          <input 
            type="email" 
            placeholder="E-mail" 
            required 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <input 
            type="password" 
            placeholder="Senha" 
            required 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <input 
            type="text" 
            placeholder="Empresa (Opcional)" 
            className="form-control" 
            value={company} 
            onChange={(e) => setCompany(e.target.value)} 
          />
          
          <select 
            className="form-control form-select" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="CLIENTE">Cliente / Solicitante</option>
            <option value="Nível 1">Técnico Nível 1 (Triagem)</option>
            <option value="Nível 2">Especialista Nível 2</option>
            <option value="Nível 3">Engenharia Nível 3</option>
          </select>

          <button type="submit" className="btn-submit">
            Cadastrar Conta
          </button>
        </form>

        <p className="register-footer">
          Já possui conta? <Link to="/login" className="register-link">Voltar para Login</Link>
        </p>
      </div>
    </div>
  );
}