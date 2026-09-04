import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Inicializa o estado buscando o usuário persistido, se houver
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('@GLPI:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);

  // Recebe o LoginResponseDTO já retornado pela API e normaliza o usuário
  // para o formato esperado pelos componentes React.
  const login = (loginResponse) => {
    const { token, id, nome, email, perfil } = loginResponse;

    if (!token) {
      throw new Error('A resposta de login não contém um token.');
    }

    const mappedUser = {
      id,
      name: nome,
      email,
      role: perfil,
    };

    localStorage.setItem('@GLPI:token', token);
    localStorage.setItem('@GLPI:user', JSON.stringify(mappedUser));
    setUser(mappedUser);
  };

  const logout = () => {
    localStorage.removeItem('@GLPI:token');
    localStorage.removeItem('@GLPI:user');
    setUser(null);
  };

  // Desloga automaticamente caso o interceptador do Axios detecte token expirado (401)
  useEffect(() => {
    const handleAuthExpired = () => logout();
    window.addEventListener('helpdesk-auth-expired', handleAuthExpired);
    return () => window.removeEventListener('helpdesk-auth-expired', handleAuthExpired);
  }, []);

  // useMemo evita renderizações desnecessárias nos componentes que consomem o contexto
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
