import { motion } from 'framer-motion'

const skills = [
  { name: 'React', icon: '⚛️' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Express', icon: '🚂' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'AWS', icon: '☁️' },
]

const projects = [
  { name: 'Luxe Commerce', desc: 'Premium e-commerce with artisan products', year: '2024' },
  { name: 'Velvet Chat', desc: 'Real-time messaging for luxury brands', year: '2024' },
  { name: 'Aurora Tasks', desc: 'Productivity suite for creatives', year: '2023' },
  { name: 'Noir Dashboard', desc: 'Analytics platform with dark elegance', year: '2023' },
]

export default function Theme4() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      color: '#f5f5f5',
      fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
      position: 'relative'
    }}>
      <a href="/" className="nav-link" style={{ fontFamily: 'inherit' }}>← Back</a>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(180deg, transparent 0%, #d4af37 50%, transparent 100%)',
        opacity: 0.3
      }} />

      <header style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '4rem 2rem',
        position: 'relative'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '0.875rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#d4af37',
              marginBottom: '1.5rem',
              display: 'block'
            }}
          >
            MERN Stack Developer
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: '2rem',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            Crafting Digital<br />
            <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Masterpieces</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontSize: '1.125rem',
              color: 'rgba(245,245,245,0.6)',
              maxWidth: '500px',
              lineHeight: 1.8,
              fontFamily: "'Cormorant Garamond', serif"
            }}
          >
            Transforming visionary ideas into extraordinary digital experiences. 
            Where elegance meets functionality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              marginTop: '3rem',
              display: 'flex',
              gap: '2rem'
            }}
          >
            {['GitHub', 'LinkedIn', 'Email'].map((link, i) => (
              <motion.a
                key={link}
                href="#"
                whileHover={{ color: '#d4af37' }}
                style={{
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,245,0.7)',
                  transition: 'color 0.3s ease'
                }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            position: 'absolute',
            bottom: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'rgba(245,245,245,0.4)', letterSpacing: '0.2em' }}>
            SCROLL
          </span>
          <div style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(180deg, #d4af37, transparent)'
          }} />
        </motion.div>
      </header>

      <section style={{ 
        padding: '8rem 2rem', 
        position: 'relative',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%'
        }}>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontSize: '0.875rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#d4af37',
              textAlign: 'center',
              marginBottom: '4rem'
            }}
          >
            Expertise
          </motion.h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '3rem',
            textAlign: 'center'
          }}>
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{skill.icon}</div>
                <div style={{ fontSize: '1rem', letterSpacing: '0.1em' }}>{skill.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '8rem 2rem', position: 'relative' }}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: '0.875rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#d4af37',
            textAlign: 'center',
            marginBottom: '4rem'
          }}
        >
          Selected Works
        </motion.h2>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{
                padding: '3rem 0',
                borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#d4af37',
                  letterSpacing: '0.2em',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  {project.year}
                </span>
                <h3 style={{ 
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
                  fontWeight: 400,
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {project.name}
                </h3>
                <p style={{ 
                  color: 'rgba(245,245,245,0.5)', 
                  marginTop: '0.5rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.125rem'
                }}>
                  {project.desc}
                </p>
              </div>
              <span style={{ 
                fontSize: '0.75rem', 
                color: 'rgba(245,245,245,0.3)',
                letterSpacing: '0.1em'
              }}>
                VIEW →
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}