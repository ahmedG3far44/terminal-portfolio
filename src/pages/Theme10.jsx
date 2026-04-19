import { motion } from 'framer-motion'

const skills = [
  { name: 'React', icon: '⚛' },
  { name: 'Node.js', icon: '🗄' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Express', icon: '🚀' },
  { name: 'TypeScript', icon: '📘' },
]

const projects = [
  { name: 'E-Commerce Platform', desc: 'Full-stack marketplace with cart & checkout', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop' },
  { name: 'Real-time Chat', desc: 'WebSocket messaging with rooms', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop' },
  { name: 'Task Manager', desc: 'Drag-drop Kanban with auth', img: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=300&fit=crop' },
  { name: 'Weather Dashboard', desc: 'Live weather with charts', img: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop' },
]

export default function Theme10() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fafafa',
      color: '#1a1a1a',
      fontFamily: "'Zen Kaku Gothic New', sans-serif"
    }}>
      <a href="/" className="nav-link">← Back</a>

      <header style={{
        minHeight: '100vh',
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 500,
              letterSpacing: '0.15em',
              marginBottom: '1rem'
            }}
          >
            developer
          </motion.div>
          <motion.div
            style={{
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              color: '#666',
              marginBottom: '3rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            MERN Stack Engineer
          </motion.div>
          <motion.p
            style={{
              fontSize: '1.1rem',
              maxWidth: '500px',
              lineHeight: 2,
              color: '#444'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            I build robust web applications with React, Node.js, MongoDB, and Express.
            Focused on clean architecture and user experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: '3rem',
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center'
            }}
          >
            {skills.map(skill => (
              <div key={skill.name} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '2rem' }}>{skill.icon}</span>
                <span style={{ fontSize: '0.75rem', color: '#999', letterSpacing: '0.1em' }}>{skill.name}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ 
            width: '1px', 
            height: '60px', 
            background: 'linear-gradient(to bottom, #1a1a1a, transparent)' 
          }} />
          <span style={{ fontSize: '0.75rem', color: '#999', letterSpacing: '0.2em' }}>SCROLL</span>
        </motion.div>
      </header>

      <section style={{ padding: '8rem 2rem' }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          textAlign: 'center',
          marginBottom: '4rem',
          letterSpacing: '0.1em'
        }}>
          Selected Works
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ cursor: 'pointer' }}
            >
              <div style={{
                height: '250px',
                background: `url(${project.img}) center/cover`,
                marginBottom: '1.5rem',
                filter: 'grayscale(100%)',
                transition: 'filter 0.3s ease'
              }} 
              className="project-img"
              />
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 500,
                marginBottom: '0.5rem'
              }}>{project.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{project.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ 
        padding: '6rem 2rem', 
        background: '#1a1a1a', 
        color: '#fafafa',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 500,
          marginBottom: '2rem',
          letterSpacing: '0.1em'
        }}>
          Get In Touch
        </h2>
        <a href="mailto:hello@example.com" style={{
          fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
          color: '#fafafa',
          textDecoration: 'underline'
        }}>
          hello@example.com
        </a>
      </section>

      <style>{`
        .project-img:hover {
          filter: grayscale(0%) !important;
        }
      `}</style>
    </div>
  )
}