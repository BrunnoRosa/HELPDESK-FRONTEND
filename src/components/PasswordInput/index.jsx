import { useState } from 'react';
import './style.css';

/**
 * Calcula a força de uma senha e devolve o nível (1 a 4), o rótulo
 * e o percentual de preenchimento da barra, para exibição "por faixa".
 * @param {string} password
 */
export function getPasswordStrength(password = '') {
  if (!password) {
    return { level: 0, label: '', percent: 0 };
  }

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { level: 1, label: 'Muito fraca', percent: 25 };
  if (score === 2) return { level: 2, label: 'Fraca', percent: 50 };
  if (score === 3) return { level: 3, label: 'Média', percent: 75 };
  return { level: 4, label: 'Forte', percent: 100 };
}

/**
 * Campo de senha reutilizável com botão de "olhinho" para mostrar/ocultar
 * o texto digitado e, opcionalmente, um medidor de força por faixa
 * (usado nas telas de criação/definição de nova senha).
 */
export default function PasswordInput({
  value,
  onChange,
  showStrength = false,
  placeholder,
  required = false,
  name,
  id,
  autoComplete,
  minLength,
}) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className="password-field">
      <div className="password-input-wrapper">
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className="password-input"
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          title={visible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {visible ? (
            // Ícone de olho cortado: senha atualmente visível
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            // Ícone de olho aberto: senha atualmente oculta
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      </div>

      {showStrength && value && (
        <div className="password-strength" data-level={strength.level}>
          <div className="password-strength-bar">
            <span style={{ width: `${strength.percent}%` }} />
          </div>
          <span className="password-strength-label">{strength.label}</span>
        </div>
      )}
    </div>
  );
}
