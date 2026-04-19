import { motion } from 'framer-motion'
import { useGitHub } from '../context/GitHubContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

const CELL_SIZE = 11
const CELL_GAP = 2

function Heatmap({ contributions }) {
  const { colors } = useTheme()
  const { primary, rgb } = colors

  const baseColor = primary
  const intensityColors = [
    'rgba(22, 27, 34, 1)',
    `rgba(${rgb}, 0.2)`,
    `rgba(${rgb}, 0.4)`,
    `rgba(${rgb}, 0.7)`,
    baseColor
  ]

  const today = new Date()
  const currentYear = today.getFullYear()
  const yearStart = new Date(`${currentYear}-01-01`)
  const yearEnd = new Date(`${currentYear}-12-31`)

  if (today.getFullYear() < 2026) {
    yearEnd.setFullYear(2025)
  }

  const daysAgo = yearStart.getDay()
  const startDate = new Date(yearStart)
  startDate.setDate(startDate.getDate() - daysAgo)

  const weeks = []
  let currentWeek = []

  for (let i = 0; i < daysAgo; i++) {
    currentWeek.push(null)
  }

  const dateMap = new Map()
  contributions
    .filter(c => c.date.startsWith('2026'))
    .forEach(c => dateMap.set(c.date, c))

  const endDate = today.getFullYear() >= 2026 ? today : new Date('2026-12-31')

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const dayData = dateMap.get(dateStr)

    currentWeek.push({
      date: dateStr,
      count: dayData?.contributionCount || 0
    })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  return (
    <div style={{ display: 'flex', gap: CELL_GAP }}>
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: CELL_GAP }}>
          {week.map((day, di) => (
            <div
              key={di}
              title={day?.date}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius: 2,
                background: day
                  ? intensityColors[Math.min(4, day.count === 0 ? 0 : Math.ceil(day.count / 3))]
                  : 'rgba(22, 27, 34, 0.5)',
                cursor: day ? 'pointer' : 'default',
                transition: 'all 0.15s'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function StatCard({ label, value, color }) {
  const { colors } = useTheme()
  const { rgb } = colors

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '1.25rem 1rem',
        border: `1px solid ${color}30`,
        background: `${color}08`,
        textAlign: 'center',
        borderRadius: '4px'
      }}
    >
      <div style={{
        fontSize: '1.75rem',
        fontWeight: 700,
        color,
        marginBottom: '0.25rem'
      }}>
        {value.toLocaleString()}
      </div>
      <div style={{
        fontSize: '0.65rem',
        color: `rgba(${rgb}, 0.6)`,
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function GitHubBoard() {
  const { data, loading, error } = useGitHub()
  const { colors } = useTheme()
  const { rgb, primary } = colors
  const { isRTL } = useLanguage()

  if (loading) {
    return (
      <section style={{ 
        padding: '4rem 0', 
        borderTop: `1px solid ${primary}30`,
        width: '100%'
      }}>
        <motion.div
          initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{
            fontSize: '0.75rem',
            color: `rgba(${rgb}, 0.5)`,
            marginBottom: '2rem',
            marginLeft: '2rem',
            letterSpacing: '0.2em'
          }}
        >
          {`> loading github stats...`}
        </motion.div>
        <div style={{
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: `rgba(${rgb}, 0.5)`
        }}>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            █▋
          </motion.div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section style={{ 
        padding: '4rem 0', 
        borderTop: `1px solid ${primary}30`,
        width: '100%'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#f85149',
          marginBottom: '1rem',
          marginLeft: '2rem'
        }}>
          {`> error: ${error}`}
        </div>
      </section>
    )
  }

  if (!data) return null

  const { totalContributions, totalCommits, totalPRs, totalReviews, totalIssues, currentStreak, longestStreak, contributions } = data

  const statCards = [
    { label: 'Contributions', value: totalContributions, color: primary },
    { label: 'Commits', value: totalCommits, color: primary },
    { label: 'PRs', value: totalPRs, color: primary },
  ]

  if (totalReviews > 0) {
    statCards.push({ label: 'Reviews', value: totalReviews, color: primary })
  }
  if (totalIssues > 0) {
    statCards.push({ label: 'Issues', value: totalIssues, color: primary })
  }

  const yearContributions = contributions.filter(c => c.date.startsWith('2026'))
  const yearTotal = yearContributions.reduce((sum, d) => sum + d.contributionCount, 0)

  return (
    <section style={{ 
      padding: '4rem 0', 
      borderTop: `1px solid ${primary}30`, 
      position: 'relative',
      width: '100%'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <motion.div
          initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: '0.75rem',
            color: `rgba(${rgb}, 0.5)`,
            marginBottom: '2rem',
            letterSpacing: '0.2em'
          }}
        >
          {`> cat ./github-streaks.json --year 2026`}
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${statCards.length}, 1fr)`,
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {statCards.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div style={{
            display: 'flex',
            gap: '2rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            <div>
              <span style={{ color: primary, fontWeight: 600 }}>{currentStreak}</span>
              <span style={{ color: `rgba(${rgb}, 0.5)`, marginLeft: '0.5rem' }}>current streak</span>
            </div>
            <div>
              <span style={{ color: `rgba(${rgb}, 0.5)` }}>|</span>
              <span style={{ color: primary, fontWeight: 600, marginLeft: '0.5rem' }}>{longestStreak}</span>
              <span style={{ color: `rgba(${rgb}, 0.5)`, marginLeft: '0.5rem' }}>longest streak</span>
            </div>
          </div>

          <div style={{
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            <Heatmap contributions={contributions} />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: `rgba(${rgb}, 0.5)`
          }}>
            <span>Less</span>
            {['rgba(22, 27, 34, 1)', `rgba(${rgb}, 0.2)`, `rgba(${rgb}, 0.4)`, `rgba(${rgb}, 0.7)`, primary].map((color, i) => (
              <div
                key={i}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderRadius: 2,
                  background: color
                }}
              />
            ))}
            <span>More</span>
            <span style={{ marginLeft: '1rem', opacity: 0.6 }}>|</span>
            <span style={{ opacity: 0.6 }}>{yearTotal} contributions in 2026</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}