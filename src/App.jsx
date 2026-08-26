import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Importação dos componentes de estrutura
import Layout from './components/Layout';
import Protected from './components/Protected';

// Importação das Páginas - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Importação das Páginas - Cliente
import ClienteDashboard from './pages/cliente/ClienteDashboard';
import NewTicket from './pages/cliente/NewTicket';
import ClientTicketDetails from './pages/cliente/ClienteTicketDetails';

// Importação das Páginas - Técnico
import TechDashboard from './pages/tech/TechDashboard';
import TechTicketDetails from './pages/tech/TechTicketDetails';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas Privadas (Envelopadas pelo Layout) */}
          <Route 
            path="/" 
            element={
              <Protected>
                <Layout />
              </Protected>
            }
          >
            {/* Visão do Cliente */}
            <Route index element={<ClienteDashboard />} />
            <Route path="cliente/novo-chamado" element={<NewTicket />} />
            <Route path="cliente/chamado/:id" element={<ClientTicketDetails />} />

            {/* Visão do Técnico */}
            <Route path="tecnico/dashboard" element={<TechDashboard />} />
            <Route path="tecnico/chamado/:id" element={<TechTicketDetails />} />
          </Route>

          {/* Redirecionamento caso a rota não exista */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}