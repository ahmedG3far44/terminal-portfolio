import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Terminal, Shield, Palette, Globe, Database, GitBranch, LayoutDashboard, Code2, LogIn, User } from 'lucide-react';

const COLORS = {
  bg: '#09090b',
  fg: '#fafafa',
  card: '#18181b',
  muted: '#27272a',
  mutedFg: '#a1a1aa',
  border: '#27272a',
  primary: '#39ff14',
  primaryRgb: '57, 255, 20',
};

const features = [
  {
    icon: Terminal,
    title: 'Terminal Portfolio',
    desc: 'A unique terminal-themed portfolio with command-line aesthetics, project cards, and README rendering.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Integration',
    desc: 'Live contribution heatmap, stats, and repository browser — all proxied through the server for security.',
  },
  {
    icon: LayoutDashboard,
    title: 'Admin Dashboard',
    desc: 'Full CRUD for projects, skills, and personal info. GitHub OAuth login with JWT session management.',
  },
  {
    icon: Shield,
    title: 'Super Admin Panel',
    desc: 'Platform-wide insights, user management (search, block/activate), and color theme CRUD.',
  },
  {
    icon: Palette,
    title: 'Custom Themes',
    desc: 'DB-driven color themes managed by super admin. Users pick from available accent colors.',
  },
  {
    icon: Globe,
    title: 'Internationalization',
    desc: 'English/Arabic support with RTL layout, keyboard shortcut toggle, and JSON-based translations.',
  },
  {
    icon: Database,
    title: 'MongoDB Backend',
    desc: 'Express + Mongoose API server with per-user portfolios, GitHub OAuth users, and theme collections.',
  },
  {
    icon: Code2,
    title: 'TypeScript Monorepo',
    desc: 'Shared types between client and server. Custom fetch interceptor and query hooks — zero external HTTP libs.',
  },
];

function FeatureCard({ icon: Icon, title, desc, i }: { icon: any; title: string; desc: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08 }}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '0.75rem',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '0.5rem',
          background: `rgba(${COLORS.primaryRgb}, 0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: COLORS.primary,
        }}
      >
        <Icon size={20} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: COLORS.fg }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: COLORS.mutedFg, lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
  );
}

export default function Landing() {
  const { isAuthenticated, user, login } = useAuth();
  const isSuperAdmin = !!localStorage.getItem('admin-token');

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: "'JetBrains Mono', monospace" }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(${COLORS.primaryRgb}, 0.02) 2px, rgba(${COLORS.primaryRgb}, 0.02) 4px)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <nav
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: COLORS.primary, fontWeight: 700, fontSize: '1.1rem' }}>
          <Terminal size={20} />
          Portfolio Platform
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isAuthenticated && user ? (
            <Link
              to={`/${user.username}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.375rem 0.75rem 0.375rem 0.375rem',
                borderRadius: '9999px', border: `1px solid ${COLORS.border}`,
                color: COLORS.mutedFg, textDecoration: 'none', fontSize: '0.8125rem',
              }}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: COLORS.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} style={{ color: COLORS.mutedFg }} />
                </div>
              )}
              <span>@{user.username}</span>
            </Link>
          ) : (
            <button onClick={login}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                background: 'transparent', border: `1px solid ${COLORS.border}`,
                color: COLORS.mutedFg, fontSize: '0.8125rem', cursor: 'pointer',
              }}
            >
              <LogIn size={16} /> Login
            </button>
          )}
          <Link to="/admin" style={{ color: COLORS.mutedFg, textDecoration: 'none', fontSize: '0.875rem' }}>Admin</Link>
          {isSuperAdmin && (
            <Link to="/admin/super" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: COLORS.primary, color: COLORS.bg, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Super Admin</Link>
          )}
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '0.8rem', color: `rgba(${COLORS.primaryRgb}, 0.5)`, marginBottom: '1rem', letterSpacing: '0.2em' }}
          >
            {'> cat ./platform/features'}
          </motion.div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: COLORS.fg, marginBottom: '1rem', lineHeight: 1.2 }}>
            Full-Stack{' '}
            <span style={{ color: COLORS.primary, textShadow: `0 0 20px rgba(${COLORS.primaryRgb}, 0.5)` }}>
              Portfolio
            </span>{' '}
            Platform
          </h1>

          <p style={{ fontSize: '1rem', color: COLORS.mutedFg, maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
            A modern, terminal-themed portfolio application with GitHub OAuth, MongoDB persistence,
            super admin management, and real-time GitHub integration — all built with TypeScript.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated && user ? (
              <Link
                to={`/${user.username}`}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  background: COLORS.primary,
                  color: COLORS.bg,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Terminal size={18} />
                View My Portfolio
              </Link>
            ) : (
              <button onClick={login}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  background: COLORS.primary,
                  color: COLORS.bg,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <LogIn size={18} />
                Sign in with GitHub
              </button>
            )}
            <a
              href="https://github.com/ahmedG3far44/terminal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: `1px solid ${COLORS.border}`,
                color: COLORS.fg,
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <GitBranch size={18} />
              Source Code
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: '0.75rem', color: `rgba(${COLORS.primaryRgb}, 0.5)`, marginBottom: '1.5rem', letterSpacing: '0.15em' }}
        >
          {'> ls ./features'}
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} i={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: '4rem',
            padding: '2rem',
            background: COLORS.card,
            borderRadius: '0.75rem',
            border: `1px solid ${COLORS.border}`,
            textAlign: 'center',
          }}
        >
          <p style={{ color: `rgba(${COLORS.primaryRgb}, 0.6)`, fontSize: '0.8rem', marginBottom: '0.5rem' }}>{'> Tech Stack'}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: COLORS.mutedFg }}>
            {['React', 'TypeScript', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'Vite', 'Framer Motion', 'GitHub API'].map((tech) => (
              <span key={tech} style={{ padding: '0.4rem 0.8rem', border: `1px solid ${COLORS.border}`, borderRadius: '0.375rem' }}>
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </main>

      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '2rem',
          borderTop: `1px solid ${COLORS.border}`,
          color: COLORS.mutedFg,
          fontSize: '0.8rem',
        }}
      >
        Built with TypeScript & React &middot; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
