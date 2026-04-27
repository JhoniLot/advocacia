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
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ShieldCheck
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

const data = [
  { name: 'JAN', profit: 4000, revenue: 6000 },
  { name: 'FEV', profit: 3000, revenue: 5000 },
  { name: 'MAR', profit: 5000, revenue: 8000 },
  { name: 'ABR', profit: 4500, revenue: 7500 },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const KPICard = ({ title, value, icon: Icon, trend, status }) => (
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
      background: 'rgba(0,0,0,0.9)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="glass-card" style={{ width: '500px', padding: '40px', position: 'relative', background: 'var(--bg-surface)' }}>
        <h2 style={{ marginBottom: '32px', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h2>
        {children}
        <button className="secondary" onClick={onClose} style={{ marginTop: '32px', width: '100%' }}>CANCELAR</button>
      </div>
    </div>
  );

  const sendWhatsAppUpdate = (clientName, processNumber) => {
    const message = `Prezado(a) ${clientName}, informamos que houve uma atualização no processo ${processNumber}. Para mais detalhes, acesse seu Portal de Acompanhamento. Atenciosamente, Escritório Prime.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '8px', height: '8px', background: '#6ea08e' }}></div>
            <span style={{ fontSize: '0.7em', fontWeight: '700', letterSpacing: '1px' }}>SISTEMA OPERACIONAL</span>
          </div>
          <button className="secondary" style={{ width: '100%', fontSize: '0.7em', padding: '10px' }}>
            <ExternalLink size={12} /> ACESSO EXTERNO
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ fontSize: '1.8em', fontWeight: '300', marginBottom: '4px' }}>GESTÃO <span style={{ fontWeight: '700' }}>ESTRATÉGICA</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1px' }}>DR. VINICIUS — SÓCIO DIRETOR</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="secondary" style={{ border: '1px solid #2d3139' }}>
              <Gift size={16} /> NOTIFICAÇÕES (2)
            </button>
            <button>
              <Plus size={16} /> REGISTRAR CASO
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="kpi-grid">
              <KPICard title="Receita Bruta" value="R$ 142.500,00" icon={DollarSign} trend={12.5} />
              <KPICard title="Custos Operacionais" value="R$ 12.400,00" icon={Clock} trend={-4.2} />
              <KPICard title="Lucro Líquido" value="R$ 130.100,00" icon={TrendingUp} trend={18.1} />
            </div>

            <div className="glass-card" style={{ padding: '40px', marginTop: '24px' }}>
              <h3 style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '40px', color: 'var(--text-secondary)' }}>Performance Financeira Consolidada</h3>
              <div style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="0" stroke="#2d3139" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-surface)', border: '1px solid #2d3139', borderRadius: '0' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={2} fill="rgba(142, 145, 150, 0.05)" />
                    <Area type="monotone" dataKey="profit" stroke="var(--text-primary)" strokeWidth={2} fill="rgba(255, 255, 255, 0.05)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Content */}
        {activeTab === 'calendar' && (
          <div>
            <div className="glass-card" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <h2 style={{ fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '2px' }}>Prazos e Diligências</h2>
                <div style={{ display: 'flex', gap: '1px', background: '#2d3139' }}>
                  <button className="secondary" style={{ border: 'none', background: 'var(--bg-surface)' }}>DIA</button>
                  <button className="secondary" style={{ border: 'none', background: 'var(--bg-surface)' }}>SEMANA</button>
                  <button className="secondary" style={{ border: 'none', background: 'var(--bg-surface)' }}>MÊS</button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#2d3139' }}>
                {[
                  { id: 1, type: 'Audiência', case: 'João Silva vs. TechCorp', time: '14:00', date: 'HOJE', urgent: false },
                  { id: 2, type: 'Prazo Fatal', case: 'Maria Santos - Contestação', time: '23:59', date: 'HOJE', urgent: true },
                  { id: 3, type: 'Audiência', case: 'Pedro Oliveira vs. Bank Alpha', time: '09:30', date: '29 ABR', urgent: false },
                ].map((event) => (
                  <div key={event.id} style={{ background: 'var(--bg-card)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                      <div style={{ minWidth: '80px', borderRight: '1px solid #2d3139' }}>
                        <div style={{ fontSize: '1.1em', fontWeight: '700' }}>{event.time}</div>
                        <div style={{ fontSize: '0.7em', color: event.urgent ? '#a06e6e' : 'var(--text-secondary)' }}>{event.date}</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1em', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{event.case}</div>
                        <div style={{ fontSize: '0.7em', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase' }}>{event.type}</div>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedCase(event); setShowCheckIn(true); }} style={{ fontSize: '0.75em' }}>
                      VALIDAR CONCLUÍDO
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CRM Content */}
        {activeTab === 'crm' && (
          <div>
            <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Search style={{ color: 'var(--text-secondary)' }} size={18} />
                <input type="text" placeholder="BUSCAR NA BASE DE DADOS..." style={{
                  flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '0.85em', letterSpacing: '1px', textTransform: 'uppercase'
                }} />
                <button className="secondary" style={{ padding: '8px 16px' }}>FILTROS</button>
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
                  {[
                    { id: '102.344', client: 'JOÃO SILVA', update: '2H ATRÁS', status: 'INSTRUÇÃO', profit: 'R$ 8.500', color: 'success' },
                    { id: '99.123', client: 'MARIA SANTOS', update: '1 DIA ATRÁS', status: 'INICIAL', profit: 'R$ 12.000', color: 'pending' },
                    { id: '105.889', client: 'TECHCORP LTDA', update: '3 DIAS ATRÁS', status: 'SENTENÇA', profit: 'R$ 45.200', color: 'success' },
                  ].map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #2d3139' }}>
                      <td style={{ padding: '24px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.95em' }}>{item.client}</div>
                        <div style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>ID: {item.id}</div>
                      </td>
                      <td style={{ padding: '24px', color: 'var(--text-secondary)', fontSize: '0.8em' }}>{item.update}</td>
                      <td style={{ padding: '24px' }}>
                        <span className="status-badge" style={{ color: item.color === 'success' ? '#6ea08e' : '#ffa500' }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '24px', fontWeight: '700', fontSize: '0.9em' }}>{item.profit}</td>
                      <td style={{ padding: '24px' }}>
                        <button className="secondary" style={{ padding: '8px' }} onClick={() => sendWhatsAppUpdate(item.client, item.id)}>
                          <MessageSquare size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Finance Content */}
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
                  {[
                    { case: 'SILVA VS TECHCORP', in: 15000, out: 1200, net: 13800, margin: 92 },
                    { case: 'MARIA SANTOS INVENTÁRIO', in: 45000, out: 4500, net: 40500, margin: 90 },
                    { case: 'CONDOMÍNIO SOLAR', in: 8000, out: 150, net: 7850, margin: 98 },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #2d3139' }}>
                      <td style={{ padding: '16px', fontWeight: '700', fontSize: '0.9em' }}>{row.case}</td>
                      <td style={{ padding: '16px', color: 'var(--accent-primary)' }}>+ R$ {row.in.toLocaleString()}</td>
                      <td style={{ padding: '16px', color: '#a06e6e' }}>- R$ {row.out.toLocaleString()}</td>
                      <td style={{ padding: '16px', color: '#6ea08e', fontWeight: '700' }}>R$ {row.net.toLocaleString()}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '4px', background: '#2d3139' }}>
                            <div style={{ width: `${row.margin}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                          </div>
                          <span style={{ fontSize: '0.8em' }}>{row.margin}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Client Portal Content */}
        {activeTab === 'portal' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center', marginBottom: '32px', border: '2px solid var(--accent-primary)' }}>
              <h2 style={{ fontSize: '1.5em', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>Portal de Acompanhamento Executivo</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8em', letterSpacing: '2px' }}>RELATÓRIO DE STATUS EM TEMPO REAL — CANAL EXCLUSIVO</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
              <div className="glass-card" style={{ padding: '40px' }}>
                <h3 style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '40px' }}>Cronograma Processual</h3>
                <div style={{ borderLeft: '1px solid #2d3139', paddingLeft: '32px', position: 'relative' }}>
                  {[
                    { title: 'PETIÇÃO INICIAL PROTOCOLADA', date: '12 JAN 2024', status: 'done' },
                    { title: 'CITAÇÃO DO RÉU', date: '25 JAN 2024', status: 'done' },
                    { title: 'RÉPLICA À CONTESTAÇÃO', date: '10 FEV 2024', status: 'done' },
                    { title: 'AUDIÊNCIA DE CONCILIAÇÃO', date: '27 ABR 2024', status: 'current' },
                    { title: 'SENTENÇA PREVISTA', date: 'JUN 2024', status: 'pending' },
                  ].map((step, i) => (
                    <div key={i} style={{ marginBottom: '40px', position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: '-37px', top: '4px', width: '10px', height: '10px',
                        background: step.status === 'done' ? 'var(--text-primary)' : step.status === 'current' ? 'var(--accent-primary)' : 'var(--bg-deep)',
                        border: step.status === 'pending' ? '1px solid #2d3139' : 'none'
                      }}></div>
                      <div style={{ fontWeight: '700', fontSize: '0.85em', letterSpacing: '1px', color: step.status === 'pending' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{step.title}</div>
                      <div style={{ fontSize: '0.7em', color: 'var(--text-secondary)', marginTop: '4px' }}>{step.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Resumo de Honorários</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75em', color: 'var(--text-secondary)' }}>LIQUIDADO</span>
                    <span style={{ fontWeight: '700' }}>R$ 5.000</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <span style={{ fontSize: '0.75em', color: 'var(--text-secondary)' }}>SALDO</span>
                    <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>R$ 2.500</span>
                  </div>
                  <button style={{ width: '100%', fontSize: '0.7em' }}>LIQUIDAR SALDO</button>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Documentos Oficiais</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75em' }}>
                      <FileText size={14} /> INICIAL_CONSOLIDADA.PDF
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75em' }}>
                      <FileText size={14} /> PROCURACAO_EXEC.PDF
                    </div>
                  </div>
                </div>

                <button style={{ background: '#6ea08e', color: 'white', border: 'none' }}>SOLICITAR REUNIÃO</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showCheckIn && selectedCase && (
        <Modal title="Validação de Diligência" onClose={() => setShowCheckIn(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85em' }}>CASO: <strong style={{ color: 'white' }}>{selectedCase.case}</strong></p>
            
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '1px' }}>Custos de Diligência / Custas</label>
              <input type="number" placeholder="0.00" style={{
                width: '100%', background: 'transparent', border: '1px solid #2d3139',
                padding: '16px', color: 'white', fontSize: '1em'
              }} />
            </div>

            <div style={{ padding: '20px', border: '1px solid #2d3139', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontSize: '0.7em', color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: '800' }}>COMUNICADO AO CLIENTE</p>
              <p style={{ fontSize: '0.8em', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                "Prezado, informamos que a diligência programada para hoje foi concluída. O status atualizado já consta em seu portal."
              </p>
            </div>

            <button style={{ width: '100%' }} onClick={() => {
              sendWhatsAppUpdate(selectedCase.case.split(' ')[0], selectedCase.id);
              setShowCheckIn(false);
            }}>
              CONFIRMAR E NOTIFICAR
            </button>
          </div>
        </Modal>
      )}

      <style>{`
        input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        tr:hover {
          background: rgba(255, 255, 255, 0.01);
        }
      `}</style>
    </div>
  );
};

export default App;
