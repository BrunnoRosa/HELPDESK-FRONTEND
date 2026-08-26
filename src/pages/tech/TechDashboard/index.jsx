import { useState, useEffect } from 'react';
import api from '../../../services/api';
import ChamadoCard from '../../../components/ChamadoCard';
import './style.css';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await api.get('/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Erro ao buscar tickets:', error);
      }
    }
    fetchTickets();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Painel de Chamados</h2>
        <p>Gestão e acompanhamento de incidentes</p>
      </div>
      
      <div className="tickets-grid">
        {tickets.map(ticket => (
          <ChamadoCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}