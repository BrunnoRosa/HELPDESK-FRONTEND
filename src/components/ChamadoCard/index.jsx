import { Link } from 'react-router-dom';
import './style.css';

export default function ChamadoCard({ chamado }) {
  return (
    <article className="chamado-card">
      <div className="chamado-card__top">
        <span className="chamado-card__id">#{chamado?.id ?? '---'}</span>
        <span className="level-badge">{chamado?.ocorrenciaChamado ?? 'Não informada'}</span>
      </div>
      
      <h3 title={chamado?.tituloChamado ?? ''}>{chamado?.tituloChamado ?? 'Sem título'}</h3>
      
      <p className="chamado-card__desc">
        {chamado?.descricaoChamado ?? 'Descrição não informada.'}
      </p>
      
      <div className="chamado-card__meta">
        <span className={`priority-text priority-${chamado?.prioridadeChamado?.toLowerCase() ?? 'media'}`}>
          {chamado?.prioridadeChamado ?? 'MEDIA'}
        </span>
      </div>
      
      <Link className="chamado-card__link" to={`/tecnico/chamado/${chamado?.id ?? ''}`}>
        Ver Detalhes
      </Link>
    </article>
  );
}
