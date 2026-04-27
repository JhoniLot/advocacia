import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Users, 
  Wallet, 
  ExternalLink, 
  MessageSquare, 
  Gift, 
  TrendingUp, 
  DollarSign, 
  Clock,
  CheckCircle2,
  Plus,
  Search,
  MoreVertical,
  ChevronRight,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ShieldCheck,
  Copy,
  Smartphone,
  LogOut,
  Bell,
  X,
  QrCode,
  CalendarDays,
  FileUp,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';
import { supabase } from './lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const chartData = [
  { name: 'JAN', profit: 4000, revenue: 6000 },
  { name: 'FEV', profit: 3000, revenue: 5000 },
  { name: 'MAR', profit: 5000, revenue: 8000 },
  { name: 'ABR', profit: 4500, revenue: 7500 },
];

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

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.95)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  }}>
    <div className="glass-card" style={{ width: '550px', padding: '40px', position: 'relative', background: 'var(--bg-surface)', maxHeight: '90vh', overflowY: 'auto' }}>
      <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', border: 'none', background: 'transparent', color: 'var(--text-secondary)' }}>
        <X size={20} />
      </button>
      <h2 style={{ marginBottom: '32px', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #2d3139', paddingBottom: '16px' }}>{title}</h2>
      {children}
    </div>
  </div>
);

const TriageForm = ({ onSubmit, loading, onClose }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_id: '',
    phone: '',
    description: '',
    profit: ''
  });

  return (
    <form onSubmit={(e) => onSubmit(e, formData)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <input 
        type="text" 
        placeholder="NOME COMPLETO DO CLIENTE" 
        required
        autoFocus
        value={formData.client_name}
        onChange={(e) => setFormData({...formData, client_name: e.target.value})}
        style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="CPF / CNPJ" 
          required
          value={formData.client_id}
          onChange={(e) => setFormData({...formData, client_id: e.target.value})}
          style={{ flex: 1, background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
        />
        <input 
          type="text" 
          placeholder="VALOR DOS HONORÁRIOS (R$)" 
          required
          type="number"
          value={formData.profit}
          onChange={(e) => setFormData({...formData, profit: e.target.value})}
          style={{ flex: 1, background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
        />
      </div>
      <input 
        type="text" 
        placeholder="TELEFONE DE CONTATO" 
        required
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
      />
      <textarea 
        placeholder="DESCRIÇÃO PRELIMINAR DO CASO" 
        rows="4" 
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }}
      ></textarea>
      <div style={{ border: '1px dashed #2d3139', padding: '30px', textAlign: 'center', cursor: 'pointer' }}>
        <FileUp size={24} color="var(--accent-primary)" />
        <p style={{ fontSize: '0.8em', marginTop: '10px' }}>ANEXAR DOCUMENTOS (RG, COMPROVANTE, ETC)</p>
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
        {loading ? <Loader2 className="animate-spin" size={16} /> : 'INICIAR PROCESSO'}
      </button>
    </form>
  );
};

const AgendaForm = ({ onSubmit, loading }) => {
  const [eventFormData, setEventFormData] = useState({
    title: '',
    type: 'Audiência',
    time: '10:00',
    date_label: 'HOJE',
    urgent: false
  });

  return (
    <form onSubmit={(e) => onSubmit(e, eventFormData)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <input 
        type="text" 
        placeholder="TÍTULO DO COMPROMISSO (EX: AUDIÊNCIA SILVA)" 
        required
        autoFocus
        value={eventFormData.title}
        onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
        style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <select 
          value={eventFormData.type}
          onChange={(e) => setEventFormData({...eventFormData, type: e.target.value})}
          style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid #2d3139', padding: '12px', color: 'white' }}
        >
          <option>Audiência</option>
          <option>Prazo Fatal</option>
          <option>Reunião</option>
          <option>Diligência</option>
        </select>
        <input 
          type="time" 
          required
          value={eventFormData.time}
          onChange={(e) => setEventFormData({...eventFormData, time: e.target.value})}
          style={{ flex: 1, background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
        />
      </div>
      <input 
        type="text" 
        placeholder="DATA (EX: HOJE, 30 ABR, 15 MAI)" 
        required
        value={eventFormData.date_label}
        onChange={(e) => setEventFormData({...eventFormData, date_label: e.target.value})}
        style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85em', cursor: 'pointer' }}>
        <input 
          type="checkbox" 
          checked={eventFormData.urgent}
          onChange={(e) => setEventFormData({...eventFormData, urgent: e.target.checked})}
        />
        MARCAR COMO URGENTE (ALERTA VERMELHO)
      </label>
      <button type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? <Loader2 className="animate-spin" size={16} /> : 'SALVAR NA AGENDA'}
      </button>
    </form>
  );
};

const App = () => {


  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalType, setModalType] = useState(null); // 'checkin', 'link', 'triage', 'notif', 'payment', 'meeting', 'editProcess'
  const [selectedCase, setSelectedCase] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [events, setEvents] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states for Edit
  const [editFormData, setEditFormData] = useState(null);
  
  // Dynamic KPIs
  const stats = processes.reduce((acc, curr) => {
    acc.revenue += curr.profit || 0;
    acc.count += 1;
    return acc;
  }, { revenue: 0, count: 0 });

  const totalProfit = stats.revenue * 0.92; // Simulando 92% de margem
  const totalCosts = stats.revenue - totalProfit;

  
  const isClientView = activeTab === 'portal';


  useEffect(() => {
    fetchProcesses();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
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
    console.log('Iniciando busca de processos...');
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro detalhado do Supabase:', error);
      alert('Erro ao buscar dados: ' + error.message);
    } else {
      console.log('Processos recebidos:', data?.length || 0);
      setProcesses(data || []);
    }
    setLoading(false);
  };

  const handleUpdateProcess = async (e) => {
    e.preventDefault();
    setLoading(true);
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

  const handleRegisterCase = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Tentando registrar caso:', formData.client_name);

    const { data, error } = await supabase
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
      ])
      .select();

    if (error) {
      console.error('Erro ao inserir:', error);
      alert('Erro ao registrar caso: ' + error.message);
    } else {
      console.log('Caso registrado com sucesso!', data);
      alert('Caso registrado com sucesso! Redirecionando para a lista...');
      setModalType(null);
      setActiveTab('crm'); // Muda para a aba de listagem
      fetchProcesses();
    }
    setLoading(false);
  };


  const handleAddEvent = async (e, eventFormData) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Agendando evento:', eventFormData.title);

    const { error } = await supabase
      .from('agenda')
      .insert([eventFormData]);

    if (error) {
      console.error('Erro ao agendar:', error);
      alert('Erro ao agendar: ' + error.message);
    } else {
      console.log('Evento agendado!');
      alert('Compromisso agendado com sucesso!');
      setModalType(null);
      fetchEvents();
    }
    setLoading(false);
  };


  const sendWhatsAppUpdate = (clientName, processNumber) => {
    const message = `Prezado(a) ${clientName}, informamos que houve uma atualização no processo ${processNumber}. Para mais detalhes, acesse seu Portal de Acompanhamento. Atenciosamente, Escritório Prime.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{ display: 'flex' }}>
      {!isClientView && (
        <aside className="sidebar">
          <div style={{ marginBottom: '60px', padding: '0 16px', borderBottom: '1px solid #2d3139', paddingBottom: '24px' }}>
            <h2 style={{ fontSize: '1.1em', fontWeight: '800', letterSpacing: '2px' }}>PRIME <span style={{ fontWeight: '300', color: 'var(--accent-primary)' }}>JURÍDICO</span></h2>
            <p style={{ fontSize: '0.6em', color: 'var(--text-secondary)', marginTop: '4px', letterSpacing: '3px' }}>SOLUÇÕES EXECUTIVAS</p>
          </div>

          <nav style={{ flex: 1 }}>
            <a href="#" className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} /> PAINEL DE CONTROLE
            </a>
            <a href="#" className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
              <CalendarIcon size={18} /> AGENDA JURÍDICA
            </a>
            <a href="#" className={`nav-link ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>
              <Users size={18} /> GESTÃO DE PROCESSOS
            </a>
            <a href="#" className={`nav-link ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>
              <Wallet size={18} /> CONTROLADORIA
            </a>
            <a href="#" className={`nav-link ${activeTab === 'portal' ? 'active' : ''}`} onClick={() => setActiveTab('portal')}>
              <ShieldCheck size={18} /> PORTAL DO CLIENTE
            </a>
          </nav>

          <div style={{ padding: '16px', borderTop: '1px solid #2d3139', paddingTop: '24px' }}>
            <button className="secondary" style={{ width: '100%', fontSize: '0.7em', padding: '10px' }} onClick={() => setModalType('link')}>
              <ExternalLink size={12} /> GERAR ACESSO VIP
            </button>
          </div>
        </aside>
      )}

      <main className="main-content" style={{ marginLeft: isClientView ? '0' : '260px', width: '100%', background: isClientView ? '#05060a' : '' }}>
        {!isClientView && (
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
        )}

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="kpi-grid">
              <KPICard title="Honorários Totais" value={`R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={DollarSign} trend={stats.count > 0 ? 100 : 0} />
              <KPICard title="Custos (Estimados)" value={`R$ ${totalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={Clock} trend={-5} />
              <KPICard title="Lucro Líquido" value={`R$ ${totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={TrendingUp} trend={stats.count > 0 ? 100 : 0} />
            </div>

            <div className="glass-card" style={{ padding: '24px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.8em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Status da Base de Dados</h3>
                <p style={{ fontSize: '1.2em', fontWeight: '700' }}>{stats.count} CASOS ATIVOS NO SUPABASE</p>
              </div>
              <button className="secondary" onClick={fetchProcesses} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'SINCRONIZAR AGORA'}
              </button>
            </div>

            <div className="glass-card" style={{ padding: '40px', marginTop: '24px' }}>
              <h3 style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '40px', color: 'var(--text-secondary)' }}>Performance Financeira Consolidada</h3>
              <div style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="0" stroke="#2d3139" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid #2d3139', borderRadius: '0' }} />
                    <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={2} fill="rgba(142, 145, 150, 0.05)" />
                    <Area type="monotone" dataKey="profit" stroke="var(--text-primary)" strokeWidth={2} fill="rgba(255, 255, 255, 0.05)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        {activeTab === 'calendar' && (
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
                events.map((event) => (
                  <div key={event.id} style={{ background: 'var(--bg-card)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                      <div style={{ minWidth: '80px', borderRight: '1px solid #2d3139' }}>
                        <div style={{ fontSize: '1.1em', fontWeight: '700' }}>{event.time.slice(0, 5)}</div>
                        <div style={{ fontSize: '0.7em', color: event.urgent ? '#a06e6e' : 'var(--text-secondary)' }}>{event.date_label || 'HOJE'}</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1em', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{event.title}</div>
                        <div style={{ fontSize: '0.7em', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase' }}>{event.type}</div>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedCase(event); setModalType('checkin'); }} style={{ fontSize: '0.75em' }}>VALIDAR CONCLUÍDO</button>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* CRM */}
        {activeTab === 'crm' && (
          <div>
            <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Search style={{ color: 'var(--text-secondary)' }} size={18} />
                <input type="text" placeholder="BUSCAR NA BASE DE DADOS..." style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '0.85em', letterSpacing: '1px', textTransform: 'uppercase' }} />
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
                  ) : processes.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>NENHUM PROCESSO ENCONTRADO NO BANCO DE DADOS.</td>
                    </tr>
                  ) : (
                    processes.map((item) => (
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
                            <button className="secondary" style={{ padding: '8px', color: 'var(--accent-primary)' }} onClick={() => { setEditFormData(item); setModalType('editProcess'); }}>
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
        )}

        {/* Finance */}
        {activeTab === 'finance' && (
          <div>
            <div className="kpi-grid">
              <div className="kpi-item">
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75em', fontWeight: '700', marginBottom: '8px' }}>HONORÁRIOS TOTAIS</div>
                <div style={{ fontSize: '1.8em', fontWeight: '400', fontFamily: 'serif' }}>R$ 245.000,00</div>
              </div>
              <div className="kpi-item">
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75em', fontWeight: '700', marginBottom: '8px' }}>CUSTAS E DILIGÊNCIAS</div>
                <div style={{ fontSize: '1.8em', fontWeight: '400', fontFamily: 'serif', color: '#a06e6e' }}>R$ 18.250,00</div>
              </div>
              <div className="kpi-item">
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75em', fontWeight: '700', marginBottom: '8px' }}>MARGEM CONSOLIDADA</div>
                <div style={{ fontSize: '1.8em', fontWeight: '400', fontFamily: 'serif', color: '#6ea08e' }}>92.5%</div>
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
                      const cost = (row.profit || 0) * 0.08; // Estimativa de 8% de custos
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
        )}

        {/* Portal Cliente */}
        {activeTab === 'portal' && (
          <div style={{ minHeight: '100vh', padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--accent-primary)', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--bg-deep)' }}><ShieldCheck size={24} /></div>
                <h2 style={{ fontSize: '1.2em', letterSpacing: '2px', textTransform: 'uppercase' }}>Portal de Acompanhamento VIP</h2>
              </div>
              <button className="secondary" onClick={() => setActiveTab('dashboard')} style={{ fontSize: '0.7em', border: '1px solid var(--accent-primary)' }}><LogOut size={14} /> SAIR DA VISÃO DO CLIENTE</button>
            </div>
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center', marginBottom: '32px', border: '2px solid var(--accent-primary)' }}>
              <h1 style={{ fontSize: '1.8em', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>Relatório de Status Executivo</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8em', letterSpacing: '2px' }}>ACOMPANHAMENTO EM TEMPO REAL — CANAL EXCLUSIVO</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
              <div className="glass-card" style={{ padding: '40px' }}>
                <h3 style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '40px' }}>Cronograma do Seu Processo</h3>
                <div style={{ borderLeft: '1px solid #2d3139', paddingLeft: '32px', position: 'relative' }}>
                  {[
                    { title: 'PETIÇÃO INICIAL PROTOCOLADA', date: '12 JAN 2024', status: 'done' },
                    { title: 'CITAÇÃO DO RÉU', date: '25 JAN 2024', status: 'done' },
                    { title: 'RÉPLICA À CONTESTAÇÃO', date: '10 FEV 2024', status: 'done' },
                    { title: 'AUDIÊNCIA DE CONCILIAÇÃO', date: '27 ABR 2024', status: 'current' },
                    { title: 'SENTENÇA PREVISTA', date: 'JUN 2024', status: 'pending' },
                  ].map((step, i) => (
                    <div key={i} style={{ marginBottom: '40px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-37px', top: '4px', width: '10px', height: '10px', background: step.status === 'done' ? 'var(--text-primary)' : step.status === 'current' ? 'var(--accent-primary)' : 'var(--bg-deep)', border: step.status === 'pending' ? '1px solid #2d3139' : 'none' }}></div>
                      <div style={{ fontWeight: '700', fontSize: '0.85em', letterSpacing: '1px', color: step.status === 'pending' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{step.title}</div>
                      <div style={{ fontSize: '0.7em', color: 'var(--text-secondary)', marginTop: '4px' }}>{step.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Situação Financeira</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ fontSize: '0.75em', color: 'var(--text-secondary)' }}>LIQUIDADO</span><span style={{ fontWeight: '700' }}>R$ 5.000</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}><span style={{ fontSize: '0.75em', color: 'var(--text-secondary)' }}>SALDO</span><span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>R$ 2.500</span></div>
                  <button style={{ width: '100%', fontSize: '0.7em' }} onClick={() => setModalType('payment')}>LIQUIDAR SALDO</button>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Arquivos Disponíveis</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75em' }}><FileText size={14} /> INICIAL_CONSOLIDADA.PDF</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75em' }}><FileText size={14} /> PROCURACAO_EXEC.PDF</div>
                  </div>
                </div>
                <button style={{ background: '#6ea08e', color: 'white', border: 'none' }} onClick={() => setModalType('meeting')}>SOLICITAR REUNIÃO</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALS LOGIC */}
      {modalType === 'checkin' && selectedCase && (
        <Modal title="Validação de Diligência" onClose={() => setModalType(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85em' }}>CASO: <strong style={{ color: 'white' }}>{selectedCase.case}</strong></p>
            <input type="number" placeholder="CUSTAS R$ 0,00" style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '16px', color: 'white' }} />
            <button style={{ width: '100%' }} onClick={() => { sendWhatsAppUpdate(selectedCase.case.split(' ')[0], selectedCase.id); setModalType(null); }}>CONFIRMAR E NOTIFICAR</button>
          </div>
        </Modal>
      )}

      {modalType === 'link' && (
        <Modal title="Gerador de Acesso VIP" onClose={() => setModalType(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#0a0c0f', border: '1px solid #2d3139', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ fontSize: '0.8em', color: 'var(--accent-primary)' }}>prime-juridico.com.br/vip/auth_8xK29...</code>
              <button className="secondary" style={{ border: 'none', padding: '8px' }} onClick={() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }}><Copy size={16} /></button>
            </div>
            {linkCopied && <p style={{ fontSize: '0.7em', color: '#6ea08e', textAlign: 'center' }}>LINK COPIADO</p>}
            <button style={{ width: '100%', background: 'var(--accent-primary)', color: 'var(--bg-deep)' }} onClick={() => { setActiveTab('portal'); setModalType(null); }}>SIMULAR VISÃO DO CLIENTE</button>
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
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'SALVAR ALTERAÇÕES'}
            </button>
          </form>
        </Modal>
      )}

      {modalType === 'triage' && (
        <Modal title="Triagem de Novo Caso" onClose={() => setModalType(null)}>
          <TriageForm onSubmit={handleRegisterCase} loading={loading} />
        </Modal>
      )}


      {modalType === 'notif' && (
        <Modal title="Central de Notificações" onClose={() => setModalType(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#2d3139' }}>
            {[
              { title: 'Novo prazo fatal', time: '10m atrás', desc: 'Contestação Maria Santos vence amanhã.' },
              { title: 'Pagamento Confirmado', time: '1h atrás', desc: 'Honorários Silva vs TechCorp recebidos.' },
              { title: 'Mensagem Visualizada', time: '2h atrás', desc: 'Pedro Oliveira abriu o Portal VIP.' }
            ].map((n, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9em' }}>{n.title}</span>
                  <span style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>{n.desc}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modalType === 'payment' && (
        <Modal title="Liquidação de Honorários" onClose={() => setModalType(null)}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ fontSize: '0.9em' }}>Escaneie o QR Code abaixo para pagar via <strong>PIX</strong></p>
            <div style={{ background: 'white', padding: '20px', width: '200px', height: '200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <QrCode size={160} color="black" />
            </div>
            <div style={{ background: '#0a0c0f', padding: '12px', fontSize: '0.7em', border: '1px solid #2d3139' }}>
              00020101021226870014br.gov.bcb.pix2565prime...
            </div>
            <button className="secondary" onClick={() => { alert('Comprovante enviado para análise do escritório.'); setModalType(null); }}>JÁ REALIZEI O PAGAMENTO</button>
          </div>
        </Modal>
      )}

      {modalType === 'meeting' && (
        <Modal title="Agendar Reunião de Retorno" onClose={() => setModalType(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {['28 Abr', '29 Abr', '30 Abr'].map(d => (
                <div key={d} style={{ border: '1px solid #2d3139', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '0.7em' }}>{d}</div>
                  <div style={{ fontSize: '0.9em', fontWeight: '700' }}>10:00</div>
                </div>
              ))}
            </div>
            <select style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }}>
              <option>REUNIÃO VIA GOOGLE MEET</option>
              <option>PRESENCIAL NO ESCRITÓRIO</option>
            </select>
            <button style={{ width: '100%', background: '#6ea08e' }} onClick={() => { alert('Reunião agendada! Você receberá o convite no e-mail.'); setModalType(null); }}>CONFIRMAR AGENDAMENTO</button>
          </div>
        </Modal>
      )}

      {modalType === 'addEvent' && (
        <Modal title="Novo Compromisso" onClose={() => setModalType(null)}>
          <AgendaForm onSubmit={handleAddEvent} loading={loading} />
        </Modal>
      )}



      <style>{`
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

export default App;
