import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../services/http';

const COLORS = {
  background: '#09090b',
  foreground: '#fafafa',
  card: '#18181b',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
  border: '#27272a',
};

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Login failed');

      localStorage.setItem('admin-token', json.data.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, padding: '1rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: COLORS.card, padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '360px', border: `1px solid ${COLORS.border}` }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', background: COLORS.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Shield size={24} color="#a855f7" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: COLORS.foreground }}>Super Admin</h2>
          <p style={{ fontSize: '0.875rem', color: COLORS.mutedForeground }}>Sign in to manage the platform</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ width: '100%', padding: '0.625rem 0.75rem', background: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '0.5rem', color: COLORS.foreground, fontSize: '0.875rem', outline: 'none', marginBottom: '0.75rem' }}
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: '100%', padding: '0.625rem 0.75rem', background: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '0.5rem', color: COLORS.foreground, fontSize: '0.875rem', outline: 'none', marginBottom: '1rem' }}
          />

          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{
              width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.875rem', background: '#a855f7', color: 'white',
              opacity: loading || !email || !password ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={16} /></motion.div> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
