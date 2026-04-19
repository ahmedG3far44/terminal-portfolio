import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { GitBranch, ExternalLink } from "lucide-react";
import Controls from "../components/Controls";
import { ReadmeParser } from "../components/ReadmeParser";

function extractRepoInfo(url) {
  const match = url.match(/github\.com[\/:]([\w-]+)\/([\w-]+)/);
  if (match) return { owner: match[1], repo: match[2] };
  return null;
}

function parseInlineMarkdown(text, rgb) {
  if (!text) return "";
  let result = text;

  result = result.replace(/`([^`]+)`/g, (_, code) => {
    return `<code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.9em;">${code}</code>`;
  });

  result = result.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\*\*([^*]+)\*\*/g, "<em>$1</em>");
  result = result.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #58a6ff; text-decoration: none;">$1</a>',
  );
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 1rem 0; display: block;" />',
  );

  return result;
}

function MarkdownRenderer({ content, rgb }) {
  const lines = content.split("\n");
  let inCodeBlock = false;
  let codeContent = [];
  let codeKey = 0;
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];
  let tableKey = 0;

  const elements = [];
  const processInline = (text) => parseInlineMarkdown(text, rgb);

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeContent = [];
        codeKey = i;
      } else {
        elements.push(
          <pre
            key={`code-${codeKey}`}
            style={{
              background: "rgba(0,0,0,0.4)",
              padding: "1rem",
              borderRadius: "6px",
              overflowX: "auto",
              marginBottom: "1rem",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <code
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
                fontSize: "0.85rem",
                lineHeight: 1.6,
              }}
            >
              {codeContent.join("\n")}
            </code>
          </pre>,
        );
        inCodeBlock = false;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    if (
      line.startsWith("---") ||
      line.startsWith("***") ||
      line.startsWith("___")
    ) {
      elements.push(
        <hr
          key={i}
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            margin: "1.5rem 0",
          }}
        />,
      );
      return;
    }

    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={i}
          style={{
            borderLeft: `3px solid rgba(${rgb}, 0.6)`,
            paddingLeft: "1rem",
            marginLeft: 0,
            marginBottom: "0.5rem",
            color: `rgba(${rgb}, 0.8)`,
            fontStyle: "italic",
          }}
        >
          {processInline(line.slice(2))}
        </blockquote>,
      );
      return;
    }

    if (
      line.startsWith("- [ ] ") ||
      line.startsWith("- [x] ") ||
      line.startsWith("- [X] ")
    ) {
      const checked = line.startsWith("- [x]") || line.startsWith("- [X]");
      elements.push(
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <input
            type="checkbox"
            checked={checked}
            readOnly
            style={{ marginTop: "0.3rem", accentColor: `rgb(${rgb})` }}
          />
          <span
            style={{
              color: checked ? `rgba(${rgb}, 0.5)` : "inherit",
              textDecoration: checked ? "line-through" : "none",
            }}
          >
            {processInline(line.slice(5))}
          </span>
        </div>,
      );
      return;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={i}
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            marginTop: "2rem",
            marginBottom: "1rem",
            color: `rgb(${rgb})`,
          }}
        >
          {processInline(line.slice(2))}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          style={{
            fontSize: "1.35rem",
            fontWeight: 600,
            marginTop: "1.75rem",
            marginBottom: "0.75rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "0.5rem",
          }}
        >
          {processInline(line.slice(3))}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            marginTop: "1.25rem",
            marginBottom: "0.5rem",
          }}
        >
          {processInline(line.slice(4))}
        </h3>,
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li
          key={i}
          style={{
            marginLeft: "1.5rem",
            marginBottom: "0.35rem",
            listStyle: "disc",
          }}
          dangerouslySetInnerHTML={{ __html: processInline(line.slice(2)) }}
        />,
      );
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li
          key={i}
          style={{
            marginLeft: "1.5rem",
            marginBottom: "0.35rem",
            listStyle: "decimal",
          }}
          dangerouslySetInnerHTML={{
            __html: processInline(line.replace(/^\d+\. /, "")),
          }}
        />,
      );
    } else if (line.startsWith("| ") && line.includes("|")) {
      const cells = line.split("|").filter((c) => c.trim() !== "");
      if (cells.length > 0 && line.match(/\|[-:]+\|/)) {
        return;
      }
      if (!inTable) {
        inTable = true;
        tableHeaders = cells.map((c) => processInline(c.trim()));
        tableKey = i;
      } else {
        tableRows.push(cells.map((c) => processInline(c.trim())));
      }
      if (i === lines.length - 1 || !lines[i + 1]?.startsWith("| ")) {
        if (inTable && tableHeaders.length > 0) {
          elements.push(
            <div
              key={`table-${tableKey}`}
              style={{ overflowX: "auto", marginBottom: "1rem" }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.9rem",
                }}
              >
                <thead>
                  <tr>
                    {tableHeaders.map((h, hi) => (
                      <th
                        key={hi}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          padding: "0.5rem",
                          textAlign: "left",
                          fontWeight: 600,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.1)",
                            padding: "0.5rem",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>,
          );
        }
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
      return;
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "0.75rem" }} />);
    } else {
      elements.push(
        <p
          key={i}
          style={{ marginBottom: "0.5rem", lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: processInline(line) }}
        />,
      );
    }
  });

  return <div style={{ lineHeight: 1.8, fontSize: "1rem" }}>{elements}</div>;
}

