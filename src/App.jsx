import React, { useState } from 'react';
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
  FileText
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
  Area 
} from 'recharts';

const data = [
  { name: 'Jan', profit: 4000, revenue: 6000 },
  { name: 'Fev', profit: 3000, revenue: 5000 },
  { name: 'Mar', profit: 5000, revenue: 8000 },
  { name: 'Abr', profit: 4500, revenue: 7500 },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const KPICard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>{title}</span>
        <div style={{ padding: '8px', background: `rgba(${color}, 0.1)`, borderRadius: '12px' }}>
          <Icon size={20} color={`rgb(${color})`} />
        </div>
      </div>
      <div style={{ fontSize: '1.8em', fontWeight: '700', marginBottom: '8px' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85em', color: trend > 0 ? 'var(--success)' : 'var(--error)' }}>
        <TrendingUp size={14} />
        <span>{trend}% em relação ao mês anterior</span>
      </div>
    </div>
  );

  const Modal = ({ title, onClose, children }) => (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="glass-card" style={{ width: '500px', padding: '32px', position: 'relative' }}>
        <h2 style={{ marginBottom: '24px' }}>{title}</h2>
        {children}
        <button className="secondary" onClick={onClose} style={{ marginTop: '24px', width: '100%' }}>Fechar</button>
      </div>
    </div>
  );

  const sendWhatsAppUpdate = (clientName, processNumber) => {
    const message = `Olá ${clientName}, aqui é do Escritório Prime. O status do seu processo ${processNumber} foi atualizado. Acesse seu portal VIP para mais detalhes.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ marginBottom: '40px', padding: '0 16px' }}>
          <h2 className="text-gradient" style={{ fontSize: '1.4em' }}>PRIME JURÍDICO</h2>
          <p style={{ fontSize: '0.7em', color: 'var(--text-secondary)', letterSpacing: '2px' }}>MANAGEMENT SaaS</p>
        </div>

        <nav style={{ flex: 1 }}>
          <a href="#" className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
            <CalendarIcon size={20} /> Agenda de Prazos
          </a>
          <a href="#" className={`nav-link ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>
            <Users size={20} /> Gestão de Casos
          </a>
          <a href="#" className={`nav-link ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>
            <Wallet size={20} /> Financeiro
          </a>
        </nav>

        <div className="glass-card" style={{ padding: '16px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }}></div>
            <span style={{ fontSize: '0.85em' }}>Portal VIP Ativo</span>
          </div>
          <button className="secondary" style={{ width: '100%', fontSize: '0.8em' }}>
            <ExternalLink size={14} /> Copiar Link de Acesso
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ fontSize: '2.2em', marginBottom: '8px' }}>Bem-vindo, Dr. Vinicius</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Aqui está o resumo da performance do seu escritório hoje.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'rgba(255, 215, 0, 0.1)', color: '#ffd700', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
              <Gift size={18} /> Parabéns (2)
            </button>
            <button>
              <Plus size={18} /> Novo Processo
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="kpi-grid">
              <KPICard title="Receita Bruta" value="R$ 142.500" icon={DollarSign} trend={12.5} color="0, 210, 255" />
              <KPICard title="Custos Processuais" value="R$ 12.400" icon={Clock} trend={-4.2} color="255, 77, 77" />
              <KPICard title="Lucro Líquido Real" value="R$ 130.100" icon={TrendingUp} trend={18.1} color="0, 255, 136" />
            </div>

            <div className="glass-card" style={{ padding: '32px', marginTop: '24px' }}>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-metallic)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent-metallic)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--accent-metallic)" fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="profit" stroke="var(--success)" fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Content */}
        {activeTab === 'calendar' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5em' }}>Próximas Audiências & Prazos</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="secondary">Hoje</button>
                  <button className="secondary">Semana</button>
                  <button className="secondary">Mês</button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { id: 1, type: 'Audiência', case: 'João Silva vs. TechCorp', time: '14:00', date: 'Hoje', status: 'pending' },
                  { id: 2, type: 'Prazo Fatal', case: 'Maria Santos - Contestação', time: '23:59', date: 'Amanhã', status: 'urgent' },
                  { id: 3, type: 'Audiência', case: 'Pedro Oliveira vs. Bank Alpha', time: '09:30', date: '29 Abr', status: 'pending' },
                ].map((event) => (
                  <div key={event.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: event.status === 'urgent' ? '4px solid var(--error)' : '4px solid var(--accent-metallic)' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center', minWidth: '60px' }}>
                        <div style={{ fontSize: '1.2em', fontWeight: '700' }}>{event.time}</div>
                        <div style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>{event.date}</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1.1em' }}>{event.case}</div>
                        <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <span className="status-badge" style={{ padding: '2px 8px', marginRight: '8px', background: 'rgba(255,255,255,0.05)' }}>{event.type}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedCase(event); setShowCheckIn(true); }}>
                      <CheckCircle2 size={18} /> Check-in
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CRM Content */}
        {activeTab === 'crm' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                  <input type="text" placeholder="Buscar processos, clientes ou documentos..." style={{
                    width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)',
                    borderRadius: '12px', padding: '14px 14px 14px 48px', color: 'white', fontSize: '1em'
                  }} />
                </div>
                <button>Filtrar</button>
              </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-glass)' }}>
                  <tr>
                    <th style={{ padding: '20px' }}>Processo / Cliente</th>
                    <th style={{ padding: '20px' }}>Última Atualização</th>
                    <th style={{ padding: '20px' }}>Status</th>
                    <th style={{ padding: '20px' }}>Lucratividade</th>
                    <th style={{ padding: '20px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '102.344', client: 'João Silva', update: 'Há 2 horas', status: 'Em Instrução', profit: 'R$ 8.500', color: 'success' },
                    { id: '99.123', client: 'Maria Santos', update: 'Há 1 dia', status: 'Petição Inicial', profit: 'R$ 12.000', color: 'pending' },
                    { id: '105.889', client: 'TechCorp Ltda', update: 'Há 3 dias', status: 'Sentença', profit: 'R$ 45.200', color: 'success' },
                  ].map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '20px' }}>
                        <div style={{ fontWeight: '600' }}>{item.client}</div>
                        <div style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>Proc: {item.id}</div>
                      </td>
                      <td style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>{item.update}</td>
                      <td style={{ padding: '20px' }}>
                        <span className={`status-badge ${item.color === 'success' ? 'success' : ''}`} style={{ background: item.color === 'pending' ? 'rgba(255, 165, 0, 0.1)' : '', color: item.color === 'pending' ? '#ffa500' : '' }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px', fontWeight: '700', color: 'var(--success)' }}>{item.profit}</td>
                      <td style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="secondary" style={{ padding: '8px' }} onClick={() => sendWhatsAppUpdate(item.client, item.id)}>
                            <MessageSquare size={16} />
                          </button>
                          <button className="secondary" style={{ padding: '8px' }}>
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showCheckIn && selectedCase && (
        <Modal title="Check-in de Audiência" onClose={() => setShowCheckIn(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Processo: <strong>{selectedCase.case}</strong></p>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9em' }}>Custos de Diligência / Custas</label>
              <input type="number" placeholder="R$ 0,00" style={{
                width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)',
                borderRadius: '8px', padding: '12px', color: 'white'
              }} />
            </div>

            <div style={{ padding: '16px', background: 'rgba(0, 210, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
              <p style={{ fontSize: '0.85em', color: 'var(--accent-metallic)', marginBottom: '8px' }}>Template de WhatsApp</p>
              <p style={{ fontSize: '0.9em', fontStyle: 'italic' }}>
                "Olá, informamos que a audiência do seu processo foi concluída com sucesso. O status já está disponível no seu Portal VIP."
              </p>
            </div>

            <button style={{ width: '100%' }} onClick={() => {
              sendWhatsAppUpdate(selectedCase.case.split(' ')[0], selectedCase.id);
              setShowCheckIn(false);
            }}>
              Finalizar & Enviar Atualização
            </button>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        input:focus {
          outline: none;
          border-color: var(--accent-metallic);
          box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
        }

        tr:hover {
          background: rgba(255, 255, 255, 0.01);
        }
      `}</style>
    </div>
  );
};

export default App;
