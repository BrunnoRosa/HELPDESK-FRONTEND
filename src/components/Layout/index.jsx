import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './style.css';

export default function Layout() {
  return (
    <div className="layout-container">
      {/* O Menu fica fixo na esquerda */}
      <Sidebar /> 
      
      <div className="layout-main">
        {/* O Cabeçalho fica fixo no topo */}
        <Header /> 
        
        {/* O <Outlet /> é o "buraco" onde o React Router vai injetar 
            suas páginas (Dashboard, NewTicket, etc) dinamicamente */}
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}