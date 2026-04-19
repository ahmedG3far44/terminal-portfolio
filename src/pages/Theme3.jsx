import { motion } from 'framer-motion'

const skills = ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'AWS', 'Docker']

const projects = [
  { name: '01', title: 'E-Commerce Platform', desc: 'Full-stack solution with Stripe payments', tech: 'MERN Stack' },
  { name: '02', title: 'Real-time Chat', desc: 'WebSocket messaging application', tech: 'Socket.io + React' },
  { name: '03', title: 'Task Manager', desc: 'Kanban board with auth', tech: 'Next.js + PostgreSQL' },
  { name: '04', title: 'Weather App', desc: 'Live weather data visualization', tech: 'React + APIs' },
]

export default function Theme3() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0d1117',
      color: '#39ff14',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      position: 'relative'
    }}>
      <a href="/" className="nav-link" style={{ fontFamily: 'inherit' }}>← Back</a>
      
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(57, 255, 20, 0.03) 2px,
          rgba(57, 255, 20, 0.03) 4px
        )`,
        pointerEvents: 'none'
      }} />

      <header style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '4rem 2rem',
        position: 'relative'
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(0.75rem, 2vw, 1rem)',
              color: 'rgba(57, 255, 20, 0.5)',
              marginBottom: '1rem',
              letterSpacing: '0.2em'
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
              textShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
            }}
          >
            Full Stack<br />Developer
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '1rem',
              maxWidth: '500px',
              color: 'rgba(57, 255, 20, 0.7)',
              lineHeight: 1.8,
              marginBottom: '2rem'
            }}
          >
            Building scalable applications with MERN stack. 
            Passionate about clean code and elegant solutions.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            {skills.map((skill, i) => (
              <span
                key={skill}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #39ff14',
                  fontSize: '0.75rem',
                  background: 'rgba(57, 255, 20, 0.1)'
                }}
              >
                {skill}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              marginTop: '4rem',
              fontSize: '0.75rem',
              color: 'rgba(57, 255, 20, 0.4)'
            }}
          >
            <span style={{ animation: 'blink 1s infinite' }}>▋</span> Available for hire
          </motion.div>
        </motion.div>
      </header>

      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #39ff1430', position: 'relative' }}>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: '0.75rem',
            color: 'rgba(57, 255, 20, 0.5)',
            marginBottom: '2rem',
            letterSpacing: '0.2em'
          }}
        >
          {`> ls ./projects`}
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                background: 'rgba(57, 255, 20, 0.1)',
                x: 10
              }}
              style={{
                padding: '1.5rem',
                border: '1px solid #39ff1430',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: 700, 
                color: 'rgba(57, 255, 20, 0.2)',
                marginBottom: '1rem'
              }}>
                {project.name}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#39ff14' }}>{project.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(57, 255, 20, 0.6)', marginBottom: '1rem' }}>{project.desc}</p>
              <span style={{ fontSize: '0.75rem', color: 'rgba(57, 255, 20, 0.5)' }}>
                {'>'} {project.tech}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}