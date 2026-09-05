import { useState } from 'react';
import { adminApi } from '../../../services/api';
import './style.css';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    perfilUsuario: 'USUARIO',
    nivelSuporte: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = { ...formData };
    if (payload.perfilUsuario !== 'TECNICO') {
      payload.nivelSuporte = null;
    }

    try {
      await adminApi.criarUsuario(payload);
      alert('Usuário cadastrado com sucesso!');
      setFormData({
        nomeCompleto: '', email: '', senha: '', perfilUsuario: 'USUARIO', nivelSuporte: ''
      });
    } catch (error) {
      alert(error.message || 'Erro ao cadastrar usuário. Verifique suas permissões.');
    }
  };

  return (
    <div className="admin-container">
      <h2>Painel Administrativo</h2>
      
      <section className="admin-section">
        <h3>Cadastrar Novo Acesso</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Nome Completo:</label>
          <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Senha Temporária:</label>
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />

          <label>Perfil do Usuário:</label>
          <select name="perfilUsuario" value={formData.perfilUsuario} onChange={handleChange}>
            <option value="USUARIO">Usuário Comum</option>
            <option value="TECNICO">Técnico</option>
            <option value="ADMINISTRADOR">Administrador</option>
          </select>

          {formData.perfilUsuario === 'TECNICO' && (
            <>
              <label>Nível de Suporte:</label>
              <select name="nivelSuporte" value={formData.nivelSuporte} onChange={handleChange} required>
                <option value="">Selecione o Nível...</option>
                <option value="N1">N1 - Triagem e Básico</option>
                <option value="N2">N2 - Especializado</option>
                <option value="N3">N3 - Engenharia</option>
              </select>
            </>
          )}

          <button type="submit">Cadastrar no Sistema</button>
        </form>
      </section>
    </div>
  );
}