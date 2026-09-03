import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexto (arquivo AuthContext.jsx dentro de src/context/)
import { AuthProvider, useAuth } from './context/AuthContext';

// Componentes de Estrutura
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas - Autenticação
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Páginas - Cliente
import ClienteDashboard from './pages/cliente/ClienteDashboard';
import NewTicket from './pages/cliente/NewTicket';
import ClienteTicketDetails from './pages/cliente/ClienteTicketDetails';

// Páginas - Técnico
import TechDashboard from './pages/tech/TechDashboard';
import TechTicketDetails from './pages/tech/TechTicketDetails';
import TechReports from './pages/tech/TechReports';

// Páginas - Administração
import AdminDashboard from './pages/admin/AdminDashboard';

// Componente que direciona o usuário para o seu Dashboard conforme o Perfil/Role
function IndexRouter() {
  const { user } = useAuth();
  const role = user?.role || user?.perfil;

  if (role === 'ADMIN') {
    return <AdminDashboard />;
  }

  const isTech = ['N1', 'N2', 'N3', 'TECNICO_N1', 'TECNICO_N2', 'TECNICO_N3'].includes(role);
  
  if (isTech) {
    return <TechDashboard />;
  }

  return <ClienteDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Notificações do Toastify */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas Privadas */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* O "index" carrega o roteador inteligente conforme o perfil */}
            <Route index element={<IndexRouter />} />
            
            {/* Visão do Cliente */}
            <Route path="cliente/novo-chamado" element={<NewTicket />} />
            <Route path="cliente/chamado/:id" element={<ClienteTicketDetails />} />

            {/* Visão do Técnico */}
            <Route path="tecnico/dashboard" element={<TechDashboard />} />
            <Route path="tecnico/chamado/:id" element={<TechTicketDetails />} />
            <Route path="tecnico/relatorios" element={<TechReports />} />

            {/* Visão do Administrador */}
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Redirecionamento de rotas desconhecidas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}