function ProjectContent() {
  const { slug } = useParams();
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const { data, fetchRepoReadme } = useAdmin();
  const { primary, rgb } = colors;
  const [readme, setReadme] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const project = data.projects.find((p) => p.slug === slug);

  const repoInfo = extractRepoInfo(project.repoUrl);

  useEffect(() => {
    if (!project) {
      setLoading(false);
      return;
    }

    const loadReadme = async () => {
      try {
        setLoading(true);
        setError(null);

        const localPaths = [`/readme/${project.slug}.md`, "/README_TEST.md"];
        let content = "";
        for (const path of localPaths) {
          const response = await fetch(path);
          if (response.ok) {
            content = await response.text();
            break;
          }
        }

        const repoInfo = extractRepoInfo(project.repoUrl);

        if (repoInfo) {
          const readmeContent = await fetchRepoReadme(
            repoInfo.owner,
            repoInfo.repo,
          );
          console.log("README content: ");
          console.log(readmeContent);
          if (readmeContent === null) {
            setError("No README found");
          }
          setReadme(readmeContent);
        } else {
          setError("No README found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReadme();
  }, [project?.slug, project?.repoUrl]);

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d1117",
          color: primary,
          fontFamily: "'JetBrains Mono', monospace",
          padding: "2rem",
        }}
      >
        <Link to="/" style={{ color: primary, textDecoration: "none" }}>
          ← {t("nav.back")}
        </Link>
        <h1 style={{ marginTop: "2rem" }}>Project not found</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: primary,
        fontFamily: "'JetBrains Mono', monospace",
        position: "relative",
      }}
    >
      <Controls />

      <Link
        to="/"
        style={{
          position: "fixed",
          top: "1.5rem",
          [isRTL ? "right" : "left"]: "1.5rem",
          color: primary,
          textDecoration: "none",
          fontSize: "0.875rem",
          opacity: 0.6,
          zIndex: 100,
        }}
      >
        {isRTL ? "→ " : "← "}
        {t("nav.back")}
      </Link>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "6rem 2rem 4rem",
        }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            marginBottom: "0.5rem",
            color: `rgba(${rgb}, 0.5)`,
            letterSpacing: "0.15em",
            fontSize: "0.75rem",
          }}
        >
          {`> cat ./${t("projects.title").toLowerCase()}/${project.slug}/info`}
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            marginBottom: "1rem",
            textShadow: `0 0 30px rgba(${rgb}, 0.3)`,
          }}
        >
          {project.title}
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "0.25rem 0.75rem",
                border: `1px solid ${primary}`,
                fontSize: "0.7rem",
                background: `rgba(${rgb}, 0.1)`,
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "1rem",
            lineHeight: 1.8,
            color: `rgba(${rgb}, 0.8)`,
            marginBottom: "2rem",
          }}
        >
          {project.description}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.75rem 1.5rem",
                background: primary,
                color: "#0d1117",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <GitBranch size={16} />
              {t("projects.viewCode")}
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.75rem 1.5rem",
                border: `1px solid ${primary}`,
                color: primary,
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {t("projects.liveDemo")} →
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: "2rem" }}
        >
          <h3
            style={{
              fontSize: "0.75rem",
              color: `rgba(${rgb}, 0.5)`,
              marginBottom: "1rem",
              letterSpacing: "0.15em",
            }}
          >{`> ${t("projects.techStack")}`}</h3>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "0.5rem 1rem",
                  border: `1px solid ${primary}50`,
                  fontSize: "0.8rem",
                  background: `rgba(${rgb}, 0.05)`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ marginBottom: "3rem" }}
        >
          <h3
            style={{
              fontSize: "0.75rem",
              color: `rgba(${rgb}, 0.5)`,
              marginBottom: "1rem",
              letterSpacing: "0.15em",
            }}
          >{`> ${t("projects.tools")}`}</h3>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {project.tools.map((tool) => (
              <span
                key={tool}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.8rem",
                  color: `rgba(${rgb}, 0.6)`,
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: "3rem" }}
        >
          <h3
            style={{
              fontSize: "0.75rem",
              color: `rgba(${rgb}, 0.5)`,
              marginBottom: "1.5rem",
              letterSpacing: "0.15em",
            }}
          >{`> cat README.md`}</h3>

          {loading ? (
            <div style={{ color: `rgba(${rgb}, 0.5)`, fontStyle: "italic" }}>
              <span style={{ animation: "blink 1s infinite" }}>▋</span> Loading
              README...
            </div>
          ) : error ? (
            <div
              style={{
                padding: "1.5rem",
                border: `1px dashed ${primary}30`,
                color: `rgba(${rgb}, 0.5)`,
              }}
            >
              {error}
            </div>
          ) : readme ? (
            <div
              style={{
                padding: "1.5rem",
                border: `1px solid ${primary}20`,
                background: `rgba(${rgb}, 0.02)`,
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              <ReadmeParser
                text={readme}
                repoBaseUrl={`https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/main/`}
              />
            </div>
          ) : (
            <div style={{ color: `rgba(${rgb}, 0.5)` }}>No README found</div>
          )}
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      `}</style>
    </div>
  );
}

export default function ProjectDetails() {
  return <ProjectContent />;
}
