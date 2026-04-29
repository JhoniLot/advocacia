import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Users, 
  Wallet, 
  ShieldCheck, 
  ExternalLink, 
  LogOut,
  BarChart2,
  FileText
} from 'lucide-react';

const Sidebar = ({ setModalType, handleLogout }) => {
  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '60px', padding: '0 16px', borderBottom: '1px solid #2d3139', paddingBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1em', fontWeight: '800', letterSpacing: '2px' }}>PRIME <span style={{ fontWeight: '300', color: 'var(--accent-primary)' }}>JURÍDICO</span></h2>
        <p style={{ fontSize: '0.6em', color: 'var(--text-secondary)', marginTop: '4px', letterSpacing: '3px' }}>SOLUÇÕES EXECUTIVAS</p>
      </div>

      <nav style={{ flex: 1 }}>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> PAINEL DE CONTROLE
        </NavLink>
        <NavLink to="/leads" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BarChart2 size={18} /> FUNIL DE VENDAS
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <CalendarIcon size={18} /> AGENDA JURÍDICA
        </NavLink>
        <NavLink to="/crm" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users size={18} /> GESTÃO DE PROCESSOS
        </NavLink>
        <NavLink to="/templates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FileText size={18} /> MODELOS DE DOCUMENTOS
        </NavLink>
        <NavLink to="/finance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Wallet size={18} /> CONTROLADORIA
        </NavLink>
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid #2d3139', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className="secondary" style={{ width: '100%', fontSize: '0.7em', padding: '10px' }} onClick={() => setModalType('link')}>
          <ExternalLink size={12} /> GERAR ACESSO VIP
        </button>
        <button className="secondary" style={{ width: '100%', fontSize: '0.7em', padding: '10px', color: '#a06e6e' }} onClick={handleLogout}>
          <LogOut size={12} /> SAIR DO SISTEMA
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
