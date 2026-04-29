import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.95)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  }}>
    <div className="glass-card" style={{ width: '550px', padding: '40px', position: 'relative', background: 'var(--bg-surface)', maxHeight: '90vh', overflowY: 'auto' }}>
      <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
        <X size={20} />
      </button>
      <h2 style={{ marginBottom: '32px', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #2d3139', paddingBottom: '16px' }}>{title}</h2>
      {children}
    </div>
  </div>
);

export default Modal;
