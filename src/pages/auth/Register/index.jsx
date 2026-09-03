import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../../../services/api';
import './style.css';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: 'USUARIO' // Corresponde exatamente a PerfilUsuario.USUARIO
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.senha) {
      toast.warn('Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        perfil: formData.perfil
      };

      await authApi.registrar(payload);
      toast.success('Conta criada com sucesso! Faça login.');
      navigate('/login');
    } catch (error) {
      console.error('Erro detalhado no backend:', error.response?.data);
      
      const mensagemErro = 
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.defaultMessage || 
        'Erro ao realizar cadastro. Verifique os dados fornecidos.';

      toast.error(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Nova Conta</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="insira seu nome completo"
              required
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="insira seu e-mail"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="insira sua senha"
              required
            />
          </div>

          <div className="form-group">
            <label>Perfil de Acesso</label>
            <select name="perfil" value={formData.perfil} onChange={handleChange}>
              <option value="USUARIO">Cliente/Solicitante</option>
              <option value="TECNICO">Atendente/Suporte</option>
              <option value="ADMINISTRADOR">Gestão Global</option>
            </select>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Voltar ao Login</Link>
        </div>
      </div>
    </div>
  );
}