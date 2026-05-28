import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const COLORS = {
  background: '#09090b',
  foreground: '#fafafa',
  card: '#18181b',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
  border: '#27272a',
};

export default function LoginPage() {
  const { login, loading } = useAuth();
  const { tokens } = useTheme();
  const [checkingToken, setCheckingToken] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('auth-token', token);
      window.location.replace('/dashboard');
      return;
    }
    const err = params.get('error');
    if (err) setError(decodeURIComponent(err.replace(/_/g, ' ')));
    setCheckingToken(false);
  }, []);

  if (checkingToken) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: tokens?.accent || '#a855f7' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.card, padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '360px', border: `1px solid ${COLORS.border}` }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', background: COLORS.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><Wrench size={24} /></div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: COLORS.foreground }}>Admin Dashboard</h2>
          <p style={{ fontSize: '0.875rem', color: COLORS.mutedForeground }}>Sign in with GitHub to manage your portfolio</p>
        </div>
        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>{error}</p>}
        <button
          onClick={login}
          disabled={loading}
          style={{
            width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'default' : 'pointer',
            fontWeight: 500, fontSize: '0.875rem', background: tokens?.accent || '#a855f7', color: tokens?.bg || '#09090b',
            opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}
        >
          {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign in with GitHub'}
        </button>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
