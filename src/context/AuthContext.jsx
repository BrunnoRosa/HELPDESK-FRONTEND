import { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Já iniciamos com um usuário preenchido para pular a tela de login!
  const [user, setUser] = useState({
    id: 1,
    name: 'Administrador do Sistema',
    email: 'admin@glpidesk.com',
    role: 'N1' 
  });
  
  // O loading já começa falso para a tela abrir na mesma hora
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    // Mantemos a função aqui para o futuro, caso precise
    const mockUser = { id: 1, name: 'Usuário Teste', email, role: 'N1' };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null); // Se você clicar no botão "Sair" lá no Header, ele te joga pro Login
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);