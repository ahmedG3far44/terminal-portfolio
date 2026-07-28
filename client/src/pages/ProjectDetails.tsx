import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NotFoundPage from './NotFoundPage';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useGitHub } from '../context/GitHubContext';
import { http } from '../services/http';
import { GitBranch } from 'lucide-react';
import Controls from '../components/Controls';
import Header from '../components/Header';
import { ReadmeParser } from '../components/ReadmeParser';
import type { Project } from '../types';

const easeOutQuart: [number, number, number, number] = [0.25, 1, 0.5, 1];

function extractRepoInfo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com[\/:]([\w-]+)\/([\w-]+)/);
  if (match) return { owner: match[1], repo: match[2] };
  return null;
}

export default function ProjectDetails() {
  const { username, id } = useParams<{ username?: string; id: string }>();
  const { colors, setPortfolioTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { getReadme } = useGitHub();
  const primary = colors?.primary || '#ec4899';
  const rgb = colors?.rgb || '57, 255, 20';
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [readme, setReadme] = useState('');
  const [readmeLoading, setReadmeLoading] = useState(true);
  const [readmeError, setReadmeError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setNotFound(false);

    const url = username
      ? `/portfolio/${username}/project/${id}`
      : `/portfolio/project/${id}`;

    http
      .get<{ project: Project; activeTheme?: string }>(url, { signal: controller.signal })
      .then((data) => {
        setProject(data.project);
        if (data.activeTheme) setPortfolioTheme(data.activeTheme);
        setLoading(false);
      })
      .catch((err: any) => {
        if (err.name === 'AbortError') return;
        setNotFound(true);
        setLoading(false);
      });

    return () => {
      controller.abort();
      setPortfolioTheme(null);
    };
  }, [username, id, setPortfolioTheme]);

  const repoInfo = project ? extractRepoInfo(project.repoUrl) : null;

  useEffect(() => {
    if (!project) return;

    setReadmeLoading(true);
    setReadmeError(null);

    const info = extractRepoInfo(project.repoUrl);
    if (!info) {
      setReadmeError('No README found');
      setReadmeLoading(false);
      return;
    }

    getReadme(info.owner, info.repo)
      .then((content) => {
        if (content) {
          setReadme(content);
        } else {
          setReadmeError('No README found');
        }
      })
      .catch((err: any) => {
        setReadmeError(err.message);
      })
      .finally(() => setReadmeLoading(false));
  }, [project?.repoUrl, getReadme, project?._id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          paddingTop: '52px',
          background: '#0d1117',
          color: primary,
          fontFamily: "'JetBrains Mono', monospace",
          position: 'relative',
        }}
      >
        <Header />
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '6rem 2rem',
          }}
        >
          <Link to={username ? `/${username}` : '/portfolio'} style={{ color: primary, textDecoration: 'none', fontSize: '0.875rem', opacity: 0.6 }}>
            ← {t('nav.back')}
          </Link>
          <div style={{ marginTop: '2rem', color: `rgba(${rgb}, 0.5)`, fontSize: '0.75rem' }}>
            <span style={{ animation: 'blink 1s infinite' }}>▋</span> Loading project...
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return <NotFoundPage />;
  }

  const projectTitle = project?.title || 'Project';
  const projectDesc = project?.description || 'Project details';

  const chipStyle: React.CSSProperties = {
    padding: '0.375rem 0.875rem',
    border: `1px solid ${primary}40`,
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    background: `rgba(${rgb}, 0.06)`,
    color: `rgba(${rgb}, 0.75)`,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '52px',
        background: '#0d1117',
        color: primary,
        fontFamily: "'JetBrains Mono', monospace",
        position: 'relative',
      }}
    >
      <Helmet>
        <title>{projectTitle} — Project Details</title>
        <meta name="description" content={projectDesc} />
        <meta name="keywords" content={`${projectTitle}, project, portfolio, ${project?.techStack?.join(', ') || ''}`} />
        <meta property="og:title" content={`${projectTitle} — Project Details`} />
        <meta property="og:description" content={projectDesc} />
        {project?.coverImage && <meta property="og:image" content={project.coverImage} />}
        <meta name="twitter:title" content={`${projectTitle} — Project Details`} />
        <meta name="twitter:description" content={projectDesc} />
      </Helmet>
      <Header />
      <Controls />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '6rem 2rem 4rem',
        }}
      >
        <Link
          to={username ? `/${username}` : '/portfolio'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: `rgba(${rgb}, 0.5)`,
            textDecoration: 'none',
            fontSize: '0.75rem',
            marginBottom: '2rem',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = primary; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = `rgba(${rgb}, 0.5)`; }}
        >
          {isRTL ? '→' : '←'}
          {t('nav.back')}
        </Link>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: easeOutQuart }}
          style={{
            marginBottom: '0.5rem',
            color: `rgba(${rgb}, 0.4)`,
            letterSpacing: '0.15em',
            fontSize: '0.7rem',
          }}
        >
          {`> cat ./${t('projects.title').toLowerCase()}/${project.slug}/info`}
        </motion.div>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.4, ease: easeOutQuart }}
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            margin: '1.25rem 0 2rem',
            lineHeight: 1.15,
          }}
        >
          {project.title}
        </motion.h1>

        {project.tags.length > 0 && (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.35, ease: easeOutQuart }}
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}
          >
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: `1px solid ${primary}50`,
                  borderRadius: '9999px',
                  fontSize: '0.65rem',
                  background: `rgba(${rgb}, 0.08)`,
                  color: `rgba(${rgb}, 0.7)`,
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {project.coverImage && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.4, ease: easeOutQuart }}
            style={{
              marginBottom: '2.5rem',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              background: '#000',
              cursor: /\.mp4$/i.test(project.coverImage ?? '') ? 'default' : 'pointer',
            }}
            onClick={() => {
              if (!/\.mp4$/i.test(project.coverImage ?? '')) setLightboxOpen(true);
            }}
          >
            {/\.mp4$/i.test(project.coverImage ?? '') ? (
              <video
                src={project.coverImage ?? ''}
                muted
                loop
                autoPlay
                playsInline
                style={{ width: '100%', maxHeight: '480px', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <img
                src={project.coverImage ?? ''}
                alt={project.title}
                style={{ width: '100%', maxHeight: '480px', objectFit: 'contain', display: 'block' }}
              />
            )}
          </motion.div>
        )}

        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.35, ease: easeOutQuart }}
          style={{
            fontSize: '0.8125rem',
            lineHeight: 1.7,
            color: `rgba(${rgb}, 0.75)`,
            marginBottom: '2.5rem',
            maxWidth: '65ch',
          }}
        >
          {project.description}
        </motion.p>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.24, duration: 0.35, ease: easeOutQuart }}
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '3.5rem',
            flexWrap: 'wrap',
          }}
        >
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.625rem 1.25rem',
                background: primary,
                color: '#0d1117',
                textDecoration: 'none',
                fontSize: '0.8125rem',
                fontWeight: 600,
                borderRadius: '0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <GitBranch size={16} />
              {t('projects.viewCode')}
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.625rem 1.25rem',
                border: `1px solid ${primary}50`,
                borderRadius: '0.5rem',
                color: `rgba(${rgb}, 0.8)`,
                textDecoration: 'none',
                fontSize: '0.8125rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'border-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = primary; e.currentTarget.style.color = primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${primary}50`; e.currentTarget.style.color = `rgba(${rgb}, 0.8)`; }}
            >
              {t('projects.liveDemo')}
              <span style={{ fontSize: '1.1em', lineHeight: 1 }}>→</span>
            </a>
          )}
        </motion.div>

        {project.techStack.length > 0 && (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.35, ease: easeOutQuart }}
            style={{ marginBottom: project.tools.length > 0 ? '2rem' : '3.5rem' }}
          >
            <h3
              style={{
                fontSize: '0.7rem',
                color: `rgba(${rgb}, 0.4)`,
                marginBottom: '1rem',
                letterSpacing: '0.15em',
              }}
            >{`> ${t('projects.techStack')}`}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {project.techStack.map((tech: string) => (
                <span key={tech} style={chipStyle}>{tech}</span>
              ))}
            </div>
          </motion.div>
        )}

        {project.tools.length > 0 && (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.35, ease: easeOutQuart }}
            style={{ marginBottom: '3.5rem' }}
          >
            <h3
              style={{
                fontSize: '0.7rem',
                color: `rgba(${rgb}, 0.4)`,
                marginBottom: '1rem',
                letterSpacing: '0.15em',
              }}
            >{`> ${t('projects.tools')}`}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {project.tools.map((tool: string) => (
                <span key={tool} style={chipStyle}>{tool}</span>
              ))}
            </div>
          </motion.div>
        )}

        {(readmeLoading || readme) && (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.36, duration: 0.35, ease: easeOutQuart }}
            style={{ marginTop: '1rem' }}
          >
            <h3
              style={{
                fontSize: '0.7rem',
                color: `rgba(${rgb}, 0.4)`,
                marginBottom: '1.25rem',
                letterSpacing: '0.15em',
              }}
            >{`> cat README.md`}</h3>

            {readmeLoading ? (
              <div style={{ color: `rgba(${rgb}, 0.4)`, fontSize: '0.75rem' }}>
                <span style={{ animation: 'blink 1s infinite' }}>▋</span> Loading README...
              </div>
            ) : (
              <div
                style={{
                  padding: '1.5rem',
                  border: `1px solid ${primary}15`,
                  borderRadius: '0.5rem',
                  background: `rgba(${rgb}, 0.03)`,
                  maxHeight: '600px',
                  overflowY: 'auto',
                }}
              >
                <ReadmeParser
                  text={readme}
                  repoBaseUrl={`https://raw.githubusercontent.com/${repoInfo?.owner}/${repoInfo?.repo}/main/`}
                />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {lightboxOpen && project?.coverImage && !/\.mp4$/i.test(project.coverImage ?? '') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '2rem',
          }}
        >
          <motion.img
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25, ease: easeOutQuart }}
            src={project.coverImage ?? ''}
            alt={project.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '0.5rem',
            }}
          />
        </motion.div>
      )}

      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      `}</style>
    </div>
  );
}
