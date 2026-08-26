import { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Alterado a role de 'N1' para 'CLIENTE' para liberar as telas do Cliente
  const [user, setUser] = useState({
    id: 1,
    name: 'Camila Viana',
    email: 'camila@glpidesk.com',
    role: 'CLIENTE' // <- Mude de 'N1' para 'CLIENTE'
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