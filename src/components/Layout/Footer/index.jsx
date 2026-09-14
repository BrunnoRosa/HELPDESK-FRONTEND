import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Footer from '../Footer'; // Importe o novo Footer
import './style.css'; // Vamos garantir que o layout ocupe a tela toda

export default function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      
      {/* O wrapper principal flexível que engloba tudo à direita da Sidebar */}
      <div className="layout-main">
        <Header />
        
        {/* Onde o conteúdo das páginas (Dashboards, Tickets, etc) vai renderizar */}
        <main className="layout-content">
          <Outlet /> 
        </main>

        {/* Footer no final! */}
        <Footer />
      </div>
    </div>
  );
}