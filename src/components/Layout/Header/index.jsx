import './style.css';

export default function Header({ title }) {
  // Garante que se o título for nulo, undefined ou vazio (""), exiba o fallback
  const displayTitle = title && String(title).trim() !== '' ? title : "Portal de Atendimentos";

  return (
    <header className="main-header">
      <div className="header-breadcrumbs">
        <h2>{displayTitle}</h2>
      </div>

      <div className="header-actions">
        {/* Espaço para botões de ação futuros, buscas ou notificações */}
      </div>
    </header>
  );
}