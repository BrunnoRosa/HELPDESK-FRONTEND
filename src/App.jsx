import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Adicione esta linha!
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import TicketDetails from './pages/TicketDetails';

function PrivateRoute({ children }) {
  const { signed, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  return signed ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Rota do Painel Principal */}
       <Route path="/dashboard" element={<Dashboard />} />

        {/* Redireciona a raiz "/" diretamente para o "/dashboard" */}
        {/*<Route path="/" element={<Navigate to="/dashboard" replace />} />*/}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/novo-chamado"
            element={
              <PrivateRoute>
                <NewTicket />
              </PrivateRoute>
            }
          />
          <Route
            path="/chamados/:id"
            element={
              <PrivateRoute>
                <TicketDetails />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}