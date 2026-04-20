import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { GitHubProvider } from "../context/GitHubContext";
import Controls from "../components/Controls";
import GitHubBoard from "../components/GitHubBoard";

function ThemeContent() {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const { data } = useAdmin();
  const { primary, rgb } = colors;

  const { projects, skills, personalInfo } = data;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerStyle = {
    width: "100%",
    maxWidth: isMobile ? "100%" : "75%",
    margin: "0 auto",
    padding: isMobile ? "0 1rem" : "0 2rem",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: primary,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        position: "relative",
      }}
    >
      <Controls />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(${rgb}, 0.03) 2px,
          rgba(${rgb}, 0.03) 4px
        )`,
          pointerEvents: "none",
        }}
      />

      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4rem 0",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={containerStyle}
        >
          <motion.div
            initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "clamp(0.75rem, 2vw, 1rem)",
              color: `rgba(${rgb}, 0.5)`,
              marginBottom: "1rem",
              letterSpacing: "0.2em",
            }}
          >
            {`> whoami`}
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              textShadow: `0 0 20px rgba(${rgb}, 0.5)`,
            }}
          >
            {personalInfo.name}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: "1rem",
              maxWidth: "500px",
              color: `rgba(${rgb}, 0.7)`,
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              width: "60%",
            }}
          >
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  padding: "0.5rem 1rem",
                  border: `1px solid ${primary}`,
                  fontSize: "0.75rem",
                  background: `rgba(${rgb}, 0.1)`,
                }}
              >
                {skill}
              </span>
            ))}
          </motion.div>

          {personalInfo.availableForHire && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: "4rem",
                fontSize: "0.75rem",
                color: `rgba(${rgb}, 0.4)`,
              }}
            >
              <span style={{ animation: "blink 1s infinite" }}>▋</span>{" "}
              {t("header.availableForHire")}
            </motion.div>
          )}
        </motion.div>
      </header>

      <GitHubProvider username={import.meta.env.VITE_GITHUB_USERNAME} token={import.meta.env.VITE_GITHUB_TOKEN}>
        <div style={containerStyle}>
          <GitHubBoard />
        </div>
      </GitHubProvider>
      <section
        style={{
          padding: "4rem 0",
          borderTop: `1px solid ${primary}30`,
          position: "relative",
        }}
      >
        <motion.div
          initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          style={{
            ...containerStyle,
            fontSize: "0.75rem",
            color: `rgba(${rgb}, 0.5)`,
            marginBottom: "2rem",
            letterSpacing: "0.2em",
          }}
        >
          {`> ls ./${t("projects.title").toLowerCase()}`}
        </motion.div>

        <div
          style={{
            ...containerStyle,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            alignItems: "stretch",
          }}
        >
          {projects.map((project, i) => (
            <Link
              to={`/project/${project.slug}`}
              key={project.id}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  background: `rgba(${rgb}, 0.1)`,
                  x: isRTL ? -10 : 10,
                }}
                style={{
                  padding: "1.5rem",
                  border: `1px solid ${primary}30`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 700,
                    color: `rgba(${rgb}, 0.2)`,
                    marginBottom: "1rem",
                  }}
                >
                  {project.id}
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    marginBottom: "0.5rem",
                    color: primary,
                  }}
                >
                  {project.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: `rgba(${rgb}, 0.6)`,
                    marginBottom: "1rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {project.description}
                </p>
                <span
                  style={{ fontSize: "0.75rem", color: `rgba(${rgb}, 0.5)` }}
                >
                  {">"} {project.techStack.join(", ")}
                </span>
              </motion.div>
            </Link>
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
  );
}

export default function Theme() {
  return <ThemeContent />;
}
