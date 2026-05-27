import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Terminal, Shield, Palette, Globe, Database, GitBranch, LayoutDashboard, Code2, LogIn, User, Loader2 } from 'lucide-react';

const easeOut = [0.25, 1, 0.5, 1];

const features = [
  {
    icon: Terminal,
    title: 'Terminal Portfolio',
    desc: 'A unique terminal-themed portfolio with command-line aesthetics, project cards, and README rendering.',
    spotlight: true,
  },
  {
    icon: GitBranch,
    title: 'GitHub Integration',
    desc: 'Live contribution heatmap, stats, and repository browser all proxied through the server for security.',
    spotlight: true,
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
    desc: 'Express and Mongoose API server with per-user portfolios, GitHub OAuth users, and theme collections.',
  },
  {
    icon: Code2,
    title: 'TypeScript Monorepo',
    desc: 'Shared types between client and server. Custom fetch interceptor and query hooks.',
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

function FeatureCard({ icon: Icon, title, desc, i, spotlight, tokens }: { icon: any; title: string; desc: string; i: number; spotlight?: boolean; tokens: any }) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: i * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.surface,
        border: `1px solid ${hovered ? tokens.borderSubtle : tokens.borderBase}`,
        borderRadius: spotlight ? '1rem' : '0.75rem',
        padding: spotlight ? '2rem' : '1.5rem',
        transition: prefersReducedMotion ? 'none' : 'border-color 0.3s ease, transform 0.3s ease',
        ...(hovered && !prefersReducedMotion ? { transform: 'translateY(-3px)' } : {}),
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
    >
      <motion.div
        animate={hovered && !prefersReducedMotion ? { scale: 1.08 } : { scale: 1 }}
        transition={{ duration: 0.3, ease: easeOut }}
        style={{
          width: spotlight ? '48px' : '40px',
          height: spotlight ? '48px' : '40px',
          borderRadius: '0.5rem',
          background: `rgba(${tokens.accentRgb}, 0.08)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: tokens.accent,
        }}
      >
        <Icon size={spotlight ? 22 : 20} />
      </motion.div>
      <h3 style={{
        fontSize: spotlight ? '1.1rem' : '1rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        color: tokens.fg,
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}>{title}</h3>
      <p style={{
        fontSize: '0.85rem',
        color: tokens.textMuted,
        lineHeight: 1.7,
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}>{desc}</p>
    </motion.div>
  );
}

function MonoLabel({ children, delay, blink, accentRgb, isRTL }: { children: string; delay?: number; blink?: boolean; accentRgb: string; isRTL?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: easeOut }}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.75rem',
        color: `rgba(${accentRgb}, 0.4)`,
        letterSpacing: '0.2em',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {children}
      {blink && (
        <span style={{
          display: 'inline-block',
          width: '1px',
          height: '0.9em',
          background: `rgba(${accentRgb}, 0.5)`,
          marginLeft: '2px',
          marginRight: '2px',
          verticalAlign: 'text-bottom',
          animation: 'cursor-blink 1s step-end infinite',
        }} />
      )}
    </motion.div>
  );
}

function AvatarPlaceholder({ size, tokens }: { size: number; tokens: any }) {
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      background: tokens.borderBase, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <User size={Math.round(size * 0.54)} style={{ color: tokens.textMuted }} />
    </div>
  );
}

function UserAvatar({ src, alt, size }: { src: string; alt: string; size: number }) {
  const [errored, setErrored] = useState(false);
  if (errored || !src) return null;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      style={{
        width: `${size}px`, height: `${size}px`,
        borderRadius: '50%', objectFit: 'cover',
      }}
    />
  );
}

export default function Landing() {
  const { isAuthenticated, user, login, loading: authLoading } = useAuth();
  const { tokens } = useTheme();
  const { isRTL } = useLanguage();
  const isSuperAdmin = !!localStorage.getItem('admin-token');
  const prefersReducedMotion = useReducedMotion();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = useCallback(() => {
    if (loggingIn) return;
    setLoggingIn(true);
    login();
  }, [loggingIn, login]);

  const username = user?.username || '';
  const profileLink = username ? `/${username}` : '/portfolio';

  return (
    <div style={{ minHeight: '100dvh', background: tokens.bg, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(${tokens.accentRgb}, 0.015) 2px, rgba(${tokens.accentRgb}, 0.015) 4px)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.nav
        initial={prefersReducedMotion ? {} : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: easeOut }}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 2rem',
          borderBottom: `1px solid ${tokens.borderBase}`,
        }}
      >
        <motion.div
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: tokens.accent, fontWeight: 700, fontSize: '1.1rem' }}
        >
          <Terminal size={20} />
          Portfolio Platform
        </motion.div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {authLoading ? (
            <div style={{ width: '80px', height: '30px', borderRadius: '0.5rem', background: tokens.borderBase }} />
          ) : isAuthenticated && user ? (
            <Link
              to={profileLink}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.375rem 0.75rem 0.375rem 0.375rem',
                borderRadius: '9999px', border: `1px solid ${tokens.borderBase}`,
                color: tokens.textMuted, textDecoration: 'none', fontSize: '0.8125rem',
                transition: prefersReducedMotion ? 'none' : 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => { if (!prefersReducedMotion) e.currentTarget.style.borderColor = tokens.borderSubtle; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.borderBase; }}
            >
              {user.avatarUrl ? (
                <UserAvatar src={user.avatarUrl} alt={user.username || 'User'} size={26} />
              ) : (
                <AvatarPlaceholder size={26} tokens={tokens} />
              )}
              <span>@{username || 'user'}</span>
            </Link>
          ) : (
            <motion.button onClick={handleLogin}
              disabled={loggingIn}
              whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                background: 'transparent', border: `1px solid ${tokens.borderBase}`,
                color: tokens.textMuted, fontSize: '0.8125rem', cursor: loggingIn ? 'not-allowed' : 'pointer',
                opacity: loggingIn ? 0.6 : 1,
                transition: prefersReducedMotion ? 'none' : 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => { if (!prefersReducedMotion && !loggingIn) e.currentTarget.style.borderColor = tokens.borderSubtle; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.borderBase; }}
            >
              {loggingIn ? <Loader2 size={16} /> : <LogIn size={16} />}
              {loggingIn ? 'Redirecting...' : 'Login'}
            </motion.button>
          )}
          <Link to="/admin" style={{ color: tokens.textMuted, textDecoration: 'none', fontSize: '0.875rem' }}>Admin</Link>
          {isSuperAdmin && (
            <Link to="/admin/super" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: tokens.accent, color: tokens.bg, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
              Super Admin
            </Link>
          )}
        </div>
      </motion.nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: '1120px', margin: '0 auto', padding: '6rem 2rem 4rem', direction: isRTL ? 'rtl' : 'ltr' }}>
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
          style={{ textAlign: isRTL ? 'right' : 'center', marginBottom: '6rem' }}
        >
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: easeOut }}
            style={{ marginBottom: '1.5rem' }}
          >
            <MonoLabel blink accentRgb={tokens.accentRgb} isRTL={isRTL}>{'> cat ./platform/features'}</MonoLabel>
          </motion.div>

          <motion.h1
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 800,
              color: tokens.fg,
              marginBottom: '1.25rem',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            Full-Stack{' '}
            <span style={{
              color: tokens.accent,
              textShadow: `0 0 20px rgba(${tokens.accentRgb}, 0.4)`,
              animation: prefersReducedMotion ? 'none' : 'glow-pulse 3s ease-in-out infinite',
            }}>
              Portfolio
            </span>{' '}
            Platform
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: easeOut }}
            style={{
              fontSize: '1rem',
              color: tokens.textMuted,
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.8,
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              textAlign: isRTL ? 'right' : 'center',
            }}
          >
            A modern, terminal-themed portfolio application with GitHub OAuth, MongoDB persistence,
            super admin management, and real-time GitHub integration all built with TypeScript.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: easeOut }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {isAuthenticated && user ? (
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                <Link
                  to={profileLink}
                  style={{
                    padding: '0.75rem 2rem',
                    borderRadius: '0.5rem',
                    background: tokens.accent,
                    color: tokens.bg,
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: prefersReducedMotion ? 'none' : 'background 0.2s ease',
                  }}
                >
                  <Terminal size={18} />
                  View My Portfolio
                </Link>
              </motion.div>
            ) : (
              <motion.button onClick={handleLogin}
                disabled={loggingIn}
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  background: tokens.accent,
                  color: tokens.bg,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: loggingIn ? 'not-allowed' : 'pointer',
                  opacity: loggingIn ? 0.6 : 1,
                  transition: prefersReducedMotion ? 'none' : 'background 0.2s ease',
                }}
              >
                {loggingIn ? <Loader2 size={18} /> : <LogIn size={18} />}
                {loggingIn ? 'Redirecting...' : 'Sign in with GitHub'}
              </motion.button>
            )}
            <motion.a
              href="https://github.com/ahmedG3far44/terminal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: `1px solid ${tokens.borderBase}`,
                color: tokens.fg,
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: prefersReducedMotion ? 'none' : 'border-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={(e) => { if (!prefersReducedMotion) { e.currentTarget.style.borderColor = tokens.borderSubtle; e.currentTarget.style.color = tokens.fg; } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.borderBase; e.currentTarget.style.color = tokens.fg; }}
            >
              <GitBranch size={18} />
              Source Code
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: easeOut }}
          style={{ marginBottom: '1.5rem' }}
        >
          <MonoLabel accentRgb={tokens.accentRgb} isRTL={isRTL}>{'> ls ./features'}</MonoLabel>
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? {} : stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
            {features.slice(0, 2).map((f, i) => (
              <FeatureCard key={f.title} {...f} i={i} spotlight tokens={tokens} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {features.slice(2, 5).map((f, i) => (
              <FeatureCard key={f.title} {...f} i={i + 2} tokens={tokens} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {features.slice(5, 8).map((f, i) => (
              <FeatureCard key={f.title} {...f} i={i + 5} tokens={tokens} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: easeOut }}
          style={{ marginTop: '4rem', borderTop: `1px solid ${tokens.borderBase}`, paddingTop: '2rem' }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <MonoLabel accentRgb={tokens.accentRgb} isRTL={isRTL}>{'> Tech Stack'}</MonoLabel>
          </div>
          <motion.div
            variants={prefersReducedMotion ? {} : { visible: { transition: { staggerChildren: 0.04 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            {['React', 'TypeScript', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'Vite', 'Framer Motion', 'GitHub API'].map((tech) => (
              <motion.span
                key={tech}
                variants={prefersReducedMotion ? {} : { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } } }}
                style={{
                  padding: '0.4rem 0.8rem',
                  border: `1px solid ${tokens.borderBase}`,
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  color: tokens.textMuted,
                  transition: prefersReducedMotion ? 'none' : 'border-color 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!prefersReducedMotion) { e.currentTarget.style.borderColor = tokens.borderSubtle; e.currentTarget.style.color = tokens.fg; } }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.borderBase; e.currentTarget.style.color = tokens.textMuted; }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <motion.footer
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOut }}
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '2rem',
          borderTop: `1px solid ${tokens.borderBase}`,
          color: tokens.textDim,
          fontSize: '0.8rem',
        }}
      >
        Built with TypeScript and React &middot; {new Date().getFullYear()}
      </motion.footer>
    </div>
  );
}
