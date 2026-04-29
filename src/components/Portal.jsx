import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, LogOut, FileText, Loader2 } from 'lucide-react';

const Portal = ({ setModalType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientPortalData, setClientPortalData] = useState(null);
  const [currentUpdates, setCurrentUpdates] = useState([]);
  const [currentDocuments, setCurrentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchClientData(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchClientData = async (processId) => {
    setLoading(true);
    const { data: processData } = await supabase.from('processes').select('*').eq('id', processId).single();
    if (processData) setClientPortalData(processData);
    
    const { data: updatesData } = await supabase
      .from('process_updates')
      .select('*')
      .eq('process_id', processId)
      .order('created_at', { ascending: true }); 
      
    if (updatesData) setCurrentUpdates(updatesData);

    const { data: docsData } = await supabase
      .from('process_documents')
      .select('*')
      .eq('process_id', processId);
    
    if (docsData) setCurrentDocuments(docsData);

    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#05060a', color: 'white' }}>
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!id || !clientPortalData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#05060a', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
        <div>
          <ShieldCheck size={48} color="#a06e6e" style={{ marginBottom: '20px', margin: '0 auto' }} />
          <h2 style={{ marginTop: '20px', letterSpacing: '2px' }}>ACESSO NÃO AUTORIZADO</h2>
          <p style={{ fontSize: '0.9em', marginTop: '10px' }}>O link utilizado é inválido ou o processo não foi encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', background: '#05060a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--accent-primary)', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--bg-deep)' }}>
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ fontSize: '1.2em', letterSpacing: '2px', textTransform: 'uppercase' }}>Portal de Acompanhamento VIP</h2>
        </div>
        <button 
          className="secondary" 
          onClick={() => navigate('/dashboard')} 
          style={{ fontSize: '0.7em', border: '1px solid var(--accent-primary)', cursor: 'pointer' }}
        >
          <LogOut size={14} /> VOLTAR AO PAINEL
        </button>
      </div>

      <div className="glass-card" style={{ padding: '60px', textAlign: 'center', marginBottom: '32px', border: '2px solid var(--accent-primary)' }}>
        <h1 style={{ fontSize: '1.8em', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Relatório: {clientPortalData.client_name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8em', letterSpacing: '2px' }}>
          PROCESSO ID: {clientPortalData.id.slice(0, 8)}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        <div className="glass-card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '40px' }}>MOVIMENTAÇÕES PROCESSUAIS EM TEMPO REAL</h3>
          <div style={{ borderLeft: '1px solid #2d3139', paddingLeft: '32px', position: 'relative' }}>
            {currentUpdates.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8em' }}>Nenhum andamento registrado até o momento.</div>
            ) : (
              currentUpdates.map((step, i) => (
                <div key={step.id} style={{ marginBottom: '40px', position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-37px', 
                    top: '4px', 
                    width: '10px', 
                    height: '10px', 
                    background: i === currentUpdates.length - 1 ? 'var(--accent-primary)' : 'var(--text-primary)' 
                  }}></div>
                  <div style={{ 
                    fontWeight: '700', 
                    fontSize: '0.85em', 
                    letterSpacing: '1px', 
                    color: i === currentUpdates.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)' 
                  }}>{step.description}</div>
                  <div style={{ fontSize: '0.7em', color: 'var(--text-secondary)', marginTop: '4px' }}>{step.date} às {step.time}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Situação Financeira</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75em', color: 'var(--text-secondary)' }}>VALOR DA CAUSA (ESTIMADO)</span>
              <span style={{ fontWeight: '700' }}>R$ {clientPortalData.profit.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75em', color: 'var(--text-secondary)' }}>SALDO PENDENTE</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>R$ {(clientPortalData.profit * 0.5).toLocaleString()}</span>
            </div>
            <button style={{ width: '100%', fontSize: '0.7em' }} onClick={() => setModalType('payment')}>EFETIVAR PAGAMENTO PENDENTE</button>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>PEÇAS E DOCUMENTOS DO PROCESSO</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentDocuments.length === 0 ? (
                <span style={{ fontSize: '0.75em', color: 'var(--text-secondary)' }}>Nenhum arquivo anexado.</span>
              ) : (
                currentDocuments.map(doc => (
                  <a 
                    key={doc.id} 
                    href={doc.file_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75em', color: 'white', textDecoration: 'none' }}
                  >
                    <FileText size={14} color="var(--accent-primary)" /> 
                    {doc.name.slice(0, 30)}{doc.name.length > 30 ? '...' : ''}
                  </a>
                ))
              )}
            </div>
          </div>
          <button style={{ background: '#6ea08e', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => setModalType('meeting')}>
            SOLICITAR REUNIÃO
          </button>
        </div>
      </div>
    </div>
  );
};

export default Portal;
