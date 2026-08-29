import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Inicializa o estado buscando o usuário persistido, se houver
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('@GLPI:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);

  // Função de login que será chamada após o sucesso da api.login()
  const login = (backendData) => {
    // Garante compatibilidade mapeando os dados da API para o padrão do HELPDESK-FRONT
    const token = backendData.token;
    const mappedUser = {
      id: backendData.id || backendData.usuario?.id,
      name: backendData.nome || backendData.usuario?.nome || 'Usuário',
      email: backendData.email || backendData.usuario?.email,
      role: backendData.perfil || backendData.usuario?.perfil || 'CLIENTE',
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