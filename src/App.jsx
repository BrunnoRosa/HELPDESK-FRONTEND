import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TechReports from './pages/tech/TechReports';

// Importação dos componentes de estrutura
import Layout from './components/Layout';
import Protected from './components/Protected';

// Importação das Páginas - Auth
import Login from './pages/auth/Login';

// Importação das Páginas - Geral / Configurações
import Profile from './pages/Profile'; // <-- 1. IMPORTE A PÁGINA DE PERFIL AQUI

// Importação das Páginas - Cliente
import ClienteDashboard from './pages/cliente/ClienteDashboard';
import NewTicket from './pages/cliente/NewTicket';
import ClientTicketDetails from './pages/cliente/ClienteTicketDetails';

// Importação das Páginas - Técnico e Admin
import TechDashboard from './pages/tech/TechDashboard';
import TechTicketDetails from './pages/tech/TechTicketDetails';
import AdminDashboard from './pages/admin/AdminDashboard';        
import AdminTicketDetails from './pages/admin/AdminTicketDetails'; 

// 1. CORREÇÃO: Direciona automaticamente para as rotas corretas caso o usuário acesse a raiz '/'
function IndexRouter() {
  const { user } = useAuth();
  if (user?.role === 'ADMINISTRADOR') return <Navigate to="/admin" replace />;
  if (user?.role === 'TECNICO') return <Navigate to="/tecnico" replace />;
  return <ClienteDashboard />;
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
            <Route path="perfil" element={<Profile />} /> {/* <-- 2. ROTA ADICIONADA */}

            {/* Visão do Cliente */}
              <Route path="cliente" element={<ClienteDashboard />} /> {/* <-- ADICIONE ESTA LINHA */}
              <Route path="cliente/novo-chamado" element={<NewTicket />} />
              <Route path="cliente/chamado/:id" element={<ClientTicketDetails />} />
            {/* 2. CORREÇÃO: Removido o "/dashboard" para casar perfeitamente com o Login e Sidebar */}
            <Route path="tecnico" element={<TechDashboard />} />
            <Route path="tecnico/chamado/:id" element={<TechTicketDetails />} />
            <Route path="tecnico/relatorios" element={<TechReports />} />

            {/* Visão do Admin */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/chamado/:id" element={<AdminTicketDetails />} />
          </Route>

          {/* Redirecionamento para rotas inexistentes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}