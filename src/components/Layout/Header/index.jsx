import './style.css';

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-breadcrumbs">
        {/* Aqui podemos colocar o título dinâmico depois, por enquanto um texto fixo */}
        <h2>Portal de Atendimento</h2>
      </div>

      {/* Espaço mantido caso você queira adicionar um sino de notificações ou campo de busca no futuro */}
      <div className="header-actions">
      </div>
    </header>
  );
}