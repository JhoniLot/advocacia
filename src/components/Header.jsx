import React from 'react';
import { Bell, Plus } from 'lucide-react';

const Header = ({ setModalType }) => {
  return (
    <header className="header">
      <div>
        <h1 style={{ fontSize: '1.8em', fontWeight: '300', marginBottom: '4px' }}>GESTÃO <span style={{ fontWeight: '700' }}>ESTRATÉGICA</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1px' }}>DR. VINICIUS — SÓCIO DIRETOR</p>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="secondary" style={{ border: '1px solid #2d3139' }} onClick={() => setModalType('notif')}>
          <Bell size={16} /> NOTIFICAÇÕES (2)
        </button>
        <button onClick={() => setModalType('triage')}>
          <Plus size={16} /> REGISTRAR CASO
        </button>
      </div>
    </header>
  );
};

export default Header;
