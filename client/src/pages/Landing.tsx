import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Terminal, GitBranch, LayoutDashboard, Shield, Palette, Globe, Database, Code2, LogIn, User, Loader2, ArrowRight } from 'lucide-react';
import TerminalWidget from '../components/TerminalWidget';
import Logo from '../components/Logo';

const easeOut = [0.25, 1, 0.5, 1];

const features = [
  {
    icon: Terminal,
    title: 'Terminal Portfolio',
    desc: 'A unique terminal-themed portfolio with command-line aesthetics, project cards, and README rendering.',
    span: 'wide',
  },
  {
    icon: GitBranch,
    title: 'GitHub Integration',
    desc: 'Live contribution heatmap, stats, and repository browser all proxied through the server for security.',
    span: 'wide',
  },
  {
    icon: LayoutDashboard,
    title: 'Admin Dashboard',
    desc: 'Full CRUD for projects, skills, and personal info. GitHub OAuth login with JWT session management.',
    span: 'narrow',
  },
  {
    icon: Shield,
    title: 'Super Admin Panel',
    desc: 'Platform-wide insights, user management, and color theme CRUD.',
    span: 'narrow',
  },
  {
    icon: Palette,
    title: 'Custom Themes',
    desc: 'DB-driven color themes managed by super admin. Users pick from available accent colors.',
    span: 'narrow',
  },
  {
    icon: Globe,
    title: 'Internationalization',
    desc: 'English/Arabic support with RTL layout, keyboard shortcut toggle, and JSON-based translations.',
    span: 'tall',
  },
  {
    icon: Database,
    title: 'MongoDB Backend',
    desc: 'Express and Mongoose API server with per-user portfolios, GitHub OAuth users, and theme collections.',
    span: 'narrow',
  },
  {
    icon: Code2,
    title: 'TypeScript Monorepo',
    desc: 'Shared types between client and server. Custom fetch interceptor and query hooks.',
    span: 'narrow',
  },
];

const techCategories = [
  { label: 'Frontend', items: ['React', 'TypeScript', 'Vite', 'Framer Motion'] },
  { label: 'Backend', items: ['Express', 'Node.js', 'Mongoose'] },
  { label: 'Infra', items: ['MongoDB', 'JWT', 'GitHub API'] },
];

function FeatureCard({ icon: Icon, title, desc, span, i, tokens }: { icon: any; title: string; desc: string; span: string; i: number; tokens: any }) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const isTall = span === 'tall';
  const isWide = span === 'wide';

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: i * 0.05, duration: 0.4, ease: easeOut }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.surface,
        border: `1px solid ${hovered ? tokens.borderSubtle : tokens.borderBase}`,
        borderRadius: '1rem',
        padding: isTall ? '2rem 1.5rem' : '1.5rem',
        transition: prefersReducedMotion ? 'none' : 'border-color 0.3s ease',
        display: 'flex',
        flexDirection: isTall ? 'column' : 'column',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '0.5rem',
          background: `rgba(${tokens.accentRgb}, 0.08)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tokens.accent,
          flexShrink: 0,
        }}
      >
        <Icon size={18} />
      </div>
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: tokens.fg }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: tokens.textMuted, lineHeight: 1.6 }}>
          {desc}
        </p>
      </div>
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
      <Helmet>
        <title>Portfolio — Terminal-Themed Portfolio CMS</title>
        <meta name="description" content="A terminal-themed portfolio platform with GitHub OAuth, MongoDB persistence, super admin management, and live GitHub integration. Built with TypeScript and React." />
        <meta name="keywords" content="portfolio, terminal, developer portfolio, GitHub CMS, React, TypeScript" />
        <meta property="og:title" content="Portfolio — Terminal-Themed Portfolio CMS" />
        <meta property="og:description" content="A terminal-themed portfolio platform with GitHub OAuth, MongoDB persistence, super admin management, and live GitHub integration." />
      </Helmet>
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
          borderBottom: `1px solid ${tokens.borderBase}`,
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '1.25rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
        <motion.div whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}>
          <Logo color={tokens.accent} />
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
          <Link to="/dashboard" style={{ color: tokens.textMuted, textDecoration: 'none', fontSize: '0.875rem' }}>Dashboard</Link>
          {isSuperAdmin && (
            <Link to="/admin" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: tokens.accent, color: tokens.bg, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
              Super Admin
            </Link>
          )}
        </div>
        </div>
      </motion.nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: '1120px', margin: '0 auto', padding: '5rem 2rem 3rem', direction: isRTL ? 'rtl' : 'ltr' }}>
          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3rem',
              marginBottom: '5rem',
            }}
          >
            <div>
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
                  maxWidth: '780px',
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
                  marginBottom: '2.5rem',
                  lineHeight: 1.8,
                }}
              >
                A terminal-themed portfolio with GitHub OAuth, MongoDB persistence,
                super admin management, and live GitHub integration. Built with TypeScript.
              </motion.p>

              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: easeOut }}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
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
            </div>
            <div style={{ position: 'relative' }}>
              <TerminalWidget accentRgb={tokens.accentRgb} tokens={tokens} />
            </div>
          </div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: easeOut }}
          style={{ marginBottom: '3rem' }}
        >
          <MonoLabel accentRgb={tokens.accentRgb} isRTL={isRTL}>{'> ls ./features'}</MonoLabel>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: easeOut }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            marginBottom: '6rem',
          }}
        >
          {features.map((f, i) => {
            const colSpan = f.span === 'wide' ? 'span 2' : f.span === 'tall' ? 'span 1' : 'span 1';
            const rowSpan = f.span === 'tall' ? 'span 2' : 'span 1';
            return (
              <div key={f.title} style={{ gridColumn: colSpan, gridRow: rowSpan }}>
                <FeatureCard {...f} i={i} tokens={tokens} />
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: easeOut }}
          style={{
            borderTop: `1px solid ${tokens.borderBase}`,
            paddingTop: '3rem',
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <MonoLabel accentRgb={tokens.accentRgb} isRTL={isRTL}>{'> echo $TECH_STACK'}</MonoLabel>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {techCategories.map((cat) => (
              <div key={cat.label}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: `rgba(${tokens.accentRgb}, 0.4)`,
                  letterSpacing: '0.15em',
                  marginBottom: '0.75rem',
                }}>
                  {'>'} {cat.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {cat.items.map((tech) => (
                    <div
                      key={tech}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: `1px solid ${tokens.borderBase}`,
                        borderRadius: '0.375rem',
                        fontSize: '0.8rem',
                        color: tokens.textMuted,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
          borderTop: `1px solid ${tokens.borderBase}`,
          color: tokens.textDim,
          fontSize: '0.8rem',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Built with TypeScript and React &middot; {new Date().getFullYear()}</span>
          <span>
            Developed by{' '}
            <a
              href="https://www.linkedin.com/in/ahmedG3far44"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: tokens.accent, textDecoration: 'none' }}
            >
              @ahmedG3far44
            </a>
          </span>
        </div>
      </motion.footer>

      <style>{`
        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes term-cursor {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 20px rgba(${tokens.accentRgb}, 0.4); }
          50% { text-shadow: 0 0 40px rgba(${tokens.accentRgb}, 0.6), 0 0 60px rgba(${tokens.accentRgb}, 0.2); }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
