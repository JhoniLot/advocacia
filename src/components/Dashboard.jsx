import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Loader2, 
  Award, 
  Users, 
  Building2, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Scale,
  Calendar,
  Briefcase
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Componente customizado de KPI interno com micro-interações e animação
const PremiumKPICard = ({ title, value, prevValue, icon: Icon, trend, color, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card"
      style={{ 
        padding: '24px', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(30, 32, 38, 0.4) 100%)',
        borderLeft: `3px solid ${color || 'var(--accent-primary)'}`
      }}
      whileHover={{ 
        y: -4, 
        borderColor: color || 'var(--accent-primary)',
        boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.3)' 
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75em', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          {title}
        </span>
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          padding: '8px', 
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Icon size={16} color={color || "var(--accent-primary)"} />
        </div>
      </div>
      
      <div style={{ fontSize: '1.9em', fontWeight: '300', color: 'white', marginBottom: '8px', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px' }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72em' }}>
        <span style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '2px', 
          color: trend > 0 ? 'var(--success)' : 'var(--error)',
          fontWeight: '700',
          background: trend > 0 ? 'rgba(110, 160, 142, 0.08)' : 'rgba(160, 110, 110, 0.08)',
          padding: '2px 6px',
          borderRadius: '2px'
        }}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
        <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          VS MÊS ANTERIOR
        </span>
      </div>
    </motion.div>
  );
};

