import React from 'react';
import { Search, Loader2, MessageSquare, ShieldCheck, FileText, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CRM = ({
  searchQuery,
  setSearchQuery,
  loading,
  filteredProcesses,
  sendWhatsAppUpdate,
  generateVIPLink,
  setEditFormData,
  fetchProcessUpdates,
  setModalType,
  handleDeleteProcess
}) => {
  return (
    <div>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Search style={{ color: 'var(--text-secondary)' }} size={18} />
          <input 
            type="text" 
            placeholder="BUSCAR POR NOME, CPF OU ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '0.85em', letterSpacing: '1px', textTransform: 'uppercase' }} 
          />
          <button className="secondary" style={{ padding: '8px 16px' }} onClick={() => alert('Filtros avançados em desenvolvimento...')}>FILTROS</button>
        </div>
      </div>
      <div className="glass-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid #2d3139' }}>
              <th style={{ padding: '24px', fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '1px' }}>PROCESSO / CLIENTE</th>
              <th style={{ padding: '24px', fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '1px' }}>ÚLTIMA INTERAÇÃO</th>
              <th style={{ padding: '24px', fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '1px' }}>STATUS</th>
              <th style={{ padding: '24px', fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '1px' }}>MARGEM</th>
              <th style={{ padding: '24px', fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '1px' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                    <Loader2 className="animate-spin" size={20} />
                    <span>CARREGANDO DADOS DO SUPABASE...</span>
                  </div>
                </td>
              </tr>
            ) : filteredProcesses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {searchQuery ? 'NENHUM RESULTADO ENCONTRADO PARA A BUSCA.' : 'NENHUM PROCESSO ENCONTRADO NO BANCO DE DADOS.'}
                </td>
              </tr>
            ) : (
              filteredProcesses.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #2d3139' }}>
                  <td style={{ padding: '24px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95em', textTransform: 'uppercase' }}>{item.client_name}</div>
                    <div style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>ID: {item.id.slice(0, 8)}...</div>
                  </td>
                  <td style={{ padding: '24px', color: 'var(--text-secondary)', fontSize: '0.8em' }}>
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ptBR }).toUpperCase()}
                  </td>
                  <td style={{ padding: '24px' }}>
                    <span className="status-badge" style={{ color: item.status === 'SENTENÇA' ? '#6ea08e' : '#ffa500' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '24px', fontWeight: '700', fontSize: '0.9em' }}>
                    R$ {item.profit?.toLocaleString()}
                  </td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="secondary" style={{ padding: '8px' }} onClick={() => sendWhatsAppUpdate(item.client_name, item.id.slice(0, 8))}>
                        <MessageSquare size={14} />
                      </button>
                      <button className="secondary" style={{ padding: '8px' }} onClick={() => generateVIPLink(item.id)}>
                        <ShieldCheck size={14} />
                      </button>
                      <button className="secondary" style={{ padding: '8px', color: 'var(--accent-primary)' }} onClick={() => { setEditFormData(item); fetchProcessUpdates(item.id); setModalType('editProcess'); }}>
                        <FileText size={14} />
                      </button>
                      <button className="secondary" style={{ padding: '8px', color: '#a06e6e' }} onClick={() => handleDeleteProcess(item.id)}>
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRM;
