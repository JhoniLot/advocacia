import React from 'react';
import { FileText, X } from 'lucide-react';

const Calendar = ({ 
  events, 
  setModalType, 
  setSelectedCase, 
  setEventEditFormData, 
  handleDeleteEvent,
  getDeadlineStatus 
}) => {
  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '2px' }}>Prazos e Diligências</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setModalType('addEvent')} style={{ fontSize: '0.7em', padding: '10px 20px' }}>+ NOVO COMPROMISSO</button>
          <div style={{ display: 'flex', gap: '1px', background: '#2d3139' }}>
            <button className="secondary" style={{ border: 'none', background: 'var(--bg-surface)', padding: '10px' }}>DIA</button>
            <button className="secondary" style={{ border: 'none', background: 'var(--bg-surface)', padding: '10px' }}>SEMANA</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#2d3139' }}>
        {events.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            NENHUM COMPROMISSO AGENDADO PARA HOJE.
          </div>
        ) : (
          events.map((event) => {
            const status = getDeadlineStatus(event.date_label, event.time, event.urgent);
            return (
              <div key={event.id} style={{ background: status?.bg || 'var(--bg-card)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: status ? `3px solid ${status.color}` : 'none' }}>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                  <div style={{ minWidth: '80px', borderRight: '1px solid #2d3139' }}>
                    <div style={{ fontSize: '1.1em', fontWeight: '700' }}>{event.time.slice(0, 5)}</div>
                    <div style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>{event.date_label.split('-').reverse().join('/')}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1em', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{event.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.7em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{event.type}</span>
                      {status && (
                        <span className={status.blink ? 'blink' : ''} style={{ fontSize: '0.65em', color: status.color, border: `1px solid ${status.color}`, padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          {status.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setSelectedCase({ id: event.id, case: event.title }); setModalType('checkin'); }} style={{ fontSize: '0.75em' }}>VALIDAR</button>
                  <button className="secondary" style={{ padding: '8px', color: 'var(--accent-primary)' }} onClick={() => { setEventEditFormData(event); setModalType('editEvent'); }}>
                    <FileText size={14} />
                  </button>
                  <button className="secondary" style={{ padding: '8px', color: '#a06e6e' }} onClick={() => handleDeleteEvent(event.id)}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Calendar;
