import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Inicializa o estado buscando o usuário e o token persistidos
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('@GLPI:user');
    const token = localStorage.getItem('@GLPI:token');
    
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('@GLPI:user');
        localStorage.removeItem('@GLPI:token');
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  // Normaliza e padroniza as roles vindas de diferentes estruturas do Spring Boot
  const normalizeRole = (rawRole) => {
    if (!rawRole) return 'CLIENTE';
    const roleUpper = String(rawRole).toUpperCase();

    // Mapeamento para garantir consistência
    if (['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMIN'].includes(roleUpper)) return 'ADMIN';
    if (['N1', 'TECNICO_N1', 'ROLE_TECNICO_N1'].includes(roleUpper)) return 'N1';
    if (['N2', 'TECNICO_N2', 'ROLE_TECNICO_N2'].includes(roleUpper)) return 'N2';
    if (['N3', 'TECNICO_N3', 'ROLE_TECNICO_N3'].includes(roleUpper)) return 'N3';
    
    return 'CLIENTE';
  };

  // Função de login executada pós-autenticação na API
  const login = (backendData) => {
    const token = backendData.token || backendData.accessToken;
    const rawUser = backendData.usuario || backendData.user || backendData;

    const mappedUser = {
      id: rawUser.id,
      name: rawUser.nome || rawUser.name || 'Usuário',
      email: rawUser.email,
      role: normalizeRole(rawUser.perfil || rawUser.role),
      perfil: normalizeRole(rawUser.perfil || rawUser.role)
    };

    if (token) {
      localStorage.setItem('@GLPI:token', token);
    }
    localStorage.setItem('@GLPI:user', JSON.stringify(mappedUser));
    setUser(mappedUser);
  };

  const logout = () => {
    localStorage.removeItem('@GLPI:token');
    localStorage.removeItem('@GLPI:user');
    setUser(null);
  };

  // Desloga automaticamente caso o interceptador do Axios detecte token expirado/inválido (401/403)
  useEffect(() => {
    const handleAuthExpired = () => logout();
    window.addEventListener('helpdesk-auth-expired', handleAuthExpired);
    return () => window.removeEventListener('helpdesk-auth-expired', handleAuthExpired);
  }, []);

  const value = useMemo(() => ({
    user,
    signed: !!user,
    loading,
    setLoading,
    login,
    logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);