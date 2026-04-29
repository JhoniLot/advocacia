import React from 'react';

const Finance = ({ processes }) => {
  const totalRevenue = processes.reduce((acc, curr) => acc + (curr.profit || 0), 0);
  const totalCosts = totalRevenue * 0.08; // Estimativa de 8% de custos
  const totalMargin = totalRevenue > 0 ? 92.0 : 0;

  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-item">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75em', fontWeight: '700', marginBottom: '8px' }}>HONORÁRIOS TOTAIS</div>
          <div style={{ fontSize: '1.8em', fontWeight: '400', fontFamily: 'serif' }}>R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="kpi-item">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75em', fontWeight: '700', marginBottom: '8px' }}>CUSTAS E DILIGÊNCIAS</div>
          <div style={{ fontSize: '1.8em', fontWeight: '400', fontFamily: 'serif', color: '#a06e6e' }}>R$ {totalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="kpi-item">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75em', fontWeight: '700', marginBottom: '8px' }}>MARGEM CONSOLIDADA</div>
          <div style={{ fontSize: '1.8em', fontWeight: '400', fontFamily: 'serif', color: '#6ea08e' }}>{totalMargin.toFixed(1)}%</div>
        </div>
      </div>
      <div className="glass-card" style={{ marginTop: '24px', padding: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2d3139', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75em', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px' }}>CENTRO DE CUSTO / CASO</th>
              <th style={{ padding: '16px' }}>ENTRADAS</th>
              <th style={{ padding: '16px' }}>SAÍDAS</th>
              <th style={{ padding: '16px' }}>NET PROFIT</th>
              <th style={{ padding: '16px' }}>EFICIÊNCIA</th>
            </tr>
          </thead>
          <tbody>
            {processes.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>AGUARDANDO DADOS FINANCEIROS...</td></tr>
            ) : (
              processes.map((row) => {
                const cost = (row.profit || 0) * 0.08;
                const net = (row.profit || 0) - cost;
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid #2d3139' }}>
                    <td style={{ padding: '16px', fontWeight: '700', fontSize: '0.9em', textTransform: 'uppercase' }}>{row.client_name}</td>
                    <td style={{ padding: '16px', color: 'var(--accent-primary)' }}>+ R$ {(row.profit || 0).toLocaleString()}</td>
                    <td style={{ padding: '16px', color: '#a06e6e' }}>- R$ {cost.toLocaleString()}</td>
                    <td style={{ padding: '16px', color: '#6ea08e', fontWeight: '700' }}>R$ {net.toLocaleString()}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '4px', background: '#2d3139' }}>
                          <div style={{ width: '92%', height: '100%', background: 'var(--accent-primary)' }}></div>
                        </div>
                        <span style={{ fontSize: '0.8em' }}>92%</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;
