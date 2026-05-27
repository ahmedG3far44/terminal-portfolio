import { useGitHub } from '../context/GitHubContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { GitCommit, GitPullRequest, Bug, Code, Flame } from 'lucide-react';

function getHeatColor(count: number, rgb: string): string {
  if (count === 0) return `rgba(${rgb}, 0.05)`;
  if (count <= 3) return `rgba(${rgb}, 0.2)`;
  if (count <= 6) return `rgba(${rgb}, 0.4)`;
  if (count <= 9) return `rgba(${rgb}, 0.6)`;
  return `rgba(${rgb}, 0.85)`;
}

export default function GitHubBoard() {
  const { contributions, loading, error } = useGitHub();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const rgb = colors?.rgb || '57, 255, 20';
  const primary = colors?.primary || '#ec4899';

  if (loading) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: `rgba(${rgb}, 0.5)`,
          fontStyle: 'italic',
        }}
      >
        <span style={{ animation: 'blink 1s infinite' }}>▋</span> Loading GitHub data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: `rgba(${rgb}, 0.5)`,
        }}
      >
        Failed to load GitHub data
      </div>
    );
  }

  if (!contributions) return null;

  const statCards = [
    { icon: Code, label: t('projects.viewCode') || 'Total Contributions', value: contributions.totalContributions },
    { icon: GitCommit, label: 'Total Commits', value: contributions.totalCommits },
    { icon: GitPullRequest, label: 'PRs', value: contributions.totalPRs },
    { icon: Bug, label: 'Issues', value: contributions.totalIssues },
    { icon: Flame, label: 'Current Streak', value: contributions.currentStreak, suffix: 'days' },
    { icon: Flame, label: 'Longest Streak', value: contributions.longestStreak, suffix: 'days' },
  ];

  const visibleCards = statCards.filter((c) => c.value > 0);

  return (
    <section
      style={{
        padding: '4rem 0',
        position: 'relative',
        borderTop: `1px solid ${primary}30`,
      }}
    >
      <div
        style={{
          fontSize: '0.75rem',
          color: `rgba(${rgb}, 0.5)`,
          marginBottom: '2rem',
          letterSpacing: '0.2em',
        }}
      >
        {`> cat ./github/contributions`}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {visibleCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                padding: '1.25rem',
                border: `1px solid ${primary}20`,
                textAlign: 'center',
              }}
            >
              <Icon
                size={20}
                style={{
                  margin: '0 auto 0.5rem',
                  color: `rgba(${rgb}, 0.6)`,
                }}
              />
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: primary,
                  marginBottom: '0.25rem',
                }}
              >
                {stat.value}{stat.suffix ? ` ${stat.suffix}` : ''}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: `rgba(${rgb}, 0.5)`,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2px',
          justifyContent: 'center',
        }}
      >
        {contributions.contributions.slice(-364).map((day, i) => (
          <div
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              background: getHeatColor(day.count, rgb),
              transition: 'all 0.15s',
            }}
            title={`${day.date}: ${day.count} contributions`}
          />
        ))}
      </div>
    </section>
  );
}
