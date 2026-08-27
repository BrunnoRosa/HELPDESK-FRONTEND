import { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Alterado a role de 'N1' para 'CLIENTE' para liberar as telas do Cliente
const [user, setUser] = useState({
    id: 1,
    name: 'Técnico Suporte',
    email: 'tecnico@empresa.com',
    role: 'N2' // O 'N2' avisa ao sistema que você é da equipe técnica
  });
  
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const mockUser = { id: 1, name: 'Usuário Teste', email, role: 'CLIENTE' };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);