import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../context/AdminContext";
import { useLanguage } from "../context/LanguageContext";
import {
  FolderKanban,
  GitBranch,
  Wrench,
  User,
  Menu,
  X,
  Home,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Check,
  Star,
  GitFork,
  LogOut,
  LucideLogOut,
} from "lucide-react";

const COLORS = {
  background: "#09090b",
  foreground: "#fafafa",
  card: "#18181b",
  cardForeground: "#fafafa",
  primary: "#f4f4f5",
  primaryForeground: "#18181b",
  muted: "#27272a",
  mutedForeground: "#a1a1aa",
  border: "#27272a",
  destructive: "#ef4444",
  input: "#27272a",
  ring: "#f4f4f5",
};

const SIDEBAR_WIDTH = 280;

const emptyProject = {
  title: "",
  description: "",
  slug: "",
  repoUrl: "",
  liveDemoUrl: "",
  tags: [],
  techStack: [],
  tools: [],
  coverImage: null,
};

function Spinner({ size = 20 }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{ color: COLORS.mutedForeground }}
    >
      <Loader2 size={size} />
    </motion.div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.625rem 0.75rem",
  background: COLORS.input,
  border: `1px solid ${COLORS.border}`,
  borderRadius: "0.5rem",
  color: COLORS.foreground,
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const inputErrorStyle = {
  ...inputStyle,
  borderColor: COLORS.destructive,
  boxShadow: `0 0 0 1px ${COLORS.destructive}`,
};

const errorTextStyle = {
  fontSize: "0.75rem",
  color: COLORS.destructive,
  marginTop: "0.25rem",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  transition: "all 0.2s",
};

const btnPrimary = {
  ...buttonStyle,
  background: COLORS.primary,
  color: COLORS.primaryForeground,
};

const btnGhost = {
  ...buttonStyle,
  background: "transparent",
  color: COLORS.mutedForeground,
};

const btnDestructive = {
  ...buttonStyle,
  background: COLORS.destructive,
  color: "white",
};

