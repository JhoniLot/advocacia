import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const AgendaForm = ({ onSubmit, loading }) => {
  const [eventFormData, setEventFormData] = useState({
    title: '',
    type: 'Audiência',
    time: '10:00',
    date_label: new Date().toISOString().split('T')[0],
    urgent: false
  });

  return (
    <form onSubmit={(e) => onSubmit(e, eventFormData)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <input 
        type="text" 
        placeholder="DESIGNAÇÃO DO ATO PROCESSUAL (EX: AUDIÊNCIA DE CONCILIAÇÃO)" 
        required
        autoFocus
        value={eventFormData.title}
        onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
        style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <select 
          value={eventFormData.type}
          onChange={(e) => setEventFormData({...eventFormData, type: e.target.value})}
          style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid #2d3139', padding: '12px', color: 'white' }}
        >
          <option>Audiência de Conciliação/Instrução</option>
          <option>Prazo Preclusivo (Fatal)</option>
          <option>Reunião com Cliente</option>
          <option>Diligência Externa</option>
        </select>
        <input 
          type="time" 
          required
          value={eventFormData.time}
          onChange={(e) => setEventFormData({...eventFormData, time: e.target.value})}
          style={{ flex: 1, background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
        />
        <input 
          type="date" 
          required
          value={eventFormData.date_label}
          onChange={(e) => setEventFormData({...eventFormData, date_label: e.target.value})}
          style={{ flex: 1, background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
        />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85em', cursor: 'pointer' }}>
        <input 
          type="checkbox" 
          checked={eventFormData.urgent}
          onChange={(e) => setEventFormData({...eventFormData, urgent: e.target.checked})}
        />
        ASSINALAR COMO PRAZO PEREMPTÓRIO (URGENTE)
      </label>
      <button type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? <Loader2 className="animate-spin" size={16} /> : 'CONFIRMAR AGENDAMENTO'}
      </button>
    </form>
  );
};

export default AgendaForm;
