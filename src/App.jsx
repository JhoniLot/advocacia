import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wallet, 
  ExternalLink, 
  MessageSquare, 
  Gift, 
  TrendingUp, 
  DollarSign, 
  Clock 
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
            <Calendar size={20} /> Agenda de Prazos
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
              + Novo Processo
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.2em' }}>Análise de Lucratividade</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-metallic)' }}></div>
                    <span style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>Receita</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                    <span style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>Lucro</span>
                  </div>
                </div>
              </div>
              
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
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
