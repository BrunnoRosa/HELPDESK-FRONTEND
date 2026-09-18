import { toast } from 'react-toastify';
import './style.css';

/**
 * Função utilitária para disparar notificações com Toastify.
 * @param {string} type - Tipo do alerta ('success', 'error', 'warning', 'info')
 * @param {string} message - Texto da notificação
 */
export const notify = (type = 'info', message) => {
  // Se nenhuma mensagem for informada, interrompe a execução
  if (!message) return;

  // Mapeia os tipos de alerta para as funções nativas do Toastify
  const toastTypes = {
    success: toast.success,
    error: toast.error,
    warning: toast.warn,
    info: toast.info,
  };

  // Seleciona a função correspondente ao tipo ou usa 'info' como padrão
  const showToast = toastTypes[type] || toast.info;

  // Executa o disparo da notificação na tela
  showToast(message);
};

export default notify;