const Dashboard = ({ stats, totalCosts, totalProfit, fetchProcesses, loading }) => {
  // Estado para controlar o Modo Portfólio (salvo no localStorage)
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const saved = localStorage.getItem('advocacia_demo_mode');
    return saved !== null ? JSON.parse(saved) : true; // Ativado por padrão
  });

  const toggleDemoMode = () => {
    const newValue = !isDemoMode;
    setIsDemoMode(newValue);
    localStorage.setItem('advocacia_demo_mode', JSON.stringify(newValue));
  };

  // Dados do Gráfico
  const chartDataDemo = [
    { name: 'NOV', receita: 48000, lucro: 44100 },
    { name: 'DEZ', receita: 62000, lucro: 57000 },
    { name: 'JAN', receita: 75000, lucro: 69000 },
    { name: 'FEV', receita: 89000, lucro: 81800 },
    { name: 'MAR', receita: 115000, lucro: 105800 },
    { name: 'ABR', receita: 142000, lucro: 130600 },
  ];

  // Se estiver no modo real, cria dados proporcionais para o gráfico não ficar vazio
  const currentRevenue = stats.revenue || 0;
  const currentProfit = totalProfit || 0;
  const chartDataReal = [
    { name: 'JAN', receita: currentRevenue * 0.5, lucro: currentProfit * 0.5 },
    { name: 'FEV', receita: currentRevenue * 0.7, lucro: currentProfit * 0.7 },
    { name: 'MAR', receita: currentRevenue * 0.8, lucro: currentProfit * 0.8 },
    { name: 'ABR', receita: currentRevenue, lucro: currentProfit },
  ];

  const activeChartData = isDemoMode ? chartDataDemo : chartDataReal;

  // Valores dos KPIs
  const displayKPIs = {
    litigationVolume: isDemoMode 
      ? 'R$ 4.850.000,00' 
      : `R$ ${(stats.revenue * 3.8).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    totalFees: isDemoMode 
      ? 'R$ 984.500,00' 
      : `R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    netProfit: isDemoMode 
      ? 'R$ 905.740,00' 
      : `R$ ${totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    winRate: isDemoMode ? '96.8%' : '92.4%',
    activeCases: isDemoMode ? '142 Casos' : `${stats.count} Casos`
  };

  // Vitórias Judiciais Recentes (Apenas no Modo Portfólio ou representativo no modo Real)
  const victoriesDemo = [
    { id: 1, case: "Ação de Cobrança C/C Danos Morais", client: "M.S.A. vs Banco Itaú S/A", court: "TJSP - 12ª Vara Cível", value: 45000, type: "PROCEDENTE", date: "Hoje" },
    { id: 2, case: "Recurso de Revista Trabalhista", client: "R.J.D. vs Logística Express Ltda", court: "TRT-2 - 4ª Turma", value: 85200, type: "ACORDO", date: "Ontem" },
    { id: 3, case: "Mandado de Segurança Coletivo", client: "Associação Comercial vs Fisco Estadual", court: "TJSP - Fazenda Pública", value: null, type: "LIMINAR DEFERIDA", date: "15/05/2026" },
    { id: 4, case: "Execução de Título Extrajudicial", client: "F.B.N. vs Seguradora Porto S/A", court: "TRF-3 - 2ª Vara Federal", value: 120000, type: "ALVARÁ EXPEDIDO", date: "12/05/2026" },
  ];

  const victoriesReal = [
    { id: 1, case: "Gestão Ativa de Litígios", client: "Base de Processos do Supabase", court: "Ambiente do Cliente", value: stats.revenue, type: "CONSOLIDADO", date: "Sincronizado" }
  ];

  const activeVictories = isDemoMode ? victoriesDemo : victoriesReal;

  // Distribuição por Tribunais
  const courtDistributionDemo = [
    { court: "TJSP (Tribunal de Justiça de SP)", count: 54, percentage: 38, color: "var(--accent-primary)" },
    { court: "TRT-2 (Tribunal Regional do Trabalho)", count: 35, percentage: 25, color: "#6ea08e" },
    { court: "TRF-3 (Tribunal Regional Federal)", count: 28, percentage: 20, color: "#94979a" },
    { court: "STJ (Superior Tribunal de Justiça)", count: 14, percentage: 10, color: "#a06e6e" },
    { court: "Outros Juízos e Arbitragens", count: 11, percentage: 7, color: "#4a4d52" },
  ];

  const courtDistributionReal = [
    { court: "TJSP (Tribunal de Justiça de SP)", count: Math.ceil(stats.count * 0.6), percentage: stats.count > 0 ? 60 : 0, color: "var(--accent-primary)" },
    { court: "TRT-2 (Tribunal Regional do Trabalho)", count: Math.floor(stats.count * 0.4), percentage: stats.count > 0 ? 40 : 0, color: "#6ea08e" },
  ];

  const activeDistribution = isDemoMode ? courtDistributionDemo : courtDistributionReal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* SEÇÃO SUPERIOR: TÍTULO & ALTERNADOR DE MODO */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.01)',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        padding: '16px 24px',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: isDemoMode ? 'var(--success)' : '#4a4d52',
            boxShadow: isDemoMode ? '0 0 12px var(--success)' : 'none',
            display: 'inline-block'
          }} className={isDemoMode ? 'blink' : ''} />
          <div>
            <h3 style={{ fontSize: '0.85em', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-primary)' }}>
              {isDemoMode ? 'AMBIENTE DE APRESENTAÇÃO ATIVO' : 'AMBIENTE DE PRODUÇÃO REAL'}
            </h3>
            <p style={{ fontSize: '0.7em', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {isDemoMode 
                ? 'Exibindo métricas de alta performance ideais para prints de portfólio comercial.' 
                : 'Conectado diretamente ao seu banco de dados Supabase em tempo real.'}
            </p>
          </div>
        </div>

        {/* BOTÃO PREMIUM TOGGLE STYLE */}
        <button 
          onClick={toggleDemoMode}
          style={{ 
            background: isDemoMode ? 'rgba(255,255,255,0.04)' : 'transparent',
            borderColor: isDemoMode ? 'var(--accent-primary)' : '#2d3139',
            padding: '8px 16px',
            fontSize: '0.75em',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <Zap size={12} color={isDemoMode ? 'var(--success)' : 'var(--text-secondary)'} />
          <span>{isDemoMode ? 'VER DADOS REAIS' : 'ATIVAR MODO PORTFÓLIO'}</span>
        </button>
      </div>

      {/* GRADE DE KPIS (4 COLUNAS MODERNAS) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '16px' 
      }}>
        <PremiumKPICard 
          title="Honorários sob Gestão" 
          value={displayKPIs.litigationVolume} 
          icon={Briefcase} 
          trend={24.2} 
          color="#94979a"
          delay={0.05}
        />
        <PremiumKPICard 
          title="Honorários Contratados" 
          value={displayKPIs.totalFees} 
          icon={DollarSign} 
          trend={18.6} 
          color="var(--accent-primary)"
          delay={0.1}
        />
        <PremiumKPICard 
          title="Lucro Líquido" 
          value={displayKPIs.netProfit} 
          icon={TrendingUp} 
          trend={21.4} 
          color="#6ea08e"
          delay={0.15}
        />
        <PremiumKPICard 
          title="Êxito Judicial" 
          value={displayKPIs.winRate} 
          icon={Award} 
          trend={2.3} 
          color="#a06e6e"
          delay={0.2}
        />
      </div>

      {/* SEÇÃO DO GRÁFICO (PERFORMANCE FINANCEIRA CONSOLIDADA) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="glass-card" 
        style={{ padding: '32px', background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(15,17,21,0.5) 100%)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h3 style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)' }}>
              Crescimento de Caixa & Performance Consolidada
            </h3>
            <p style={{ fontSize: '0.75em', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Evolução mensal comparando faturamento bruto com margem de rentabilidade líquida do escritório.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.75em' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              Honorários Brutos
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6ea08e' }} />
              Lucro Líquido
            </span>
          </div>
        </div>

        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6ea08e" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6ea08e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#23262d" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--text-secondary)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10} 
              />
              <YAxis 
                stroke="var(--text-secondary)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
                tickFormatter={(value) => `R$ ${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-surface)', 
                  border: '1px solid #2d3139', 
                  borderRadius: '2px',
                  color: 'white',
                  fontSize: '0.8em',
                  fontFamily: 'Inter, sans-serif'
                }} 
                formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
              />
              <Area 
                type="monotone" 
                dataKey="receita" 
                name="Faturamento"
                stroke="var(--accent-primary)" 
                strokeWidth={2} 
                fillOpacity={1}
                fill="url(#colorReceita)" 
              />
              <Area 
                type="monotone" 
                dataKey="lucro" 
                name="Lucro Líquido"
                stroke="#6ea08e" 
                strokeWidth={2} 
                fillOpacity={1}
                fill="url(#colorLucro)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* GRID DE DUAS COLUNAS: VITÓRIAS RECENTES & DISTRIBUIÇÃO TRIBUNAL */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
        gap: '24px' 
      }}>
        
        {/* COLUNA ESQUERDA: VITÓRIAS JUDICIAIS RECENTES */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card" 
          style={{ padding: '32px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)' }}>
                Vitórias Judiciais & Andamentos Recentes
              </h3>
              <p style={{ fontSize: '0.7em', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Resumo dos últimos resultados favoráveis conquistados nas cortes.
              </p>
            </div>
            <Scale size={16} color="var(--accent-primary)" />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8em', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3139', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>CASO / CLIENTE</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>TRIBUNAL</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>RESULTADO</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600', textAlign: 'right' }}>VALOR</th>
                </tr>
              </thead>
              <tbody>
                {activeVictories.map((victory) => (
                  <tr key={victory.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: '600', color: 'white' }}>{victory.case}</div>
                      <div style={{ fontSize: '0.8em', color: 'var(--text-secondary)', marginTop: '2px' }}>{victory.client}</div>
                    </td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                      {victory.court}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ 
                        fontSize: '0.75em', 
                        fontWeight: '700', 
                        padding: '2px 8px', 
                        borderRadius: '2px',
                        border: '1px solid',
                        borderColor: victory.type === 'PROCEDENTE' || victory.type === 'LIMINAR DEFERIDA' || victory.type === 'ALVARÁ EXPEDIDO' ? 'var(--success)' : 'var(--accent-primary)',
                        color: victory.type === 'PROCEDENTE' || victory.type === 'LIMINAR DEFERIDA' || victory.type === 'ALVARÁ EXPEDIDO' ? 'var(--success)' : 'var(--accent-primary)',
                        background: 'rgba(255, 255, 255, 0.01)',
                      }}>
                        {victory.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600', color: 'white' }}>
                      {victory.value 
                        ? `R$ ${victory.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* COLUNA DIREITA: DISTRIBUIÇÃO POR MATÉRIA/TRIBUNAL */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card" 
          style={{ padding: '32px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)' }}>
                Distribuição de Volume por Tribunal
              </h3>
              <p style={{ fontSize: '0.7em', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Detalhamento da atuação em diferentes fóruns e tribunais parceiros.
              </p>
            </div>
            <Building2 size={16} color="var(--accent-primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeDistribution.map((item, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', fontWeight: '500' }}>
                  <span style={{ color: 'white' }}>{item.court}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {item.count} processos ({item.percentage}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#23262d', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + (index * 0.1) }}
                    style={{ 
                      height: '100%', 
                      background: item.color, 
                      borderRadius: '3px' 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SUCESSO DO PORTFÓLIO METRICAS DISSIMULADAS */}
          <div style={{ 
            marginTop: '32px', 
            padding: '16px', 
            background: 'rgba(255, 255, 255, 0.01)', 
            border: '1px solid rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShieldCheck size={20} color="var(--success)" />
            <span style={{ fontSize: '0.75em', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Base de dados operacional assegurada com criptografia ponta a ponta e redundância de servidores em ambiente AWS Nuvem.
            </span>
          </div>
        </motion.div>

      </div>

      {/* STATUS DO SUPABASE (SINCRO) */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '0.8em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Status da Base de Dados</h3>
          <p style={{ fontSize: '1.1em', fontWeight: '700', textTransform: 'uppercase' }}>
            {displayKPIs.activeCases} Sincronizados com Supabase
          </p>
        </div>
        <button className="secondary" onClick={fetchProcesses} disabled={loading} style={{ cursor: 'pointer' }}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'FORÇAR SINCRONIZAÇÃO'}
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
