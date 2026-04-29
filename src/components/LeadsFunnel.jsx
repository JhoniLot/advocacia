import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Phone, 
  DollarSign,
  Loader2
} from 'lucide-react';

const LeadsFunnel = ({ processes, fetchProcesses, loading }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    phone: '',
    description: '',
    profit: ''
  });

  const stages = [
    { id: 'LEAD_NOVO', title: 'Novo Contato', color: '#a0aec0' },
    { id: 'LEAD_REUNIAO', title: 'Reunião Agendada', color: '#4299e1' },
    { id: 'LEAD_PROPOSTA', title: 'Proposta Enviada', color: '#ecc94b' },
    { id: 'LEAD_CONVERTIDO', title: 'Convertido', color: '#48bb78' },
    { id: 'LEAD_PERDIDO', title: 'Perdido', color: '#e53e3e' }
  ];

  // Filtra os processos que são leads
  const leads = processes.filter(p => 
    ['LEAD_NOVO', 'LEAD_REUNIAO', 'LEAD_PROPOSTA', 'LEAD_CONVERTIDO', 'LEAD_PERDIDO'].includes(p.status)
  );

  const handleAddLead = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from('processes')
      .insert([
        { 
          client_name: formData.client_name,
          phone: formData.phone,
          description: formData.description,
          status: 'LEAD_NOVO',
          profit: parseFloat(formData.profit) || 0 
        }
      ]);

    if (error) {
      alert('Erro ao cadastrar lead: ' + error.message);
    } else {
      setFormData({ client_name: '', phone: '', description: '', profit: '' });
      setShowAddModal(false);
      fetchProcesses();
    }
    setSubmitting(false);
  };

  const updateLeadStatus = async (id, newStatus) => {
    // Se converter, podemos mudar para o status judicial inicial se o usuário quiser, 
    // mas vamos manter LEAD_CONVERTIDO para histórico do funil.
    const { error } = await supabase
      .from('processes')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Erro ao atualizar status: ' + error.message);
    } else {
      fetchProcesses();
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.5em', letterSpacing: '2px', textTransform: 'uppercase' }}>Funil de Prospecção</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8em', marginTop: '4px' }}>Gerencie o fluxo de fechamento de novos contratos.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', color: 'var(--bg-deep)' }}
        >
          <Plus size={16} /> NOVO LEAD
        </button>
      </div>

      {/* KANBAN BOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', alignItems: 'start', overflowX: 'auto' }}>
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage.id);
          
          return (
            <div 
              key={stage.id} 
              style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid #2d3139', 
                borderRadius: '4px', 
                padding: '16px',
                minHeight: '500px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: `2px solid ${stage.color}`, paddingBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage.color }}></div>
                <h3 style={{ fontSize: '0.8em', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>{stage.title}</h3>
                <span style={{ marginLeft: 'auto', fontSize: '0.7em', background: '#1a1d24', padding: '2px 6px', color: 'var(--text-secondary)' }}>
                  {stageLeads.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stageLeads.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75em', textAlign: 'center', padding: '20px 0' }}>Nenhum lead</p>
                ) : (
                  stageLeads.map(lead => (
                    <div 
                      key={lead.id} 
                      style={{ 
                        background: '#0a0c0f', 
                        border: '1px solid #2d3139', 
                        padding: '12px', 
                        borderRadius: '4px',
                        position: 'relative'
                      }}
                    >
                      <div style={{ fontWeight: '600', fontSize: '0.85em', color: 'white', marginBottom: '6px' }}>
                        {lead.client_name}
                      </div>
                      
                      {lead.description && (
                        <p style={{ fontSize: '0.75em', color: 'var(--text-secondary)', marginBottom: '12px', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {lead.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75em', color: 'var(--text-secondary)', marginBottom: '12px', borderTop: '1px solid #1a1d24', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={12} color="var(--accent-primary)" />
                          <span>{lead.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <DollarSign size={12} color="#6ea08e" />
                          <span>R$ {lead.profit.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* AÇÕES DO CARD */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1a1d24', paddingTop: '8px' }}>
                        {stage.id !== 'LEAD_NOVO' && (
                          <button 
                            className="secondary" 
                            style={{ padding: '4px 8px', fontSize: '0.65em' }}
                            onClick={() => {
                              const prevIndex = stages.findIndex(s => s.id === stage.id) - 1;
                              updateLeadStatus(lead.id, stages[prevIndex].id);
                            }}
                          >
                            <ArrowLeft size={12} />
                          </button>
                        )}
                        
                        {stage.id !== 'LEAD_CONVERTIDO' && stage.id !== 'LEAD_PERDIDO' && (
                          <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                            <button 
                              className="secondary" 
                              style={{ padding: '4px 8px', fontSize: '0.65em', color: '#e53e3e' }}
                              onClick={() => updateLeadStatus(lead.id, 'LEAD_PERDIDO')}
                            >
                              <XCircle size={12} />
                            </button>
                            <button 
                              className="secondary" 
                              style={{ padding: '4px 8px', fontSize: '0.65em', color: '#48bb78' }}
                              onClick={() => updateLeadStatus(lead.id, 'LEAD_CONVERTIDO')}
                            >
                              <CheckCircle size={12} />
                            </button>
                            <button 
                              className="secondary" 
                              style={{ padding: '4px 8px', fontSize: '0.65em' }}
                              onClick={() => {
                                const nextIndex = stages.findIndex(s => s.id === stage.id) + 1;
                                updateLeadStatus(lead.id, stages[nextIndex].id);
                              }}
                            >
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL ADICIONAR LEAD */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid #2d3139', padding: '32px', width: '400px', position: 'relative' }}>
            <button 
              onClick={() => setShowAddModal(false)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              X
            </button>
            
            <h2 style={{ fontSize: '1.1em', letterSpacing: '2px', marginBottom: '24px', textTransform: 'uppercase' }}>Novo Lead</h2>
            
            <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                type="text" 
                placeholder="NOME COMPLETO DO PROSPECT" 
                required
                autoFocus
                value={formData.client_name}
                onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
              />
              <input 
                type="text" 
                placeholder="TELEFONE DE CONTATO" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
              />
              <input 
                type="number" 
                placeholder="VALOR ESTIMADO DO CONTRATO (R$)" 
                required
                value={formData.profit}
                onChange={(e) => setFormData({...formData, profit: e.target.value})}
                style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
              />
              <textarea 
                placeholder="NOTAS / HISTÓRICO DO CONTATO" 
                rows="3" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }}
              ></textarea>
              
              <button type="submit" disabled={submitting} style={{ width: '100%', background: 'var(--accent-primary)', color: 'var(--bg-deep)' }}>
                {submitting ? <Loader2 className="animate-spin" size={16} /> : 'SALVAR LEAD'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsFunnel;
