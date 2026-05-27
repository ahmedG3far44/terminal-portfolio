import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { http } from '../services/http';
import { GitHubProvider } from '../context/GitHubContext';
import type { Portfolio, Contact } from '../types';

import Controls from '../components/Controls';
import Header from '../components/Header';
import GitHubBoard from '../components/GitHubBoard';
import { getContactIcon } from '../components/ContactIcons';


function ThemeContent() {
  const { colors, setPortfolioTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { username } = useParams<{ username?: string }>();
  const primary = colors?.primary || '#ec4899';
  const rgb = colors?.rgb || '57, 255, 20';

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setError(null);

    const url = username
      ? `/portfolio/${username}`
      : '/portfolio';

    http.get<Portfolio>(url, { signal: abort.signal })
      .then(setPortfolio)
      .catch((err: any) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load portfolio');
      })
      .finally(() => setLoading(false));

    return () => abort.abort();
  }, [username]);

  useEffect(() => {
    if (portfolio?.activeTheme) {
      setPortfolioTheme(portfolio.activeTheme);
    }
    return () => setPortfolioTheme(null);
  }, [portfolio?.activeTheme, setPortfolioTheme]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', color: primary, fontFamily: "'JetBrains Mono', monospace" }}>
        <span style={{ animation: 'blink 1s infinite' }}>▋</span>
        <span style={{ marginLeft: '1rem', fontStyle: 'italic', opacity: 0.5 }}>Loading portfolio...</span>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0d1117', color: primary, fontFamily: "'JetBrains Mono', monospace" }}>
        <p style={{ opacity: 0.5 }}>{error || 'Portfolio not found'}</p>
        <Link to="/" style={{ color: primary, textDecoration: 'none', marginTop: '1rem', opacity: 0.6 }}>← Back to home</Link>
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isMobile ? '100%' : '60%',
    margin: '0 auto',
    padding: isMobile ? '0 1rem' : '0 2rem',
  };

  const projects = portfolio.projects || [];
  const skills = portfolio.skills || [];
  const contacts = portfolio.contacts || [];
  const personalInfo = portfolio.personalInfo || {
    name: '', title: '', bio: '', availableForHire: false,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '52px',
        background: '#0d1117',
        color: primary,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        position: 'relative',
      }}
    >
      <Header />
      <Controls />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(${rgb}, 0.03) 2px,
            rgba(${rgb}, 0.03) 4px
          )`,
          pointerEvents: 'none',
        }}
      />

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4rem 0',
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={containerStyle}
        >
          <motion.div
            initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(0.75rem, 2vw, 1rem)',
              color: `rgba(${rgb}, 0.5)`,
              marginBottom: '1rem',
              letterSpacing: '0.2em',
            }}
          >
            {`> whoami`}
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '1.5rem',
              textShadow: `0 0 20px rgba(${rgb}, 0.5)`,
            }}
          >
            {personalInfo.name}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '0.75rem',
              maxWidth: '75%',
              fontWeight:'lighter',
              color: `rgba(${rgb}, 0.7)`,
              lineHeight: 1.8,
              marginBottom: '2rem',

            }}
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              width: '60%',
            }}
          >
            {skills.map((skill: string) => (
              <span
                key={skill}
                style={{
                  padding: '0.5rem 1rem',
                  border: `1px solid ${primary}`,
                  fontSize: '0.75rem',
                  background: `rgba(${rgb}, 0.1)`,
                }}
              >
                {skill}
              </span>
            ))}
          </motion.div>

          {personalInfo.availableForHire && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: '4rem',
                fontSize: '0.75rem',
                color: `rgba(${rgb}, 0.4)`,
              }}
            >
              <span style={{ animation: 'blink 1s infinite' }}>▋</span>{' '}
              {t('header.availableForHire')}
            </motion.div>
          )}

          {contacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                gap: '1.25rem',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {contacts.map((contact: Contact) => {
                const Icon = getContactIcon(contact.type);
                return (
                  <a
                    key={contact._id || contact.id}
                    href={contact.type === 'email' ? `mailto:${contact.value}` :  contact.value}
                    target={contact.type === 'email' ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    style={{
                      color: `rgba(${rgb}, 0.5)`,
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = `rgba(${rgb}, 1)`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = `rgba(${rgb}, 0.5)`; }}
                  >
                    <Icon size={14} />
                    {contact.label || contact.value.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </header>

      <GitHubProvider>
        <div style={containerStyle}>
          <GitHubBoard />
        </div>
      </GitHubProvider>

      <section
        style={{
          padding: '4rem 0',
          borderTop: `1px solid ${primary}30`,
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          style={{
            ...containerStyle,
            fontSize: '0.75rem',
            color: `rgba(${rgb}, 0.5)`,
            marginBottom: '2rem',
            letterSpacing: '0.2em',
          }}
        >
          {`> ls ./${t('projects.title').toLowerCase()}`}
        </motion.div>

        <div
          style={{
            ...containerStyle,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}
        >
          {projects.map((project, i) => (
            <Link
              to={username ? `/${username}/project/${project._id || project.id}` : `/project/${project._id || project.id}`}
              key={project._id || project.slug}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
              }}
            >
              <motion.div
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  x: isRTL ? -10 : 10,
                }}
                style={{
                  border: `1px solid ${primary}30`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  position: 'relative',
                  borderRadius:'12px',
                  overflow: 'hidden',
                  ...(project.coverImage ? { padding: 0 } : { padding: '1.5rem' }),
                }}
              >
                {project.coverImage ? (
                  <div style={{ position: 'relative', width: '100%', height:'100%' , overflow: 'hidden' }}>
                    {/\.mp4$/i.test(project.coverImage) ? (
                      <video
                        src={project.coverImage}
                        muted
                        loop
                        autoPlay
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)`,
                        opacity: 0,
                        transition: 'opacity 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '1.5rem',
                      }}
                      className="card-overlay"
                    >
                      <h3 style={{ fontSize: '1.25rem', fontWeight:'bold', color: primary }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: '0.65rem', fontWeight:'lighter', color: `rgba(${rgb}, 0.8)`, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {project.description}
                      </p>
                      {project.techStack.length > 0 && (
                        <span style={{ fontSize: '0.60rem', color: `rgba(${rgb}, 0.6)` }}>
                          {'>'} {project.techStack.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: `rgba(${rgb}, 0.2)`, marginBottom: '1rem' }}>
                      {project.id || project._id?.slice(-2) || i + 1}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: primary }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: `rgba(${rgb}, 0.6)`, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {project.description}
                    </p>
                    {project.techStack.length > 0 && (
                      <span style={{ fontSize: '0.75rem', color: `rgba(${rgb}, 0.5)` }}>
                        {'>'} {project.techStack.join(', ')}
                      </span>
                    )}
                  </>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .project-card:hover .card-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

export default function Theme() {
  return <ThemeContent />;
}
