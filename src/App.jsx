import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Componentes
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import CRM from './components/CRM';
import Finance from './components/Finance';
import Portal from './components/Portal';
import Login from './components/Login';
import Modal from './components/Modal';
import TriageForm from './components/TriageForm';
import AgendaForm from './components/AgendaForm';
import LeadsFunnel from './components/LeadsFunnel';
import DocTemplates from './components/DocTemplates';

// Utilitários
import { getDeadlineStatus } from './utils/deadline';

// Ícones para os modais locais
import { 
  X, 
  Loader2, 
  QrCode, 
  Copy, 
  FileText 
} from 'lucide-react';

const AppContent = () => {
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/portal');

  const [modalType, setModalType] = useState(null); 
  const [selectedCase, setSelectedCase] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [events, setEvents] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [currentUpdates, setCurrentUpdates] = useState([]);
  const [currentDocuments, setCurrentDocuments] = useState([]);
  const [newUpdateData, setNewUpdateData] = useState({ description: '', date: '', time: '' });
  const [session, setSession] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Form states for Edit
  const [editFormData, setEditFormData] = useState(null);
  const [editEventFormData, setEventEditFormData] = useState(null);

  // Dynamic KPIs
  const stats = processes.reduce((acc, curr) => {
    acc.revenue += curr.profit || 0;
    acc.count += 1;
    return acc;
  }, { revenue: 0, count: 0 });

  const totalProfit = stats.revenue * 0.92; 
  const totalCosts = stats.revenue - totalProfit;

  const filteredProcesses = processes.filter(p => 
    p.client_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.client_id && p.client_id.includes(searchQuery))
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!isPortal) {
      fetchProcesses();
      fetchEvents();
    }
  }, [isPortal, session]);

  const fetchProcessUpdates = async (processId) => {
    if (!session || session?.isDemo) {
      setCurrentUpdates([
        {
          id: "UPD-001",
          process_id: processId,
          description: "Petição Inicial protocolada sob o número 102384-2026.",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "10:00:00"
        },
        {
          id: "UPD-002",
          process_id: processId,
          description: "Despacho do Juiz determinando a citação do réu.",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "15:30:00"
        }
      ]);
      setCurrentDocuments([
        {
          id: "DOC-001",
          process_id: processId,
          name: "Petição_Inicial_Final.pdf",
          file_url: "#"
        },
        {
          id: "DOC-002",
          process_id: processId,
          name: "Guia_Custas_Pagas.pdf",
          file_url: "#"
        }
      ]);
      return;
    }

    const { data, error } = await supabase
      .from('process_updates')
      .select('*')
      .eq('process_id', processId)
      .order('created_at', { ascending: false }); 
    
    if (!error && data) {
      setCurrentUpdates(data);
    }

    const { data: docsData } = await supabase
      .from('process_documents')
      .select('*')
      .eq('process_id', processId);
    
    if (docsData) setCurrentDocuments(docsData);
  };

  const fetchEvents = async () => {
    if (!session || session?.isDemo) {
      setEvents([
        {
          id: "EVT-001",
          title: "Audiência de Conciliação - Construtora Alfa S/A",
          type: "AUDIÊNCIA",
          time: "14:00:00",
          date_label: new Date().toISOString().split('T')[0],
          urgent: true
        },
        {
          id: "EVT-002",
          title: "Prazo para Réplica - Roberto Silveira Cavalcanti",
          type: "PRAZO JURÍDICO",
          time: "18:00:00",
          date_label: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          urgent: false
        }
      ]);
      return;
    }

    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .order('time', { ascending: true });
    
    if (!error && data) {
      setEvents(data);
    }
  };

  const fetchProcesses = async () => {
    setLoading(true);
    if (!session || session?.isDemo) {
      setProcesses([
        {
          id: "PROC-2026-9821",
          client_name: "Roberto Silveira Cavalcanti",
          client_id: "284.912.834-01",
          phone: "(11) 99876-5432",
          description: "Recurso de Apelação Cível - TJSP - Recuperação de Ativos Tributários",
          status: "RÉPLICA",
          profit: 345000.00,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "PROC-2026-4401",
          client_name: "Mariana Alvarenga Fontes",
          client_id: "392.482.910-44",
          phone: "(21) 98112-9988",
          description: "Ação Ordinária de Cobrança com Danos Morais",
          status: "SENTENÇA",
          profit: 189000.00,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "PROC-2026-1033",
          client_name: "Construtora Alfa S/A",
          client_id: "09.123.456/0001-99",
          phone: "(11) 3300-8800",
          description: "Execução de Título Extrajudicial - Cobrança de Cotas Condominiais",
          status: "AUDIÊNCIA",
          profit: 450000.00,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar dados:', error.message);
    } else {
      setProcesses(data || []);
    }
    setLoading(false);
  };

  const handleUpdateProcess = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (session?.isDemo) {
      setProcesses(processes.map(p => p.id === editFormData.id ? { ...p, client_name: editFormData.client_name, status: editFormData.status, profit: parseFloat(editFormData.profit) } : p));
      setModalType(null);
      setLoading(false);
      return;
    }
    const { error } = await supabase
      .from('processes')
      .update({
        client_name: editFormData.client_name,
        status: editFormData.status,
        profit: parseFloat(editFormData.profit)
      })
      .eq('id', editFormData.id);

    if (error) {
      alert('Erro ao atualizar: ' + error.message);
    } else {
      setModalType(null);
      fetchProcesses();
    }
    setLoading(false);
  };

  const handleDeleteProcess = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este processo permanentemente?')) return;
    
    setLoading(true);
    if (session?.isDemo) {
      setProcesses(processes.filter(p => p.id !== id));
      setLoading(false);
      return;
    }
    const { error } = await supabase
      .from('processes')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Erro ao excluir: ' + error.message);
    } else {
      fetchProcesses();
    }
    setLoading(false);
  };

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (session?.isDemo) {
      const newUpdate = {
        id: `UPD-${Math.random()}`,
        process_id: editFormData.id,
        description: newUpdateData.description,
        date: newUpdateData.date,
        time: newUpdateData.time
      };
      setCurrentUpdates([newUpdate, ...currentUpdates]);
      setNewUpdateData({ description: '', date: '', time: '' });
      setLoading(false);
      return;
    }
    const { error } = await supabase
      .from('process_updates')
      .insert([{
        process_id: editFormData.id,
        description: newUpdateData.description,
        date: newUpdateData.date,
        time: newUpdateData.time
      }]);

    if (!error) {
      setNewUpdateData({ description: '', date: '', time: '' });
      fetchProcessUpdates(editFormData.id);
    } else {
      alert('Erro ao adicionar andamento: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteUpdate = async (id) => {
    setLoading(true);
    if (session?.isDemo) {
      setCurrentUpdates(currentUpdates.filter(u => u.id !== id));
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('process_updates').delete().eq('id', id);
    if (!error) {
      fetchProcessUpdates(editFormData.id);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e, processId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(true);
    if (session?.isDemo) {
      const newDoc = {
        id: `DOC-${Math.random()}`,
        process_id: processId,
        name: file.name,
        file_url: "#"
      };
      setCurrentDocuments([...currentDocuments, newDoc]);
      setUploadingDoc(false);
      return;
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${processId}-${Math.random()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('ged')
      .upload(filePath, file);

    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message);
      setUploadingDoc(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('ged')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('process_documents')
      .insert([{
        process_id: processId,
        name: file.name,
        file_url: publicUrl
      }]);

    if (!dbError) {
      fetchProcessUpdates(processId);
    } else {
      alert('Erro ao vincular documento: ' + dbError.message);
    }
    setUploadingDoc(false);
  };

  const handleDeleteDocument = async (id) => {
    if (session?.isDemo) {
      setCurrentDocuments(currentDocuments.filter(d => d.id !== id));
      return;
    }
    const { error } = await supabase.from('process_documents').delete().eq('id', id);
    if (!error) fetchProcessUpdates(editFormData.id);
  };

  const handleRegisterCase = async (e, formData) => {
    e.preventDefault();
    setLoading(true);

    if (session?.isDemo) {
      const newProcess = {
        id: `PROC-${Math.floor(Math.random() * 10000)}`,
        client_name: formData.client_name,
        client_id: formData.client_id,
        phone: formData.phone,
        description: formData.description,
        status: 'INICIAL',
        profit: parseFloat(formData.profit) || 0,
        created_at: new Date().toISOString()
      };
      setProcesses([newProcess, ...processes]);
      alert('Caso registrado com sucesso (Modo Portfólio)!');
      setModalType(null);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('processes')
      .insert([
        { 
          client_name: formData.client_name,
          client_id: formData.client_id,
          phone: formData.phone,
          description: formData.description,
          status: 'INICIAL',
          profit: parseFloat(formData.profit) || 0 
        }
      ]);

    if (error) {
      alert('Erro ao registrar caso: ' + error.message);
    } else {
      alert('Caso registrado com sucesso!');
      setModalType(null);
      fetchProcesses();
    }
    setLoading(false);
  };

  const handleAddEvent = async (e, eventFormData) => {
    e.preventDefault();
    setLoading(true);

    if (session?.isDemo) {
      const newEvent = {
        id: `EVT-${Math.floor(Math.random() * 10000)}`,
        ...eventFormData
      };
      setEvents([newEvent, ...events]);
      alert('Compromisso agendado com sucesso (Modo Portfólio)!');
      setModalType(null);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('agenda')
      .insert([eventFormData]);

    if (error) {
      alert('Erro ao agendar: ' + error.message);
    } else {
      alert('Compromisso agendado com sucesso!');
      setModalType(null);
      fetchEvents();
    }
    setLoading(false);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (session?.isDemo) {
      setEvents(events.map(ev => ev.id === editEventFormData.id ? { ...ev, title: editEventFormData.title, type: editEventFormData.type, time: editEventFormData.time, date_label: editEventFormData.date_label, urgent: editEventFormData.urgent } : ev));
      setModalType(null);
      setLoading(false);
      return;
    }
    const { error } = await supabase
      .from('agenda')
      .update({
        title: editEventFormData.title,
        type: editEventFormData.type,
        time: editEventFormData.time,
        date_label: editEventFormData.date_label,
        urgent: editEventFormData.urgent
      })
      .eq('id', editEventFormData.id);

    if (error) {
      alert('Erro ao atualizar: ' + error.message);
    } else {
      setModalType(null);
      fetchEvents();
    }
    setLoading(false);
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este compromisso?')) return;
    
    setLoading(true);
    if (session?.isDemo) {
      setEvents(events.filter(ev => ev.id !== id));
      setLoading(false);
      return;
    }
    const { error } = await supabase
      .from('agenda')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Erro ao excluir: ' + error.message);
    } else {
      fetchEvents();
    }
    setLoading(false);
  };

  const sendWhatsAppUpdate = (clientName, processNumber) => {
    const message = `Prezado(a) ${clientName}, informamos que houve uma atualização no processo ${processNumber}. Para mais detalhes, acesse seu Portal de Acompanhamento. Atenciosamente, Escritório Prime.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const generateVIPLink = (id) => {
    const link = `${window.location.origin}${window.location.pathname}#/portal/${id}`;
    setGeneratedLink(link);
    setModalType('link');
  };

  const handleLogout = async () => {
    if (session?.isDemo) {
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  };


  if (!session && !isPortal) {
    return <Login setSession={setSession} />;
  }

  return (
    <div style={{ display: 'flex' }}>
      {!isPortal && session && (
        <Sidebar 
          setModalType={setModalType} 
          handleLogout={handleLogout} 
        />
      )}

      <main className="main-content" style={{ marginLeft: (!isPortal && session) ? '260px' : '0', width: '100%', background: isPortal ? '#05060a' : '' }}>
        {!isPortal && session && <Header setModalType={setModalType} />}

        <Routes>
          <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Login setSession={setSession} />} />
          <Route path="/dashboard" element={session ? <Dashboard stats={stats} totalCosts={totalCosts} totalProfit={totalProfit} fetchProcesses={fetchProcesses} loading={loading} /> : <Navigate to="/" />} />
          <Route path="/calendar" element={session ? <Calendar events={events} setModalType={setModalType} setSelectedCase={setSelectedCase} setEventEditFormData={setEventEditFormData} handleDeleteEvent={handleDeleteEvent} getDeadlineStatus={getDeadlineStatus} /> : <Navigate to="/" />} />
          <Route path="/leads" element={session ? <LeadsFunnel processes={processes} fetchProcesses={fetchProcesses} loading={loading} /> : <Navigate to="/" />} />
          <Route path="/crm" element={session ? <CRM searchQuery={searchQuery} setSearchQuery={setSearchQuery} loading={loading} filteredProcesses={filteredProcesses} sendWhatsAppUpdate={sendWhatsAppUpdate} generateVIPLink={generateVIPLink} setEditFormData={setEditFormData} fetchProcessUpdates={fetchProcessUpdates} setModalType={setModalType} handleDeleteProcess={handleDeleteProcess} /> : <Navigate to="/" />} />
          <Route path="/templates" element={session ? <DocTemplates processes={processes} /> : <Navigate to="/" />} />
          <Route path="/finance" element={session ? <Finance processes={processes} /> : <Navigate to="/" />} />
          <Route path="/portal/:id" element={<Portal setModalType={setModalType} />} />
          <Route path="/portal" element={<Portal setModalType={setModalType} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* MODALS LOGIC */}
      {modalType === 'checkin' && selectedCase && (
        <Modal title="Validação de Diligência" onClose={() => setModalType(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85em' }}>
              CASO: <strong style={{ color: 'white' }}>{selectedCase.case}</strong>
            </p>
            <input type="number" placeholder="CUSTAS R$ 0,00" style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '16px', color: 'white' }} />
            <button style={{ width: '100%' }} onClick={() => { sendWhatsAppUpdate(selectedCase.case.split(' ')[0], selectedCase.id); setModalType(null); }}>CONFIRMAR E NOTIFICAR</button>
          </div>
        </Modal>
      )}

      {modalType === 'link' && (
        <Modal title="Gerador de Acesso VIP" onClose={() => setModalType(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#0a0c0f', border: '1px solid #2d3139', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ fontSize: '0.8em', color: 'var(--accent-primary)', wordBreak: 'break-all' }}>
                {generatedLink || 'Acesse o CRM e gere o link para um cliente específico.'}
              </code>
              {generatedLink && (
                <button className="secondary" style={{ border: 'none', padding: '8px', cursor: 'pointer' }} onClick={() => { navigator.clipboard.writeText(generatedLink); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }}>
                  <Copy size={16} />
                </button>
              )}
            </div>
            {linkCopied && <p style={{ fontSize: '0.7em', color: '#6ea08e', textAlign: 'center' }}>LINK COPIADO PARA A ÁREA DE TRANSFERÊNCIA</p>}
            {generatedLink && (
              <button style={{ width: '100%', background: 'var(--accent-primary)', color: 'var(--bg-deep)' }} onClick={() => { window.open(generatedLink, '_blank'); setModalType(null); }}>
                TESTAR VISÃO DO CLIENTE
              </button>
            )}
          </div>
        </Modal>
      )}

      {modalType === 'editProcess' && editFormData && (
        <Modal title="Editar Processo" onClose={() => setModalType(null)}>
          <form onSubmit={handleUpdateProcess} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>NOME DO CLIENTE</label>
              <input 
                type="text" 
                value={editFormData.client_name}
                onChange={(e) => setEditFormData({...editFormData, client_name: e.target.value})}
                style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>STATUS ATUAL</label>
                <select 
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid #2d3139', padding: '12px', color: 'white' }}
                >
                  <option>INICIAL</option>
                  <option>CONTESTAÇÃO</option>
                  <option>RÉPLICA</option>
                  <option>AUDIÊNCIA</option>
                  <option>SENTENÇA</option>
                  <option>FINALIZADO</option>
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>VALOR HONORÁRIOS (R$)</label>
                <input 
                  type="number" 
                  value={editFormData.profit}
                  onChange={(e) => setEditFormData({...editFormData, profit: e.target.value})}
                  style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
                />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--accent-primary)', color: 'var(--bg-deep)' }}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'SALVAR DADOS BÁSICOS'}
            </button>
          </form>

          <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #2d3139' }}>
            <h3 style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Histórico de Andamentos</h3>
            
            <form onSubmit={handleAddUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', background: 'var(--bg-card)', padding: '16px' }}>
              <input 
                type="text" 
                placeholder="DESCRIÇÃO DO ANDAMENTO (Ex: Audiência designada)" 
                required
                value={newUpdateData.description}
                onChange={(e) => setNewUpdateData({...newUpdateData, description: e.target.value})}
                style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '10px', color: 'white', fontSize: '0.85em' }} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="date" 
                  required
                  value={newUpdateData.date}
                  onChange={(e) => setNewUpdateData({...newUpdateData, date: e.target.value})}
                  style={{ flex: 1, background: 'transparent', border: '1px solid #2d3139', padding: '10px', color: 'white', fontSize: '0.85em' }} 
                />
                <input 
                  type="time" 
                  required
                  value={newUpdateData.time}
                  onChange={(e) => setNewUpdateData({...newUpdateData, time: e.target.value})}
                  style={{ flex: 1, background: 'transparent', border: '1px solid #2d3139', padding: '10px', color: 'white', fontSize: '0.85em' }} 
                />
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: 'var(--text-primary)', color: 'var(--bg-deep)' }}>+</button>
              </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentUpdates.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8em', textAlign: 'center' }}>Nenhum andamento lançado.</div>
              ) : (
                currentUpdates.map(update => (
                  <div key={update.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderLeft: '2px solid var(--accent-primary)' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.85em' }}>{update.description}</div>
                      <div style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>{update.date} às {update.time}</div>
                    </div>
                    <button className="secondary" style={{ padding: '6px', color: '#a06e6e' }} onClick={() => handleDeleteUpdate(update.id)}><X size={12} /></button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #2d3139' }}>
            <h3 style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Gestão de Documentos (GED)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ cursor: 'pointer', background: 'var(--accent-primary)', color: 'var(--bg-deep)', padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                {uploadingDoc ? <Loader2 className="animate-spin" size={16} /> : '+ ANEXAR NOVO ARQUIVO (PDF, JPG, PNG)'}
                <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, editFormData.id)} />
              </label>
              
              {currentDocuments.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8em', textAlign: 'center', padding: '20px' }}>Nenhum documento anexado ao caso.</div>
              ) : (
                currentDocuments.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '12px', border: '1px solid #2d3139' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={16} color="var(--accent-primary)" />
                      <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ color: 'white', fontSize: '0.85em', textDecoration: 'none' }}>
                        {doc.name.slice(0, 35)}{doc.name.length > 35 ? '...' : ''}
                      </a>
                    </div>
                    <button className="secondary" style={{ padding: '6px', color: '#a06e6e' }} onClick={() => handleDeleteDocument(doc.id)}><X size={12} /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes blinker {
          50% { opacity: 0.3; }
        }
        .blink { animation: blinker 1.5s linear infinite; }

        input:focus, textarea:focus, select:focus { outline: none; border-color: var(--accent-primary); }
        tr:hover { background: rgba(255, 255, 255, 0.01); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #2d3139; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const App = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
