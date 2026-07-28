import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { http } from '../services/http';
import { GitHubProvider } from '../context/GitHubContext';
import { resolveSectionStyles } from '../styles/customizationUtils';
import type { Portfolio, Contact } from '../types';

import Controls from '../components/Controls';
import Header from '../components/Header';
import { getContactIcon } from '../components/ContactIcons';
import { Helmet } from 'react-helmet-async';

const GitHubBoard = lazy(() => import('../components/GitHubBoard'));


function ThemeContent() {
  const { colors, setPortfolioTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { username } = useParams<{ username?: string }>();
  const reducedMotion = useReducedMotion();

  const easeOutQuart = [0.25, 1, 0.5, 1] as const;
  const scrollReveal = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } as const };
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
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(checkMobile, 80);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const { sectionStyles, rawCss } = useMemo(
    () => resolveSectionStyles(portfolio?.customization),
    [portfolio?.customization]
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', color: primary, fontFamily: "'JetBrains Mono', monospace" }}>
        <span style={{ animation: 'blink 1s infinite' }}>▋</span>
        <span style={{ marginLeft: '1rem', fontStyle: 'italic', opacity: 0.5 }}>Loading portfolio...</span>
      </div>
    );
  }

  if (error || !portfolio) {
    return <NotFoundPage />;
  }

  const projects = portfolio.projects || [];
  const skills = portfolio.skills || [];
  const contacts = portfolio.contacts || [];
  const personalInfo = portfolio.personalInfo || {
    name: '', title: '', bio: '', availableForHire: false,
  };

  const pageTitle = personalInfo.name
    ? `${personalInfo.name} — Portfolio`
    : 'Portfolio';
  const pageDesc = personalInfo.bio
    ? personalInfo.bio
    : 'Developer portfolio built with the terminal-themed portfolio platform.';

  return (
    <div
      style={{
        ...sectionStyles.pageBackground,
        background: '#0d1117',
        color: primary,
        fontFamily: sectionStyles.pageBackground?.fontFamily || "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={`portfolio, ${personalInfo.name}, developer, ${skills.join(', ')}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
      </Helmet>
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
          willChange: 'transform',
        }}
      />

      <header
        style={sectionStyles.heroContainer as React.CSSProperties}
      >
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: easeOutQuart }}
          style={{
            ...sectionStyles.pageContainer,
            maxWidth: isMobile ? '100%' : (sectionStyles.pageContainer?.maxWidth || '60%'),
            padding: isMobile ? '0 1rem' : (sectionStyles.pageContainer?.padding || '0 2rem'),
          } as React.CSSProperties}
        >
          <motion.div
            initial={reducedMotion ? {} : { x: isRTL ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.35, ease: easeOutQuart }}
            style={{
              ...sectionStyles.heroLabel,
              color: `rgba(${rgb}, 0.5)`,
            } as React.CSSProperties}
          >
            {`> whoami`}
          </motion.div>

          <motion.div className="flex items-center gap-2">
                 <motion.h1
            initial={reducedMotion ? {} : { y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: easeOutQuart }}
            style={{
              ...sectionStyles.heroName,
              textShadow: `0 0 20px rgba(${rgb}, 0.5)`,
            } as React.CSSProperties}
          >
            {personalInfo.name}
          </motion.h1>
          </motion.div>

          <motion.p
            initial={reducedMotion ? {} : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: easeOutQuart }}
            style={{
              ...sectionStyles.heroBio,
              color: `rgba(${rgb}, 0.7)`,
              fontWeight: 400,
            } as React.CSSProperties}
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            initial={reducedMotion ? {} : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4, ease: easeOutQuart }}
            style={sectionStyles.heroSkillsContainer as React.CSSProperties}
          >
            {skills.map((skill: string) => (
              <span
                key={skill}
                style={{
                  ...sectionStyles.heroSkillPill,
                  border: `1px solid ${primary}`,
                  background: `rgba(${rgb}, 0.1)`,
                } as React.CSSProperties}
              >
                {skill}
              </span>
            ))}
          </motion.div>

          {personalInfo.availableForHire && (
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35, ease: easeOutQuart }}
              style={{
                ...sectionStyles.heroAvailableHire,
                color: `rgba(${rgb}, 0.4)`,
              } as React.CSSProperties}
            >
              <span style={{ animation: 'blink 1s infinite' }}>▋</span>{' '}
              {t('header.availableForHire')}
            </motion.div>
          )}

          {contacts.length > 0 && (
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35, ease: easeOutQuart }}
              style={sectionStyles.heroContactsContainer as React.CSSProperties}
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
                      ...sectionStyles.heroContactLink,
                      color: `rgba(${rgb}, 0.5)`,
                    } as React.CSSProperties}
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

      {portfolio.showGitHubBoard !== false && (
        <GitHubProvider>
          <motion.div
            {...(reducedMotion ? {} : { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } } as any)}
            transition={{ duration: 0.5, ease: easeOutQuart }}
            style={{
              ...sectionStyles.gitHubBoardContainer,
              maxWidth: isMobile ? '100%' : (sectionStyles.gitHubBoardContainer?.maxWidth || '60%'),
              padding: isMobile ? '0 1rem' : (sectionStyles.gitHubBoardContainer?.padding || '0 2rem'),
            } as React.CSSProperties}>
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: `rgba(${rgb}, 0.4)` }}>▋</div>}>
              <GitHubBoard />
            </Suspense>
          </motion.div>
        </GitHubProvider>
      )}

      <section
        style={{
          ...sectionStyles.projectsContainer,
          borderTop: `1px solid ${primary}30`,
        } as React.CSSProperties}
      >
        <motion.div
          initial={reducedMotion ? {} : { x: isRTL ? 50 : -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: easeOutQuart }}
          style={{
            ...sectionStyles.pageContainer,
            ...sectionStyles.projectsLabel,
            maxWidth: isMobile ? '100%' : (sectionStyles.pageContainer?.maxWidth || '60%'),
            padding: isMobile ? '0 1rem' : (sectionStyles.pageContainer?.padding || '0 2rem'),
            color: `rgba(${rgb}, 0.5)`,
          } as React.CSSProperties}
        >
          {`> ls ./${t('projects.title').toLowerCase()}`}
        </motion.div>

        <div
          style={{
            ...sectionStyles.pageContainer,
            ...sectionStyles.projectsGrid,
            maxWidth: isMobile ? '100%' : (sectionStyles.pageContainer?.maxWidth || '60%'),
            padding: isMobile ? '0 1rem' : (sectionStyles.pageContainer?.padding || '0 2rem'),
          } as React.CSSProperties}
        >
          {projects.map((project, i) => (
            <Link
              to={username ? `/${username}/project/${project._id || project.id}` : `/project/${project._id || project.id}`}
              key={project._id || project.slug}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flex: 1,
              }}
            >
              <motion.div
                className="project-card"
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: easeOutQuart }}
                viewport={{ once: true }}
                whileHover={reducedMotion ? {} : {
                  x: isRTL ? -10 : 10,
                }}
                style={{
                  ...sectionStyles.projectCard,
                  border: `1px solid ${primary}30`,
                  flex: 1,
                  ...(project.coverImage ? { padding: 0 } : {}),
                } as React.CSSProperties}
              >
                {project.coverImage ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', flex: 1 }}>
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
                        ...sectionStyles.projectCardOverlay,
                        background: `linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)`,
                      } as React.CSSProperties}
                      className="card-overlay"
                    >
                      <h3 style={{ ...sectionStyles.projectCardTitle, color: primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as React.CSSProperties}>
                        {project.title}
                      </h3>
                      <p style={{ ...sectionStyles.projectCardDescription, color: `rgba(${rgb}, 0.8)`, fontWeight: 400, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                        {project.description}
                      </p>
                      {project.techStack.length > 0 && (
                        <span style={{ ...sectionStyles.projectCardTechStack, color: `rgba(${rgb}, 0.6)` } as React.CSSProperties}>
                          {'>'} {project.techStack.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <h3 style={{ ...sectionStyles.projectCardTitle, color: primary } as React.CSSProperties}>
                        {project.title}
                      </h3>
                      <p style={{ ...sectionStyles.projectCardDescription, color: `rgba(${rgb}, 0.7)`, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 } as React.CSSProperties}>
                        {project.description}
                      </p>
                    </div>
                    {project.techStack.length > 0 && (
                      <span style={{ ...sectionStyles.projectCardTechStack, color: `rgba(${rgb}, 0.5)` } as React.CSSProperties}>
                        {'>'} {project.techStack.join(', ')}
                      </span>
                    )}
                  </div>
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
        ${rawCss}
      `}</style>
    </div>
  );
}

export default function Theme() {
  return <ThemeContent />;
}
