import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Notification from '../../components/Notification';
import { usuarioApi } from '../../services/api';
import './style.css';

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Carrega a foto do localStorage (se existir) para simular persistência no front
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem(`user_avatar_${user?.email}`) || null;
  });

  // Estados do formulário de troca de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de feedback visual
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Iniciais do nome para o avatar padrão
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Handler para seleção da foto de perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
        setFeedback({ type: 'error', message: 'A imagem deve ter no máximo 2MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setAvatarUrl(base64Image);
        if (user?.email) {
          localStorage.setItem(`user_avatar_${user.email}`, base64Image);
        }
        setFeedback({ type: 'success', message: 'Foto de perfil atualizada localmente!' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'A confirmação de senha não coincide.' });
      return;
    }

    setLoading(true);

    try {
      await usuarioApi.alterarSenha({
        senhaAtual: currentPassword,
        novaSenha: newPassword,
        confirmarNovaSenha: confirmPassword
      });

      setFeedback({ type: 'success', message: 'Senha alterada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setFeedback({ 
        type: 'error', 
        message: err.message || 'Erro ao alterar a senha. Verifique a senha atual.' 
      });
    } finally {
      setLoading(false);
    }
  }; // Chave de fechamento da função que estava faltando

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Meu Perfil</h2>
        <p>Gerencie as informações e a segurança da sua conta.</p>
      </div>

      {/* Card 1: Informações do Usuário */}
      <div className="profile-card">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <div 
          className="profile-avatar-large" 
          onClick={() => fileInputRef.current?.click()}
          title="Clique para alterar a foto"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Foto de Perfil" className="avatar-image" />
          ) : (
            getUserInitials(user?.name)
          )}
          <div className="avatar-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <label>Nome</label>
            <p>{user?.name || 'Usuário'}</p>
          </div>

          <div className="profile-field">
            <label>E-mail</label>
            <p>{user?.email || 'Não cadastrado'}</p>
          </div>

          <div className="profile-field">
            <label>Nível de Acesso</label>
            <span className="role-badge">{user?.role || 'USUARIO'}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Alteração de Senha */}
      <div className="profile-card password-card">
        <h3>Segurança</h3>
        <p className="card-subtitle">Atualize sua senha de acesso ao sistema.</p>

        <Notification type={feedback.type} message={feedback.message} />

        <form onSubmit={handlePasswordSubmit} className="password-form">
          <div className="form-group">
            <label>Senha Atual</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nova Senha</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="form-group">
              <label>Confirmar Nova Senha</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
              />
            </div>
          </div>

          <button type="submit" className="btn-save-password" disabled={loading}>
            {loading ? 'Salvando...' : 'Atualizar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}