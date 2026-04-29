import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login = ({ setSession }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
          alert('Cadastro realizado! Você já pode fazer login se confirmou o email (se exigido).');
          setIsSignUp(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError('Credenciais inválidas. Verifique seu e-mail e senha.');
      else setSession(data.session);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#05060a' }}>
      <div className="glass-card" style={{ width: '400px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2em', fontWeight: '800', letterSpacing: '2px' }}>PRIME <span style={{ fontWeight: '300', color: 'var(--accent-primary)' }}>JURÍDICO</span></h2>
          <p style={{ fontSize: '0.7em', color: 'var(--text-secondary)', marginTop: '8px', letterSpacing: '3px' }}>ACESSO RESTRITO</p>
        </div>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="email" 
            placeholder="E-MAIL INSTITUCIONAL" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
          />
          <input 
            type="password" 
            placeholder="SENHA DE ACESSO" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
          />
          {error && <p style={{ color: '#a06e6e', fontSize: '0.8em', textAlign: 'center' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : (isSignUp ? 'CRIAR CONTA' : 'ENTRAR NO SISTEMA')}
          </button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <button className="secondary" onClick={() => setIsSignUp(!isSignUp)} style={{ border: 'none', fontSize: '0.75em', cursor: 'pointer' }}>
            {isSignUp ? 'Já tem uma conta? Faça login' : 'Primeiro acesso? Crie sua conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