function LoginScreen({ onLogin, t }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(password);
      setLoading(false);
    }, 500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.background,
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: COLORS.card,
          padding: "2rem",
          borderRadius: "0.75rem",
          width: "100%",
          maxWidth: "360px",
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "0.75rem",
              background: COLORS.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <Wrench size={24} />
          </div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: COLORS.foreground,
            }}
          >
            Admin Dashboard
          </h2>
          <p style={{ fontSize: "0.875rem", color: COLORS.mutedForeground }}>
            Sign in to manage your portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={inputStyle}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              ...btnPrimary,
              width: "100%",
              marginTop: "1rem",
              opacity: loading || !password ? 0.7 : 1,
            }}
          >
            {loading ? <Spinner size={16} /> : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function SidebarContent({
  activeTab,
  setActiveTab,
  onClose,
  isMobile,
  onLogout,
}) {
  const { t } = useLanguage();

  const navItems = [
    {
      id: "projects",
      label: t("admin.projects") || "Projects",
      icon: FolderKanban,
    },
    { id: "repos", label: "GitHub Repos", icon: GitBranch },
    { id: "skills", label: t("admin.skills") || "Skills", icon: Wrench },
    {
      id: "personalInfo",
      label: t("admin.personalInfo") || "Personal Info",
      icon: User,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "1.5rem",
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: COLORS.foreground,
          }}
        >
          Admin Dashboard
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} style={{ ...btnGhost, padding: "0.5rem" }}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav style={{ padding: "0.75rem", flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%",
                padding: "0.625rem 0.75rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: isActive ? 500 : 400,
                background: isActive ? COLORS.muted : "transparent",
                color: isActive ? COLORS.foreground : COLORS.mutedForeground,
                transition: "all 0.15s",
                marginBottom: "0.25rem",
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "0.75rem 1rem",
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.75rem",
            borderRadius: "0.5rem",
            color: COLORS.mutedForeground,
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          <Home size={18} />
          Back to Home
        </Link>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.75rem",
            borderRadius: "0.5rem",
            background: COLORS.muted,
            color: COLORS.primary,
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
          onClick={onLogout}
        >
          <LucideLogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

function TopBar({ onMenuClick, activeTab }) {
  return (
    <div
      style={{
        height: "60px",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.card,
      }}
    >
      <button
        onClick={onMenuClick}
        style={{
          ...btnGhost,
          padding: "0.5rem",
          display: "none",
        }}
        className="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            padding: "0.25rem 0.625rem",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: COLORS.mutedForeground,
          }}
        >
          dashboard / {activeTab}
        </div>
      </div>
    </div>
  );
}

function ProjectsTab({ projects, onEdit, onDelete, t }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = (project) => {
    const newErrors = {};
    if (!project.title?.trim()) {
      newErrors.title = "Title is required";
    }
    if (!project.slug?.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(project.slug)) {
      newErrors.slug = "Slug must be lowercase letters, numbers, and hyphens only";
    }
    if (project.repoUrl && !/^https?:\/\//.test(project.repoUrl)) {
      newErrors.repoUrl = "Must be a valid URL starting with http:// or https://";
    }
    if (project.liveDemoUrl && !/^https?:\/\//.test(project.liveDemoUrl)) {
      newErrors.liveDemoUrl = "Must be a valid URL starting with http:// or https://";
    }
    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate(editingProject);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onEdit(editingProject);
    setEditingProject(null);
    setShowForm(false);
    setErrors({});
  };

  const handleCancel = () => {
    setEditingProject(null);
    setShowForm(false);
    setErrors({});
  };

  const openForm = (project = null) => {
    setEditingProject(project || { title: "", description: "", slug: "", repoUrl: "", liveDemoUrl: "" });
    setShowForm(true);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: COLORS.foreground,
          }}
        >
          {t("admin.projects")}
        </h3>
        <button onClick={() => openForm()} style={btnPrimary}>
          <Plus size={16} />
          {t("admin.addProject")}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              padding: "0 0 1.5rem 0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <input
                  value={editingProject?.title || ""}
                  onChange={(e) =>
                    setEditingProject((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder={t("projectForm.title")}
                  style={errors.title ? inputErrorStyle : inputStyle}
                />
                {errors.title && (
                  <p style={errorTextStyle}>{errors.title}</p>
                )}
              </div>
              <div>
                <input
                  value={editingProject?.slug || ""}
                  onChange={(e) =>
                    setEditingProject((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))
                  }
                  placeholder={t("projectForm.slug")}
                  style={errors.slug ? inputErrorStyle : inputStyle}
                />
                {errors.slug && (
                  <p style={errorTextStyle}>{errors.slug}</p>
                )}
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <textarea
                value={editingProject?.description || ""}
                onChange={(e) =>
                  setEditingProject((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                placeholder={t("projectForm.description")}
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <input
                  value={editingProject?.repoUrl || ""}
                  onChange={(e) =>
                    setEditingProject((p) => ({ ...p, repoUrl: e.target.value }))
                  }
                  placeholder={t("projectForm.repoUrl")}
                  style={errors.repoUrl ? inputErrorStyle : inputStyle}
                />
                {errors.repoUrl && (
                  <p style={errorTextStyle}>{errors.repoUrl}</p>
                )}
              </div>
              <div>
                <input
                  value={editingProject?.liveDemoUrl || ""}
                  onChange={(e) =>
                    setEditingProject((p) => ({
                      ...p,
                      liveDemoUrl: e.target.value,
                    }))
                  }
                  placeholder={t("projectForm.liveDemoUrl")}
                  style={errors.liveDemoUrl ? inputErrorStyle : inputStyle}
                />
                {errors.liveDemoUrl && (
                  <p style={errorTextStyle}>{errors.liveDemoUrl}</p>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button onClick={handleCancel} style={btnGhost}>
                {t("admin.cancel")}
              </button>
              <button onClick={handleSave} style={btnPrimary}>
                {t("admin.save")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              background: COLORS.muted,
              padding: "1rem",
              borderRadius: "0.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div>
              <h4
                style={{
                  fontWeight: 500,
                  marginBottom: "0.25rem",
                  color: COLORS.foreground,
                }}
              >
                {project.title}
              </h4>
              <p style={{ fontSize: "0.8rem", color: COLORS.mutedForeground }}>
                {project.slug}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => openForm(project)}
                style={{
                  ...btnGhost,
                  padding: "0.5rem",
                  color: COLORS.foreground,
                }}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(project.id)}
                style={{
                  ...btnGhost,
                  padding: "0.5rem",
                  color: COLORS.destructive,
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && !showForm && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: COLORS.mutedForeground,
            }}
          >
            <FolderKanban
              size={32}
              style={{ margin: "0 auto 1rem", opacity: 0.5 }}
            />
            <p>No projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReposTab({
  repos,
  selectedRepos,
  loadingRepos,
  onLoadRepos,
  onToggleRepo,
  onImport,
  isAdded,
  t,
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: COLORS.foreground,
          }}
        >
          GitHub Repositories
        </h3>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={onLoadRepos}
            disabled={loadingRepos}
            style={btnPrimary}
          >
            {loadingRepos ? <Spinner size={16} /> : <GitBranch size={16} />}
            {loadingRepos ? "Loading..." : "Fetch Repos"}
          </button>
          {selectedRepos.length > 0 && (
            <button
              onClick={onImport}
              style={{ ...buttonStyle, background: "#22c55e", color: "white" }}
            >
              <Check size={16} />
              Import ({selectedRepos.length})
            </button>
          )}
        </div>
      </div>

      {repos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: COLORS.mutedForeground,
            background: COLORS.muted,
            borderRadius: "0.75rem",
          }}
        >
          <GitBranch
            size={32}
            style={{ margin: "0 auto 1rem", opacity: 0.5 }}
          />
          <p>Click "Fetch Repos" to load your repositories</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {repos.map((repo) => {
            const isSelected = selectedRepos.some((r) => r.name === repo.name);
            const added = isAdded(repo.url);
            return (
              <div
                key={repo.name}
                onClick={() => !added && onToggleRepo(repo)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.875rem",
                  background: added
                    ? COLORS.card
                    : isSelected
                      ? COLORS.muted
                      : COLORS.card,
                  borderRadius: "0.75rem",
                  cursor: added ? "default" : "pointer",
                  border: `1px solid ${isSelected ? COLORS.ring : added ? "#22c55e" : COLORS.border}`,
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: `2px solid ${isSelected ? COLORS.ring : added ? "#22c55e" : COLORS.border}`,
                    background: isSelected
                      ? COLORS.ring
                      : added
                        ? "#22c55e"
                        : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      isSelected || added
                        ? COLORS.primaryForeground
                        : "transparent",
                    flexShrink: 0,
                  }}
                >
                  {(isSelected || added) && <Check size={12} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 500,
                      marginBottom: "0.25rem",
                      color: COLORS.foreground,
                    }}
                  >
                    {repo.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: COLORS.mutedForeground,
                    }}
                  >
                    {repo.description || "No description"}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    fontSize: "0.75rem",
                    color: COLORS.mutedForeground,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Star size={12} /> {repo.stars}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <GitFork size={12} /> {repo.forks}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SkillsTab({ skills, onAdd, onDelete, t }) {
  const [newSkill, setNewSkill] = useState("");

  return (
    <div>
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
          color: COLORS.foreground,
        }}
      >
        {t("admin.skills")}
      </h3>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder={t("admin.addSkill")}
          style={{ ...inputStyle, flex: 1 }}
          onKeyDown={(e) =>
            e.key === "Enter" && newSkill && (onAdd(newSkill), setNewSkill(""))
          }
        />
        <button
          onClick={() => {
            onAdd(newSkill);
            setNewSkill("");
          }}
          disabled={!newSkill}
          style={btnPrimary}
        >
          <Plus size={16} />
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {skills.map((skill) => (
          <span
            key={skill}
            style={{
              padding: "0.5rem 0.875rem",
              background: COLORS.muted,
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              color: COLORS.foreground,
            }}
          >
            {skill}
            <button
              onClick={() => onDelete(skill)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: COLORS.mutedForeground,
                padding: 0,
                display: "flex",
              }}
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function PersonalInfoTab({ info, onSave, t }) {
  return (
    <div>
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
          color: COLORS.foreground,
        }}
      >
        {t("admin.personalInfo")}
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "480px",
        }}
      >
        <div>
          <label
            style={{
              fontSize: "0.875rem",
              color: COLORS.mutedForeground,
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Name
          </label>
          <input
            value={info.name}
            onChange={(e) => onSave({ name: e.target.value })}
            placeholder="Your name"
            style={inputStyle}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "0.875rem",
              color: COLORS.mutedForeground,
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Title
          </label>
          <input
            value={info.title}
            onChange={(e) => onSave({ title: e.target.value })}
            placeholder="Your title"
            style={inputStyle}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "0.875rem",
              color: COLORS.mutedForeground,
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Bio
          </label>
          <textarea
            value={info.bio}
            onChange={(e) => onSave({ bio: e.target.value })}
            placeholder="Your bio"
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: "0.875rem",
              color: COLORS.mutedForeground,
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            Email
          </label>
          <input
            value={info.email}
            onChange={(e) => onSave({ email: e.target.value })}
            placeholder="email@example.com"
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const {
    data,
    isAuthenticated,
    login,
    logout,
    updatePersonalInfo,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    deleteSkill,
    githubRepos,
    selectedRepos,
    loadingRepos,
    loadGithubRepos,
    toggleRepo,
    importSelectedRepos,
  } = useAdmin();

  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 769);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} t={t} />;
  }

  const mainContent = (
    <div>
      <TopBar onMenuClick={() => setSidebarOpen(true)} activeTab={activeTab} />

      <div style={{ padding: "1.5rem" }}>
        {activeTab === "projects" && (
          <ProjectsTab
            projects={data.projects}
            onEdit={updateProject}
            onDelete={deleteProject}
            t={t}
          />
        )}
        {activeTab === "repos" && (
          <ReposTab
            repos={githubRepos}
            selectedRepos={selectedRepos}
            loadingRepos={loadingRepos}
            onLoadRepos={loadGithubRepos}
            onToggleRepo={toggleRepo}
            onImport={importSelectedRepos}
            isAdded={(url) => data.projects.some((p) => p.repoUrl === url)}
            t={t}
          />
        )}
        {activeTab === "skills" && (
          <SkillsTab
            skills={data.skills}
            onAdd={addSkill}
            onDelete={deleteSkill}
            t={t}
          />
        )}
        {activeTab === "personalInfo" && (
          <PersonalInfoTab
            info={data.personalInfo}
            onSave={updatePersonalInfo}
            t={t}
          />
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.background,
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* Desktop sidebar - always visible */}
      {!isMobile && (
        <div
          style={{
            width: SIDEBAR_WIDTH,
            height: "100vh",
            background: COLORS.card,
            borderRight: `1px solid ${COLORS.border}`,
            position: "fixed",
            left: 0,
            top: 0,
            display: "flex",
            flexDirection: "column",
            zIndex: 40,
          }}
        >
          <SidebarContent
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
        </div>
      )}

      {/* Mobile sidebar - overlay when open */}
      {isMobile && (
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 50,
              }}
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25 }}
                style={{
                  width: SIDEBAR_WIDTH,
                  height: "100%",
                  background: COLORS.card,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <SidebarContent
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                  onClose={() => setSidebarOpen(false)}
                  onLogout={logout}
                  isMobile={true}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <main
        style={{
          flex: 1,
          width: "100%",
          marginLeft: isMobile ? 0 : SIDEBAR_WIDTH,
        }}
      >
        {mainContent}
      </main>
    </div>
  );
}
