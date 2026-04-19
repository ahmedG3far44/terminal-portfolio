import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import "highlight.js/styles/github-dark.css";

export const ReadmeParser = ({ text, repoBaseUrl = "" }) => {
  const styles = {
    container: {
      color: "#e6edf3",
      fontFamily: "system-ui, sans-serif",
      lineHeight: 1.6,
    },
    h1: { fontSize: "28px", fontWeight: "700", margin: "24px 0 12px" },
    h2: { fontSize: "24px", fontWeight: "600", margin: "20px 0 10px" },
    h3: { fontSize: "20px", fontWeight: "600", margin: "18px 0 8px" },
    h4: { fontSize: "18px", fontWeight: "500", margin: "16px 0 6px" },
    p: { margin: "10px 0", color: "#c9d1d9" },
    strong: { color: "#fff", fontWeight: "600" },
    link: { color: "#58a6ff", textDecoration: "none" },
    blockquote: {
      borderLeft: "4px solid #30363d",
      paddingLeft: "12px",
      color: "#8b949e",
      fontStyle: "italic",
      margin: "16px 0",
    },
    codeInline: {
      background: "#161b22",
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "13px",
      color: "#ff7b72",
    },
    codeBlock: {
      background: "#0d1117",
      padding: "16px",
      borderRadius: "8px",
      overflowX: "auto",
      margin: "16px 0",
      fontSize: "13px",
    },
    img: {
      maxWidth: "100%",
      borderRadius: "8px",
      margin: "16px 0",
      border: "1px solid #30363d",
    },
    ul: { paddingLeft: "20px", margin: "10px 0" },
    ol: { paddingLeft: "20px", margin: "10px 0" },
    li: { marginBottom: "6px" },
    hr: { border: "1px solid #30363d", margin: "24px 0" },
  };

  return (
    <div style={styles.container}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
        components={{
          h1: (props) => <h1 style={styles.h1} {...props} />,
          h2: (props) => <h2 style={styles.h2} {...props} />,
          h3: (props) => <h3 style={styles.h3} {...props} />,
          h4: (props) => <h4 style={styles.h4} {...props} />,

          p: (props) => <p style={styles.p} {...props} />,
          strong: (props) => <strong style={styles.strong} {...props} />,

          a: (props) => (
            <a
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          blockquote: (props) => (
            <blockquote style={styles.blockquote} {...props} />
          ),

          code({ inline, children, className, ...props }) {
            if (inline) {
              return (
                <code style={styles.codeInline} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <pre style={styles.codeBlock}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },

          img: ({ src = "", alt = "", ...props }) => {
            let fixedSrc = src;

            if (!src.startsWith("http")) {
              if (src.startsWith("./")) {
                fixedSrc = repoBaseUrl + src.replace("./", "");
              } else if (src.startsWith("/")) {
                fixedSrc = repoBaseUrl + src.slice(1);
              } else {
                fixedSrc = repoBaseUrl + src;
              }
            }

            const ext = fixedSrc.split(".").pop()?.toLowerCase();

            // 🎥 Handle videos
            if (["mp4", "webm", "ogg"].includes(ext)) {
              return (
                <video
                  controls
                  style={{
                    maxWidth: "100%",
                    borderRadius: "8px",
                    margin: "16px 0",
                    border: "1px solid #30363d",
                  }}
                >
                  <source src={fixedSrc} type={`video/${ext}`} />
                  Your browser does not support the video tag.
                </video>
              );
            }

            // 🖼️ Handle images (including GIF)
            return (
              <img
                src={fixedSrc}
                alt={alt}
                loading="lazy"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  margin: "16px 0",
                  border: "1px solid #30363d",
                }}
                {...props}
              />
            );
          },
          video: ({ src = "", ...props }) => {
            const fixedSrc = src.startsWith("http")
              ? src
              : repoBaseUrl + src.replace("./", "");

            return (
              <video
                controls
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  margin: "16px 0",
                }}
                {...props}
              >
                <source src={fixedSrc} />
              </video>
            );
          },

          ul: (props) => <ul style={styles.ul} {...props} />,
          ol: (props) => <ol style={styles.ol} {...props} />,
          li: (props) => <li style={styles.li} {...props} />,

          hr: () => <hr style={styles.hr} />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};
