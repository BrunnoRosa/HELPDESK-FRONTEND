import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Importação dos componentes de estrutura
import Layout from './components/Layout';
import Protected from './components/Protected';

// Importação das Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import TicketDetails from './pages/TicketDetails';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas (Telas limpas, sem menu lateral) */}
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
            {/* O Outlet do Layout vai renderizar essas telas aqui: */}
            <Route index element={<Dashboard />} />
            <Route path="novo-chamado" element={<NewTicket />} />
            <Route path="ticket/:id" element={<TicketDetails />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}