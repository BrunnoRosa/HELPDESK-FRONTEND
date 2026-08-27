import { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Lê o perfil do arquivo .env.local da máquina que está rodando
  const perfilAutomatico = import.meta.env.VITE_MEU_PERFIL || 'CLIENTE';

  const [user, setUser] = useState({
    id: 1,
    name: perfilAutomatico === 'CLIENTE' ? 'Cliente Teste' : 'Técnico Suporte',
    email: perfilAutomatico === 'CLIENTE' ? 'cliente@empresa.com' : 'tecnico@empresa.com',
    role: perfilAutomatico
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    // Simula login mantendo o perfil da máquina
    const mockUser = { id: 1, name: 'Usuário', email, role: perfilAutomatico };
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