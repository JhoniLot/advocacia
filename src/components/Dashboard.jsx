import React from 'react';
import { DollarSign, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import KPICard from './KPICard';

const chartData = [
  { name: 'JAN', profit: 4000, revenue: 6000 },
  { name: 'FEV', profit: 3000, revenue: 5000 },
  { name: 'MAR', profit: 5000, revenue: 8000 },
  { name: 'ABR', profit: 4500, revenue: 7500 },
];

const Dashboard = ({ stats, totalCosts, totalProfit, fetchProcesses, loading }) => {
  return (
    <div>
      <div className="kpi-grid">
        <KPICard 
          title="Honorários Totais" 
          value={`R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          trend={stats.count > 0 ? 100 : 0} 
        />
        <KPICard 
          title="Custos (Estimados)" 
          value={`R$ ${totalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={Clock} 
          trend={-5} 
        />
        <KPICard 
          title="Lucro Líquido" 
          value={`R$ ${totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={TrendingUp} 
          trend={stats.count > 0 ? 100 : 0} 
        />
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
  );
};

export default Dashboard;
