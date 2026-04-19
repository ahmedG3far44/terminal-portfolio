import { motion } from 'framer-motion'

const skills = [
  { name: 'React', color: '#fbbf24' },
  { name: 'Node.js', color: '#34d399' },
  { name: 'MongoDB', color: '#a78bfa' },
  { name: 'Express', color: '#f472b6' },
  { name: 'TypeScript', color: '#60a5fa' },
]

const projects = [
  { name: 'E-Commerce', desc: 'Full-stack marketplace', color: '#fbbf24' },
  { name: 'Chat App', desc: 'Real-time messaging', color: '#34d399' },
  { name: 'Dashboard', desc: 'Analytics platform', color: '#a78bfa' },
  { name: 'Portfolio', desc: 'Personal website', color: '#f472b6' },
]

export default function Theme9() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1e1e2e',
      color: '#cdd6f4',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <a href="/" className="nav-link" style={{ color: '#6c7086' }}>← Back</a>

      <header style={{
        minHeight: '100vh',
        padding: '4rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        alignItems: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#fab387'
            }}
          >
            DEV
          </motion.div>
          <motion.div
            style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#89b4fa'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ELOP
          </motion.div>
          <motion.div
            style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#f38ba8'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ER
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontSize: '1.25rem',
              marginTop: '2rem',
              color: '#a6adc8',
              maxWidth: '400px'
            }}
          >
            MERN stack developer crafting clean, efficient code.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}
        >
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              whileHover={{ scale: 1.05, rotate: 2 }}
              style={{
                padding: '2rem',
                background: skill.color,
                color: '#1e1e2e',
                fontSize: '1.25rem',
                fontWeight: 700,
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              {skill.name}
            </motion.div>
          ))}
        </motion.div>
      </header>

      <section style={{ padding: '6rem 2rem' }}>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 5vw, 3rem)', 
          fontWeight: 800,
          marginBottom: '3rem',
          color: '#f9e2af'
        }}>
          PROJECTS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              style={{
                padding: '2rem',
                border: `3px solid ${project.color}`,
                background: 'transparent'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                {project.name}
              </h3>
              <p style={{ color: '#a6adc8' }}>{project.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}