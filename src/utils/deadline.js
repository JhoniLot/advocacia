export const getDeadlineStatus = (dateStr, timeStr, isManuallyUrgent) => {
  if (!dateStr || !dateStr.includes('-')) return isManuallyUrgent ? { label: 'URGENTE', color: '#a06e6e', bg: 'rgba(160, 110, 110, 0.05)', blink: false } : null; 
  
  const eventDate = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
  const now = new Date();
  const diffHours = (eventDate - now) / (1000 * 60 * 60);
  
  if (diffHours < 0) return { label: 'ATRASADO', color: '#a06e6e', bg: 'rgba(160, 110, 110, 0.15)', blink: true };
  if (diffHours <= 48) return { label: 'PRAZO FATAL (48H)', color: '#ffa500', bg: 'rgba(255, 165, 0, 0.1)', blink: true };
  if (diffHours <= 168) return { label: 'PRÓXIMOS 7 DIAS', color: '#6ea08e', bg: 'rgba(110, 160, 142, 0.05)', blink: false };
  
  return isManuallyUrgent ? { label: 'URGENTE', color: '#a06e6e', bg: 'rgba(160, 110, 110, 0.05)', blink: false } : null;
};
