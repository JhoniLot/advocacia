import React from 'react';

const KPICard = ({ title, value, icon: Icon, trend }) => (
  <div className="kpi-item">
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75em', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</span>
      <Icon size={16} color="var(--accent-primary)" />
    </div>
    <div style={{ fontSize: '1.8em', fontWeight: '400', marginBottom: '8px', fontFamily: 'serif' }}>{value}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75em', color: trend > 0 ? '#6ea08e' : '#a06e6e' }}>
      <span>{trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%</span>
      <span style={{ color: 'var(--text-secondary)' }}>VS MÊS ANTERIOR</span>
    </div>
  </div>
);

export default KPICard;
