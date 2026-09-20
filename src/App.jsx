import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TechReports from './pages/tech/TechReports';

// Importações do React Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // <-- CSS adicionado aqui!

// Importação dos componentes de estrutura
import Layout from './components/Layout';
import Protected from './components/Protected';

// Importação das Páginas - Auth
import Login from './pages/auth/Login';

// Importação das Páginas - Geral / Configurações
import Profile from './pages/profile';

// Importação das Páginas - Módulo Chamados (antigo Cliente)
import TicketDashboard from './pages/chamados/TicketDashboard';
import NewTicket from './pages/chamados/NewTicket';
import TicketDetails from './pages/chamados/TicketDetails';

// Importação das Páginas - Técnico e Admin
import TechDashboard from './pages/tech/TechDashboard';
import TechTicketDetails from './pages/tech/TechTicketDetails';
import AdminDashboard from './pages/admin/AdminDashboard';        
import AdminTicketDetails from './pages/admin/AdminTicketDetails'; 
import AdminUsers from './pages/admin/AdminUsers';

// Direciona automaticamente para as rotas corretas caso o usuário acesse a raiz '/'
function IndexRouter() {
  const { user } = useAuth();
  if (user?.role === 'ADMINISTRADOR') return <Navigate to="/admin" replace />;
  if (user?.role === 'TECNICO') return <Navigate to="/tecnico" replace />;
  return <TicketDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Privadas (Envelopadas pelo Layout) */}
          <Route 
            path="/" 
            element={
              <Protected>
                <Layout />
              </Protected>
            }
          >
            <Route index element={<IndexRouter />} />
            
            {/* Rota do Perfil (Acessível a qualquer perfil logado) */}
            <Route path="perfil" element={<Profile />} />

            {/* Módulo de Chamados */}
            <Route path="chamados" element={<TicketDashboard />} />
            <Route path="chamados/novo" element={<NewTicket />} />
            <Route path="chamados/:id" element={<TicketDetails />} />

            {/* Visão do Técnico */}
            <Route path="tecnico" element={<TechDashboard />} />
            <Route path="tecnico/chamado/:id" element={<TechTicketDetails />} />
            <Route path="tecnico/relatorios" element={<TechReports />} />

            {/* Visão do Admin */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/chamado/:id" element={<AdminTicketDetails />} />
            <Route path="admin/usuarios" element={<AdminUsers />} />
          </Route>

          {/* Redirecionamento para rotas inexistentes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        
        {/* Exibir notificações de toast */}
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}