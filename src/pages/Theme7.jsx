import { motion } from 'framer-motion'

const skills = [
  { name: 'React', level: 95 },
  { name: 'Node.js', level: 90 },
  { name: 'MongoDB', level: 88 },
  { name: 'Express', level: 85 },
  { name: 'TypeScript', level: 80 },
]

const projects = [
  { name: 'E-Commerce Platform', desc: 'Full-stack marketplace with payments', tags: ['React', 'Node'] },
  { name: 'Real-time Chat', desc: 'WebSocket messaging app', tags: ['Socket.io', 'React'] },
  { name: 'Task Manager', desc: 'Kanban with drag-drop', tags: ['Next.js', 'Prisma'] },
]

export default function Theme7() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0c0a1d',
      color: '#fff',
      fontFamily: "'Syne', sans-serif",
      position: 'relative'
    }}>
      <a href="/" className="nav-link" style={{ color: '#666' }}>← Back</a>
      
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '500px',
        height: '500px',
        background: 'conic-gradient(from 0deg, #ff006e, #8338ec, #3a86ff, #06d6a0, #ff006e)',
        filter: 'blur(150px)',
        opacity: 0.4,
        animation: 'rotate 20s linear infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'conic-gradient(from 180deg, #06d6a0, #3a86ff, #8338ec, #ff006e)',
        filter: 'blur(120px)',
        opacity: 0.3,
        animation: 'rotate 15s linear infinite reverse'
      }} />

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <header style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center' }}
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              fontWeight: 800,
              lineHeight: 1,
              background: 'linear-gradient(135deg, #ff006e, #8338ec, #3a86ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            CREATIVE
          </motion.h1>
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              fontWeight: 800,
              lineHeight: 1,
              color: '#fff'
            }}
          >
            DEVELOPER
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.6)',
              marginTop: '2rem',
              maxWidth: '500px'
            }}
          >
            MERN stack wizard crafting immersive digital experiences with code and creativity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginTop: '3rem'
            }}
          >
            {['Explore', 'Contact'].map((btn, i) => (
              <motion.button
                key={btn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  border: '2px solid',
                  borderColor: i === 0 ? '#ff006e' : 'transparent',
                  background: i === 0 ? 'transparent' : 'linear-gradient(135deg, #ff006e, #8338ec)',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                {btn}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </header>

      <section style={{ padding: '8rem 2rem', position: 'relative', zIndex: 1 }}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: '3rem',
            textAlign: 'center'
          }}
        >
          Skills Spectrum
        </motion.h2>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ marginBottom: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{skill.name}</span>
                <span style={{ color: '#666' }}>{skill.level}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, #ff006e, #8338ec)`,
                    borderRadius: '4px'
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '8rem 2rem', position: 'relative', zIndex: 1 }}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: '3rem',
            textAlign: 'center'
          }}
        >
          Featured Work
        </motion.h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              style={{
                padding: '2rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>{project.desc}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '0.25rem 0.75rem',
                    background: 'linear-gradient(135deg, #ff006e, #8338ec)',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}