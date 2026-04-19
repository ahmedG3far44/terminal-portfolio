import { motion } from 'framer-motion'

const skills = ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'GraphQL', 'AWS']

const projects = [
  { name: 'E-Commerce Platform', desc: 'Full-stack marketplace', year: '2024' },
  { name: 'Real-time Chat', desc: 'WebSocket messaging', year: '2024' },
  { name: 'Task Manager', desc: 'Kanban board', year: '2023' },
  { name: 'Weather App', desc: 'Live weather data', year: '2023' },
]

export default function Theme8() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#ffe4e6',
      color: '#881337',
      fontFamily: "'Bebas Neue', sans-serif",
      position: 'relative'
    }}>
      <a href="/" className="nav-link">← Back</a>

      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        fontSize: '20rem',
        fontWeight: 'bold',
        opacity: 0.05,
        lineHeight: 1
      }}>
        CODE
      </div>

      <header style={{
        minHeight: '100vh',
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(4rem, 15vw, 12rem)',
              lineHeight: 0.9,
              letterSpacing: '0.05em',
              color: '#be123c'
            }}
          >
            BUILD
          </motion.div>
          <motion.div
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(4rem, 15vw, 12rem)',
              lineHeight: 0.9,
              letterSpacing: '0.05em',
              WebkitTextStroke: '3px #881337',
              color: 'transparent'
            }}
          >
            SHIP
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: '1.5rem',
            marginTop: '2rem',
            maxWidth: '600px',
            fontFamily: "'Arial', sans-serif",
            fontWeight: 500
          }}
        >
          MERN stack developer. I build, ship, and ship again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          {skills.map((skill, i) => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.1, rotate: Math.random() * 10 - 5 }}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#881337',
                color: '#ffe4e6',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </header>

      <section style={{ padding: '6rem 2rem', background: '#881337', color: '#ffe4e6' }}>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 6vw, 4rem)', 
          marginBottom: '3rem',
          letterSpacing: '0.1em'
        }}>
          WORK
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ x: 10 }}
              style={{
                padding: '1.5rem',
                border: '3px solid #ffe4e6',
                cursor: 'pointer'
              }}
            >
              <span style={{ 
                fontSize: '0.875rem', 
                opacity: 0.6,
                display: 'block',
                marginBottom: '0.5rem'
              }}>{project.year}</span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{project.name}</h3>
              <p style={{ opacity: 0.8 }}>{project.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <a href="mailto:hello@example.com" style={{
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          color: '#881337',
          textDecoration: 'underline'
        }}>
          Let's work together →
        </a>
      </section>
    </div>
  )
}