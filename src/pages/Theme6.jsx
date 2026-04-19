import { motion } from 'framer-motion'

const skills = ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'AWS']

const projects = [
  { name: '01', title: 'E-Commerce Platform', desc: 'Full-stack marketplace with payments', tech: 'MERN' },
  { name: '02', title: 'Real-time Chat', desc: 'WebSocket messaging application', tech: 'Socket.io' },
  { name: '03', title: 'Task Manager', desc: 'Kanban board with auth', tech: 'Next.js' },
  { name: '04', title: 'Weather App', desc: 'Live weather data visualization', tech: 'React' },
  { name: '05', title: 'Portfolio', desc: 'Personal portfolio website', tech: 'MERN' },
]

export default function Theme6() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fef3c7',
      color: '#1f2937',
      fontFamily: "'Archivo Black', sans-serif"
    }}>
      <a href="/" className="nav-link">← Back</a>
      
      <header style={{
        minHeight: '100vh',
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottom: '8px solid #1f2937'
      }}>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            style={{ 
              fontSize: 'clamp(5rem, 15vw, 12rem)', 
              fontWeight: '900',
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#1f2937'
            }}
          >
            Make
          </motion.div>
          <motion.div 
            style={{ 
              fontSize: 'clamp(5rem, 15vw, 12rem)', 
              fontWeight: '900',
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#f472b6',
              WebkitTextStroke: '3px #1f2937'
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            It
          </motion.div>
          <motion.div 
            style={{ 
              fontSize: 'clamp(5rem, 15vw, 12rem)', 
              fontWeight: '900',
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#1f2937'
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Pop
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: '1.5rem',
            marginTop: '3rem',
            maxWidth: '600px',
            fontFamily: "'Arial', sans-serif",
            fontWeight: 500
          }}
        >
          MERN stack developer creating bold, memorable digital experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          {skills.map(skill => (
            <span key={skill} style={{
              padding: '0.5rem 1rem',
              background: '#1f2937',
              color: '#fef3c7',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>{skill}</span>
          ))}
        </motion.div>
      </header>

      <section style={{ padding: '6rem 2rem' }}>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 5vw, 4rem)', 
          fontWeight: '900',
          marginBottom: '3rem',
          textTransform: 'uppercase'
        }}>
          Selected Works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{
                padding: '2rem',
                border: '4px solid #1f2937',
                background: i % 2 === 0 ? '#f472b6' : '#22d3ee',
                transform: i % 2 === 0 ? 'skewX(-3deg)' : 'skewX(3deg)'
              }}
            >
              <span style={{ fontSize: '3rem', fontWeight: '900', opacity: 0.3 }}>{project.name}</span>
              <h3 style={{ fontSize: '2rem', fontWeight: '900', marginTop: '0.5rem' }}>{project.title}</h3>
              <p style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{project.desc}</p>
              <span style={{ fontSize: '0.875rem', fontWeight: 'bold', marginTop: '1rem', display: 'block' }}>{project.tech}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}