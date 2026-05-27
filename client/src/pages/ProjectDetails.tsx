import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
          background: '#0d1117',
          color: primary,
          fontFamily: "'JetBrains Mono', monospace",
          padding: '2rem',
        }}
      >
        <Link to={username ? `/${username}` : '/portfolio'} style={{ color: primary, textDecoration: 'none' }}>
          ← {t('nav.back')}
        </Link>
        <div style={{ marginTop: '2rem', fontStyle: 'italic', color: `rgba(${rgb}, 0.5)` }}>
          <span style={{ animation: 'blink 1s infinite' }}>▋</span> Loading project...
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0d1117',
          color: primary,
          fontFamily: "'JetBrains Mono', monospace",
          padding: '2rem',
        }}
      >
        <Link to={username ? `/${username}` : '/portfolio'} style={{ color: primary, textDecoration: 'none' }}>
          ← {t('nav.back')}
        </Link>
        <h1 style={{ marginTop: '2rem' }}>Project not found</h1>
      </div>
    );
  }

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
      <Controls />

      <Link
        to={username ? `/${username}` : '/portfolio'}
        style={{
          position: 'fixed',
          top: 'calc(52px + 0.75rem)',
          [isRTL ? 'right' : 'left']: '1.5rem',
          color: primary,
          textDecoration: 'none',
          fontSize: '0.875rem',
          opacity: 0.6,
          zIndex: 100,
        }}
      >
        {isRTL ? '→ ' : '← '}
        {t('nav.back')}
      </Link>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '6rem 2rem 4rem',
        }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            marginBottom: '0.5rem',
            color: `rgba(${rgb}, 0.5)`,
            letterSpacing: '0.15em',
            fontSize: '0.75rem',
          }}
        >
          {`> cat ./${t('projects.title').toLowerCase()}/${project.slug}/info`}
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            margin: '1.5rem 0rem',
            textShadow: `0 0 30px rgba(${rgb}, 0.3)`,
          }}
        >
          {project.title.toUpperCase()}
        </motion.h1>

        {project.tags.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: `1px solid ${primary}`,
                  fontSize: '0.7rem',
                  background: `rgba(${rgb}, 0.1)`,
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {project.coverImage && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.18 }}
            style={{ marginBottom: '1.5rem' }}
          >
            {/\.mp4$/i.test(project.coverImage) ? (
              <video
                src={project.coverImage}
                muted
                loop
                autoPlay
                style={{ width: '100%', maxHeight: '400px', borderRadius: '0.5rem', objectFit: 'cover' }}
              />
            ) : (
              <img
                src={project.coverImage}
                alt={project.title}
                style={{ width: '100%', maxHeight: '400px', borderRadius: '0.5rem', objectFit: 'cover' }}
              />
            )}
          </motion.div>
        )}

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: '0.75rem',
            lineHeight: 1.5,
            color: `rgba(${rgb}, 0.8)`,
            marginBottom: '2rem',
          }}
        >
          {project.description}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.75rem 1.5rem',
                background: primary,
                color: '#0d1117',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
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
                padding: '0.75rem 1.5rem',
                border: `1px solid ${primary}`,
                color: primary,
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {t('projects.liveDemo')} →
            </a>
          )}
        </motion.div>

        {project.techStack.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: '2rem' }}
          >
            <h3
              style={{
                fontSize: '0.75rem',
                color: `rgba(${rgb}, 0.5)`,
                marginBottom: '1rem',
                letterSpacing: '0.15em',
              }}
            >{`> ${t('projects.techStack')}`}</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {project.techStack.map((tech: string) => (
                <span
                  key={tech}
                  style={{
                    padding: '0.5rem 1rem',
                    border: `1px solid ${primary}50`,
                    fontSize: '0.8rem',
                    background: `rgba(${rgb}, 0.05)`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {project.tools.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ marginBottom: '3rem' }}
          >
            <h3
              style={{
                fontSize: '0.75rem',
                color: `rgba(${rgb}, 0.5)`,
                marginBottom: '1rem',
                letterSpacing: '0.15em',
              }}
            >{`> ${t('projects.tools')}`}</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {project.tools.map((tool: string) => (
                <span
                  key={tool}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    color: `rgba(${rgb}, 0.6)`,
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {(readmeLoading || readme) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: '3rem' }}
          >
            <h3
              style={{
                fontSize: '0.75rem',
                color: `rgba(${rgb}, 0.5)`,
                marginBottom: '1.5rem',
                letterSpacing: '0.15em',
              }}
            >{`> cat README.md`}</h3>

            {readmeLoading ? (
              <div style={{ color: `rgba(${rgb}, 0.5)`, fontStyle: 'italic' }}>
                <span style={{ animation: 'blink 1s infinite' }}>▋</span> Loading README...
              </div>
            ) : (
              <div
                style={{
                  padding: '1.5rem',
                  border: `1px solid ${primary}20`,
                  background: `rgba(${rgb}, 0.02)`,
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

      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      `}</style>
    </div>
  );
}
