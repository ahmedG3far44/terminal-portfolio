import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useGitHub } from '../context/GitHubContext';
import { GitHubProvider } from '../context/GitHubContext';
import {
  FolderKanban, GitBranch, Wrench, User, Menu, X, Home, Loader2,
  Plus, Pencil, Trash2, Check, Star, GitFork, LucideLogOut, Link as LinkIcon,
} from 'lucide-react';
import { http } from '../services/http';
import { getContactIcon } from '../components/ContactIcons';
import type { Project, PersonalInfo, Contact } from '../types';

const COLORS = {
  background: '#09090b',
  foreground: '#fafafa',
  card: '#18181b',
  cardForeground: '#fafafa',
  primary: '#f4f4f5',
  primaryForeground: '#18181b',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
  border: '#27272a',
  destructive: '#ef4444',
  input: '#27272a',
  ring: '#f4f4f5',
};

const SIDEBAR_WIDTH = 280;

const emptyProject: Omit<Project, '_id' | 'id'> = {
  title: '',
  description: '',
  slug: '',
  repoUrl: '',
  liveDemoUrl: '',
  tags: [],
  techStack: [],
  tools: [],
  coverImage: null,
};

function TagInput({
  value, onChange, placeholder, disabled, existing,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  disabled: boolean;
  existing?: string[];
}) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addItem = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const removeItem = (item: string) => {
    onChange(value.filter((v) => v !== item));
  };

  const suggestions = existing
    ? existing.filter((s) => !value.includes(s) && s.toLowerCase().includes(input.toLowerCase()))
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addItem(input);
            }
            if (e.key === 'Backspace' && !input && value.length > 0) {
              removeItem(value[value.length - 1]);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          style={disabled ? inputDisabledStyle : inputStyle}
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
          background: COLORS.card, border: `1px solid ${COLORS.border}`,
          borderRadius: '0.5rem', marginTop: '2px', maxHeight: '150px', overflowY: 'auto',
        }}>
          {suggestions.map((s) => (
            <div
              key={s}
              onMouseDown={() => addItem(s)}
              style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: COLORS.foreground }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.muted)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {s}
            </div>
          ))}
        </div>
      )}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {value.map((item) => (
            <span key={item} style={{
              padding: '0.25rem 0.625rem', background: COLORS.muted, borderRadius: '9999px',
              display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem',
              color: COLORS.foreground, opacity: disabled ? 0.5 : 1,
            }}>
              {item}
              <button onClick={() => !disabled && removeItem(item)} disabled={disabled}
                style={{ background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', color: COLORS.mutedForeground, padding: 0, display: 'flex', fontSize: '0.8rem' }}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CoverImageUpload({
  value, onChange, disabled, onBusyChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
  const MAX_SIZE = 20 * 1024 * 1024;

  const previewUrl = file ? URL.createObjectURL(file) : value;
  const isVideo = previewUrl
    ? file
      ? file.type === 'video/mp4'
      : /\.mp4$/i.test(value || '')
    : false;

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(previewUrl || '');
    };
  }, [file, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Invalid file type. Accepted: PNG, JPEG, GIF, MP4');
      setFile(null);
      e.target.value = '';
      return;
    }

    if (f.size > MAX_SIZE) {
      setError('File too large. Max 20MB.');
      setFile(null);
      e.target.value = '';
      return;
    }

    setFile(f);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    onBusyChange?.(true);
    setError(null);
    try {
      const result = await http.upload<{ url: string }>('/upload', file);
      onChange(result.url);
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      onBusyChange?.(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setFile(null);
    setError(null);
  };

  const isBusy = uploading || disabled;

  return (
    <div>
      {previewUrl ? (
        <div style={{ marginBottom: '0.75rem' }}>
          {isVideo ? (
            <video
              src={previewUrl}
              muted
              loop
              autoPlay
              style={{ width: '100%', maxHeight: '240px', borderRadius: '0.5rem', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: '100%', maxHeight: '240px', borderRadius: '0.5rem', objectFit: 'cover' }}
            />
          )}
        </div>
      ) : (
        <div
          style={{
            marginBottom: '0.75rem', padding: '2rem', border: `2px dashed ${COLORS.border}`,
            borderRadius: '0.5rem', textAlign: 'center', color: COLORS.mutedForeground, fontSize: '0.875rem',
          }}
        >
          No cover image selected
        </div>
      )}

      {error && (
        <p style={{ ...errorTextStyle, marginBottom: '0.5rem' }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{
          ...buttonStyle, ...btnGhost, cursor: isBusy ? 'default' : 'pointer',
          opacity: isBusy ? 0.5 : 1, fontSize: '0.8rem',
        }}>
          {file ? 'Change file' : 'Choose file'}
          <input
            type="file"
            accept=".png,.jpeg,.jpg,.gif,.mp4"
            onChange={handleFileChange}
            disabled={isBusy}
            style={{ display: 'none' }}
          />
        </label>

        {file && (
          <button onClick={handleUpload} disabled={isBusy}
            style={{ ...btnPrimary, opacity: isBusy ? 0.6 : 1, fontSize: '0.8rem' }}>
            {uploading ? <Spinner size={14} /> : 'Upload'}
          </button>
        )}

        {value && (
          <button onClick={handleRemove} disabled={isBusy}
            style={{ ...btnGhost, color: COLORS.destructive, opacity: isBusy ? 0.5 : 1, fontSize: '0.8rem' }}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

function Spinner({ size = 20 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      style={{ color: COLORS.mutedForeground, display: 'flex' }}
    >
      <Loader2 size={size} />
    </motion.div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  background: COLORS.input,
  border: `1px solid ${COLORS.border}`,
  borderRadius: '0.5rem',
  color: COLORS.foreground,
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const inputDisabledStyle: React.CSSProperties = {
  ...inputStyle,
  opacity: 0.5,
  cursor: 'not-allowed',
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: COLORS.destructive,
  boxShadow: `0 0 0 1px ${COLORS.destructive}`,
};

const errorTextStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: COLORS.destructive,
  marginTop: '0.25rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s',
};

const btnPrimary: React.CSSProperties = {
  ...buttonStyle,
  background: COLORS.primary,
  color: COLORS.primaryForeground,
};

const btnGhost: React.CSSProperties = {
  ...buttonStyle,
  background: 'transparent',
  color: COLORS.mutedForeground,
};

function LoginScreen() {
  const { login, loading } = useAuth();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('auth-token', token);
      window.location.replace('/admin');
    } else {
      setCheckingToken(false);
    }
  }, []);

  if (checkingToken) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background }}>
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background, padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.card, padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '360px', border: `1px solid ${COLORS.border}` }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', background: COLORS.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><Wrench size={24} /></div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: COLORS.foreground }}>Admin Dashboard</h2>
          <p style={{ fontSize: '0.875rem', color: COLORS.mutedForeground }}>Sign in with GitHub to manage your portfolio</p>
        </div>
        <button onClick={login} disabled={loading} style={{ ...btnPrimary, width: '100%', opacity: loading ? 0.7 : 1 }}>
          {loading ? <Spinner size={16} /> : 'Sign in with GitHub'}
        </button>
      </motion.div>
    </div>
  );
}

function SidebarContent({
  activeTab, setActiveTab, onClose, isMobile,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'projects', label: t('admin.projects') || 'Projects', icon: FolderKanban },
    { id: 'repos', label: 'GitHub Repos', icon: GitBranch },
    { id: 'skills', label: t('admin.skills') || 'Skills', icon: Wrench },
    { id: 'personalInfo', label: t('admin.personalInfo') || 'Personal Info', icon: User },
    { id: 'contacts', label: t('contact.title') || 'Contacts', icon: LinkIcon },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.5rem', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: COLORS.foreground }}>Admin Dashboard</div>
        {isMobile && onClose && (
          <button onClick={onClose} style={{ ...btnGhost, padding: '0.5rem' }}><X size={20} /></button>
        )}
      </div>
      <nav style={{ padding: '0.75rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onClose?.(); }}
              style={{
                width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                fontSize: '0.875rem', fontWeight: isActive ? 500 : 400,
                background: isActive ? COLORS.muted : 'transparent',
                color: isActive ? COLORS.foreground : COLORS.mutedForeground,
                transition: 'all 0.15s', marginBottom: '0.25rem',
              }}
            >
              <Icon size={18} /> {item.label}
            </button>
          );
        })}
      </nav>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', padding: '0.75rem 1rem', borderTop: `1px solid ${COLORS.border}` }}>
        <Link to={user?.username ? `/${user.username}` : '/portfolio'} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: COLORS.mutedForeground, textDecoration: 'none', fontSize: '0.875rem' }}>
          <Home size={18} /> Back to Portfolio
        </Link>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', background: COLORS.muted, color: COLORS.primary, textDecoration: 'none', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
          <LucideLogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}

function AdminContent() {
  const { data, loading, error, refetch, updatePersonalInfo, addProject, updateProject, deleteProject, addSkill, deleteSkill, addContact, updateContact, deleteContact, migrateSocialFields, saving } = useAdmin();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 769);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background }}>
        <Spinner size={32} />
        <span style={{ color: COLORS.mutedForeground, marginLeft: '1rem' }}>Loading portfolio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.background, color: COLORS.destructive }}>
        <p>Error: {error}</p>
        <button onClick={refetch} style={btnPrimary}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background }}>
      {!isMobile && (
        <div style={{ width: SIDEBAR_WIDTH, height: '100vh', background: COLORS.card, borderRight: `1px solid ${COLORS.border}`, position: 'fixed', left: 0, top: 0, zIndex: 40 }}>
          <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}

      {isMobile && (
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} onClick={() => setSidebarOpen(false)}>
              <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: 'spring', damping: 25 }} style={{ width: SIDEBAR_WIDTH, height: '100%', background: COLORS.card }} onClick={(e) => e.stopPropagation()}>
                <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setSidebarOpen(false)} isMobile />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <main style={{ flex: 1, width: '100%', marginLeft: isMobile ? 0 : SIDEBAR_WIDTH }}>
        <div style={{ height: '60px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${COLORS.border}`, background: COLORS.card }}>
          <button onClick={() => setSidebarOpen(true)} style={{ ...btnGhost, padding: '0.5rem', display: isMobile ? 'flex' : 'none' }}><Menu size={20} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 500, color: COLORS.mutedForeground }}>
              {user?.username ? `@${user.username}` : ''} / {activeTab}
            </span>
            {saving && <Spinner size={14} />}
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {activeTab === 'projects' && data && (
            <ProjectsTab projects={data.projects} skills={data.skills} onAdd={addProject} onEdit={updateProject} onDelete={deleteProject} t={t} saving={saving} />
          )}
          {activeTab === 'repos' && <ReposTabWrapper t={t} />}
          {activeTab === 'skills' && data && (
            <SkillsTab skills={data.skills} onAdd={addSkill} onDelete={deleteSkill} t={t} saving={saving} />
          )}
          {activeTab === 'personalInfo' && data && (
            <PersonalInfoTab info={data.personalInfo} onSave={updatePersonalInfo} t={t} saving={saving} />
          )}
          {activeTab === 'contacts' && data && (
            <ContactsTab
              contacts={data.contacts}
              onAdd={addContact}
              onEdit={updateContact}
              onDelete={deleteContact}
              onMigrate={migrateSocialFields}
              t={t}
              saving={saving}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function ProjectsTab({
  projects, skills, onAdd, onEdit, onDelete, t, saving,
}: {
  projects: Project[];
  skills: string[];
  onAdd: (p: Omit<Project, '_id'>) => Promise<void>;
  onEdit: (id: string, p: Partial<Project>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  t: (key: string) => string;
  saving: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Omit<Project, '_id' | 'id'> | Project | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savingForm, setSavingForm] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const validate = (project: any) => {
    const newErrors: Record<string, string> = {};
    if (!project.title?.trim()) newErrors.title = 'Title is required';
    if (!project.slug?.trim()) newErrors.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(project.slug)) newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';
    if (project.repoUrl && !/^https?:\/\//.test(project.repoUrl)) newErrors.repoUrl = 'Must be a valid URL starting with http:// or https://';
    if (project.liveDemoUrl && !/^https?:\/\//.test(project.liveDemoUrl)) newErrors.liveDemoUrl = 'Must be a valid URL starting with http:// or https://';
    return newErrors;
  };

  const handleSave = async () => {
    if (!editingProject) return;
    const newErrors = validate(editingProject);
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setSavingForm(true);
    try {
      const hasId = '_id' in editingProject || 'id' in editingProject;
      if (hasId) {
        const id = (editingProject as any)._id || (editingProject as any).id;
        await onEdit(id, editingProject);
      } else {
        await onAdd(editingProject as Omit<Project, '_id'>);
      }
      setEditingProject(null);
      setShowForm(false);
      setErrors({});
    } finally {
      setSavingForm(false);
    }
  };

  const openForm = (project: Project | null = null) => {
    setEditingProject(project || { ...emptyProject });
    setShowForm(true);
    setErrors({});
  };

  const isSaving = savingForm || saving || uploadingCover;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.foreground }}>{t('admin.projects')}</h3>
        <button onClick={() => openForm()} disabled={isSaving} style={{ ...btnPrimary, opacity: isSaving ? 0.6 : 1 }}><Plus size={16} /> {t('admin.addProject')}</button>
      </div>

      <AnimatePresence>
        {showForm && editingProject && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ padding: '0 0 1.5rem 0', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <input value={(editingProject as any).title || ''} onChange={(e) => setEditingProject((p: any) => ({ ...p, title: e.target.value }))} placeholder={t('projectForm.title')} disabled={isSaving} style={errors.title ? inputErrorStyle : isSaving ? inputDisabledStyle : inputStyle} />
                {errors.title && <p style={errorTextStyle}>{errors.title}</p>}
              </div>
              <div>
                <input value={(editingProject as any).slug || ''} onChange={(e) => setEditingProject((p: any) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))} placeholder={t('projectForm.slug')} disabled={isSaving} style={errors.slug ? inputErrorStyle : isSaving ? inputDisabledStyle : inputStyle} />
                {errors.slug && <p style={errorTextStyle}>{errors.slug}</p>}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <textarea value={(editingProject as any).description || ''} onChange={(e) => setEditingProject((p: any) => ({ ...p, description: e.target.value }))} placeholder={t('projectForm.description')} rows={3} disabled={isSaving} style={{ ...(isSaving ? inputDisabledStyle : inputStyle), resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <input value={(editingProject as any).repoUrl || ''} onChange={(e) => setEditingProject((p: any) => ({ ...p, repoUrl: e.target.value }))} placeholder={t('projectForm.repoUrl')} disabled={isSaving} style={errors.repoUrl ? inputErrorStyle : isSaving ? inputDisabledStyle : inputStyle} />
                {errors.repoUrl && <p style={errorTextStyle}>{errors.repoUrl}</p>}
              </div>
              <div>
                <input value={(editingProject as any).liveDemoUrl || ''} onChange={(e) => setEditingProject((p: any) => ({ ...p, liveDemoUrl: e.target.value }))} placeholder={t('projectForm.liveDemoUrl')} disabled={isSaving} style={errors.liveDemoUrl ? inputErrorStyle : isSaving ? inputDisabledStyle : inputStyle} />
                {errors.liveDemoUrl && <p style={errorTextStyle}>{errors.liveDemoUrl}</p>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: COLORS.mutedForeground, marginBottom: '0.375rem', display: 'block' }}>{t('projectForm.tags') || 'Tags'}</label>
                <TagInput
                  value={(editingProject as any).tags || []}
                  onChange={(v) => setEditingProject((p: any) => ({ ...p, tags: v }))}
                  placeholder="Type and press Enter to add"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: COLORS.mutedForeground, marginBottom: '0.375rem', display: 'block' }}>{t('projectForm.techStack') || 'Tech Stack'}</label>
                <TagInput
                  value={(editingProject as any).techStack || []}
                  onChange={(v) => setEditingProject((p: any) => ({ ...p, techStack: v }))}
                  placeholder="Type and press Enter to add"
                  disabled={isSaving}
                  existing={skills}
                />
              </div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: COLORS.mutedForeground, marginBottom: '0.375rem', display: 'block' }}>{t('projectForm.tools') || 'Tools'}</label>
              <TagInput
                value={(editingProject as any).tools || []}
                onChange={(v) => setEditingProject((p: any) => ({ ...p, tools: v }))}
                placeholder="Type and press Enter to add"
                disabled={isSaving}
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: COLORS.mutedForeground, marginBottom: '0.375rem', display: 'block' }}>Cover Image / Video</label>
              <CoverImageUpload
                value={(editingProject as any).coverImage || null}
                onChange={(url) => setEditingProject((p: any) => ({ ...p, coverImage: url }))}
                disabled={isSaving}
                onBusyChange={setUploadingCover}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={() => { setShowForm(false); setEditingProject(null); setErrors({}); }} disabled={isSaving} style={{ ...btnGhost, opacity: isSaving ? 0.5 : 1 }}>{t('admin.cancel')}</button>
              <button onClick={handleSave} disabled={isSaving} style={{ ...btnPrimary, opacity: isSaving ? 0.6 : 1 }}>
                {isSaving ? <Spinner size={14} /> : null} {t('admin.save')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {projects.map((project) => (
          <div key={project._id || project.slug} style={{ background: COLORS.muted, padding: '1rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${COLORS.border}` }}>
            <div>
              <h4 style={{ fontWeight: 500, marginBottom: '0.25rem', color: COLORS.foreground }}>{project.title}</h4>
              <p style={{ fontSize: '0.8rem', color: COLORS.mutedForeground }}>{project.slug}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => openForm(project)} disabled={isSaving} style={{ ...btnGhost, padding: '0.5rem', color: COLORS.foreground, opacity: isSaving ? 0.4 : 1 }}><Pencil size={16} /></button>
              <button onClick={() => onDelete(project._id || project.slug)} disabled={isSaving} style={{ ...btnGhost, padding: '0.5rem', color: COLORS.destructive, opacity: isSaving ? 0.4 : 1 }}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReposTabWrapper({ t }: { t: (key: string) => string }) {
  return <GitHubProvider><ReposTabInner t={t} /></GitHubProvider>;
}

const CACHE_KEY = 'github-repos-cache';

function ReposTabInner({ t }: { t: (key: string) => string }) {
  const { repos: fetchedRepos, repoLoading, loadRepos } = useGitHub();
  const { data, saving, refetch: refetchPortfolio } = useAdmin();
  const [selectedRepos, setSelectedRepos] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [cachedRepos, setCachedRepos] = useState<any[] | null>(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const repos = fetchedRepos.length > 0 ? fetchedRepos : (cachedRepos || []);

  const handleLoadRepos = () => {
    sessionStorage.removeItem(CACHE_KEY);
    setCachedRepos(null);
    loadRepos();
  };

  const toggleRepo = (repo: any) => {
    setSelectedRepos((prev) => {
      const exists = prev.find((r) => r.name === repo.name);
      if (exists) return prev.filter((r) => r.name !== repo.name);
      return [...prev, repo];
    });
  };

  const importSelected = async () => {
    setImporting(true);
    try {
      const newProjects = selectedRepos.map((repo: any) => ({
        title: repo.name,
        description: repo.description || '',
        slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        repoUrl: repo.url,
        liveDemoUrl: '',
        tags: [],
        techStack: [],
        tools: [],
        coverImage: null,
      }));
      const current = data?.projects || [];
      await http.put('/portfolio', { projects: [...current, ...newProjects] });
      refetchPortfolio();
      setSelectedRepos([]);
    } finally {
      setImporting(false);
    }
  };

  const isBusy = repoLoading || importing || saving;
  const isAdded = (url: string) => data?.projects.some((p) => p.repoUrl === url);

  useEffect(() => {
    if (fetchedRepos.length > 0) {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(fetchedRepos));
      setCachedRepos(fetchedRepos);
    }
  }, [fetchedRepos]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.foreground }}>GitHub Repositories</h3>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleLoadRepos} disabled={isBusy} style={{ ...btnPrimary, opacity: isBusy ? 0.6 : 1 }}>
            {repoLoading ? <Spinner size={16} /> : <GitBranch size={16} />}
            {repoLoading ? 'Loading...' : 'Fetch Repos'}
          </button>
          {selectedRepos.length > 0 && (
            <button onClick={importSelected} disabled={isBusy} style={{ ...buttonStyle, background: '#22c55e', color: 'white', opacity: isBusy ? 0.6 : 1 }}>
              {importing ? <Spinner size={16} /> : <Check size={16} />} Import ({selectedRepos.length})
            </button>
          )}
        </div>
      </div>

      {repos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: COLORS.mutedForeground, background: COLORS.muted, borderRadius: '0.75rem' }}>
          <GitBranch size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>{cachedRepos === null ? 'Click "Fetch Repos" to load your repositories' : 'No repositories found'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {repos.map((repo) => {
            const sel = selectedRepos.some((r) => r.name === repo.name);
            const added = isAdded(repo.url);
            return (
              <div
                key={repo.name}
                onClick={() => !isBusy && !added && toggleRepo(repo)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem',
                  background: added ? COLORS.card : sel ? COLORS.muted : COLORS.card,
                  borderRadius: '0.75rem', cursor: isBusy || added ? 'default' : 'pointer',
                  border: `1px solid ${sel ? COLORS.ring : added ? '#22c55e' : COLORS.border}`,
                  transition: 'all 0.15s', opacity: isBusy ? 0.6 : 1,
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '4px',
                  border: `2px solid ${sel ? COLORS.ring : added ? '#22c55e' : COLORS.border}`,
                  background: sel ? COLORS.ring : added ? '#22c55e' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: sel || added ? COLORS.primaryForeground : 'transparent', flexShrink: 0,
                }}>
                  {(sel || added) && <Check size={12} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: COLORS.foreground }}>{repo.name}</div>
                  <div style={{ fontSize: '0.8rem', color: COLORS.mutedForeground }}>{repo.description || 'No description'}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: COLORS.mutedForeground, flexShrink: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={12} /> {repo.stars}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><GitFork size={12} /> {repo.forks}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SkillsTab({ skills, onAdd, onDelete, t, saving }: {
  skills: string[];
  onAdd: (s: string) => Promise<void>;
  onDelete: (s: string) => Promise<void>;
  t: (key: string) => string;
  saving: boolean;
}) {
  const [newSkill, setNewSkill] = useState('');
  const [savingSkill, setSavingSkill] = useState(false);

  const handleAdd = async () => {
    if (!newSkill.trim()) return;
    setSavingSkill(true);
    try {
      await onAdd(newSkill.trim());
      setNewSkill('');
    } finally {
      setSavingSkill(false);
    }
  };

  const handleDelete = async (skill: string) => {
    setSavingSkill(true);
    try {
      await onDelete(skill);
    } finally {
      setSavingSkill(false);
    }
  };

  const isBusy = savingSkill || saving;

  return (
    <div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', color: COLORS.foreground }}>{t('admin.skills')}</h3>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder={t('admin.addSkill')}
          disabled={isBusy}
          style={{ ...(isBusy ? inputDisabledStyle : inputStyle), flex: 1 }}
          onKeyDown={(e) => e.key === 'Enter' && !isBusy && handleAdd()}
        />
        <button onClick={handleAdd} disabled={!newSkill.trim() || isBusy} style={{ ...btnPrimary, opacity: !newSkill.trim() || isBusy ? 0.6 : 1 }}>
          {savingSkill ? <Spinner size={14} /> : <Plus size={16} />}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {skills.map((skill) => (
          <span key={skill} style={{ padding: '0.5rem 0.875rem', background: COLORS.muted, borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: COLORS.foreground, opacity: isBusy ? 0.6 : 1 }}>
            {skill}
            <button onClick={() => handleDelete(skill)} disabled={isBusy} style={{ background: 'none', border: 'none', cursor: isBusy ? 'default' : 'pointer', color: COLORS.mutedForeground, padding: 0, display: 'flex' }}><X size={14} /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

function PersonalInfoTab({ info, onSave, t, saving }: {
  info: PersonalInfo;
  onSave: (info: PersonalInfo) => Promise<void>;
  t: (key: string) => string;
  saving: boolean;
}) {
  const [form, setForm] = useState<PersonalInfo>({ ...info });
  const [dirty, setDirty] = useState(false);
  const [savingLocal, setSavingLocal] = useState(false);

  useEffect(() => {
    setForm({ ...info });
    setDirty(false);
  }, [info]);

  const handleChange = (field: keyof PersonalInfo, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSavingLocal(true);
    try {
      await onSave(form);
      setDirty(false);
    } finally {
      setSavingLocal(false);
    }
  };

  const isBusy = savingLocal || saving;

  return (
    <div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', color: COLORS.foreground }}>{t('admin.personalInfo')}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
        <div>
          <label style={{ fontSize: '0.875rem', color: COLORS.mutedForeground, marginBottom: '0.5rem', display: 'block' }}>Name</label>
          <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} disabled={isBusy} placeholder="Your name" style={isBusy ? inputDisabledStyle : inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.875rem', color: COLORS.mutedForeground, marginBottom: '0.5rem', display: 'block' }}>Title</label>
          <input value={form.title} onChange={(e) => handleChange('title', e.target.value)} disabled={isBusy} placeholder="Your title" style={isBusy ? inputDisabledStyle : inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.875rem', color: COLORS.mutedForeground, marginBottom: '0.5rem', display: 'block' }}>Bio</label>
          <textarea value={form.bio} onChange={(e) => handleChange('bio', e.target.value)} disabled={isBusy} placeholder="Your bio" rows={4} style={{ ...(isBusy ? inputDisabledStyle : inputStyle), resize: 'vertical' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.875rem', color: COLORS.mutedForeground, marginBottom: '0.5rem', display: 'block' }}>Available for Hire</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: COLORS.foreground, fontSize: '0.875rem', cursor: isBusy ? 'default' : 'pointer' }}>
            <input type="checkbox" checked={form.availableForHire} onChange={(e) => handleChange('availableForHire', e.target.checked)} disabled={isBusy} style={{ accentColor: COLORS.primary }} />
            Yes
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button onClick={handleSave} disabled={!dirty || isBusy} style={{ ...btnPrimary, opacity: !dirty || isBusy ? 0.6 : 1 }}>
            {isBusy ? <Spinner size={14} /> : null} {isBusy ? 'Saving...' : 'Save Changes'}
          </button>
          {!savingLocal && saving && <Spinner size={14} />}
        </div>
      </div>
    </div>
  );
}

function ContactsTab({
  contacts, onAdd, onEdit, onDelete, onMigrate, t, saving,
}: {
  contacts: Contact[];
  onAdd: (c: { type: string; value: string; label?: string }) => Promise<void>;
  onEdit: (id: string, c: Partial<Contact>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMigrate: () => Promise<void>;
  t: (key: string) => string;
  saving: boolean;
}) {
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const [savingLocal, setSavingLocal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [migrated, setMigrated] = useState(false);

  const contactTypes = [
    'linkedin', 'github', 'x', 'instagram', 'email', 'phone',
    'website', 'youtube', 'dribbble', 'behance', 'medium', 'other',
  ];

  const validate = (typeVal: string, val: string): string | null => {
    if (!val.trim()) return 'contact.validation.required';
    switch (typeVal) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'contact.validation.invalidEmail';
      case 'phone':
        return /^\+?[\d\s\-()]{7,20}$/.test(val) ? null : 'contact.validation.invalidPhone';
      case 'linkedin':
      case 'github':
      case 'x':
      case 'instagram':
      case 'website':
      case 'youtube':
      case 'dribbble':
      case 'behance':
      case 'medium':
      case 'other':
        return /^https?:\/\/.+/.test(val) ? null : 'contact.validation.invalidUrl';
      default:
        return null;
    }
  };

  const handleAdd = async () => {
    const validationError = validate(type, value);
    if (validationError) { setError(t(validationError)); return; }
    if (!type) { setError(t('contact.validation.required')); return; }
    setSavingLocal(true);
    setError('');
    try {
      await onAdd({ type, value, label: label || undefined });
      setType('');
      setValue('');
      setLabel('');
    } finally {
      setSavingLocal(false);
    }
  };

  const startEdit = (contact: Contact) => {
    setEditingId(contact._id || contact.id || '');
    setEditValue(contact.value);
    setEditLabel(contact.label || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditLabel('');
  };

  const saveEdit = async (contact: Contact) => {
    const validationError = validate(contact.type, editValue);
    if (validationError) { setError(t(validationError)); return; }
    setSavingLocal(true);
    setError('');
    try {
      await onEdit(contact._id || contact.id || '', { value: editValue, label: editLabel || '' });
      cancelEdit();
    } finally {
      setSavingLocal(false);
    }
  };

  const isBusy = savingLocal || saving;

  const needsMigration = contacts.length === 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.foreground }}>{t('contact.title')}</h3>
        {needsMigration && !migrated && (
          <button onClick={async () => { await onMigrate(); setMigrated(true); }} disabled={isBusy} style={{ ...btnGhost, opacity: isBusy ? 0.6 : 1 }}>
            {t('contact.migrate')}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setError(''); }}
          disabled={isBusy}
          style={{ ...(isBusy ? inputDisabledStyle : inputStyle), width: '160px' }}
        >
          <option value="">{t('contact.type')}</option>
          {contactTypes.map((ct) => (
            <option key={ct} value={ct}>{t(`contact.types.${ct}`)}</option>
          ))}
        </select>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          placeholder={t('contact.value')}
          disabled={isBusy}
          style={{ ...(isBusy ? inputDisabledStyle : inputStyle), flex: 1, minWidth: '200px' }}
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t('contact.label')}
          disabled={isBusy}
          style={{ ...(isBusy ? inputDisabledStyle : inputStyle), width: '160px' }}
        />
        <button onClick={handleAdd} disabled={!type || !value.trim() || isBusy} style={{ ...btnPrimary, opacity: !type || !value.trim() || isBusy ? 0.6 : 1 }}>
          {savingLocal ? <Spinner size={14} /> : <Plus size={16} />}
        </button>
      </div>

      {error && <p style={{ ...errorTextStyle, marginBottom: '0.75rem' }}>{error}</p>}

      {contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: COLORS.mutedForeground, background: COLORS.muted, borderRadius: '0.75rem' }}>
          <LinkIcon size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>{t('contact.noContacts')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {contacts.map((contact) => {
            const Icon = getContactIcon(contact.type);
            const isEditing = editingId === (contact._id || contact.id);
            return (
              <div key={contact._id || contact.id} style={{ background: COLORS.muted, padding: '0.75rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: `1px solid ${COLORS.border}` }}>
                <Icon size={18} style={{ color: COLORS.mutedForeground, flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: COLORS.mutedForeground, minWidth: '80px', textTransform: 'capitalize' }}>
                  {t(`contact.types.${contact.type}`)}
                </span>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '0.5rem', flex: 1, alignItems: 'center' }}>
                    <input value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ ...inputStyle, flex: 1 }} autoFocus />
                    <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} placeholder={t('contact.label')} style={{ ...inputStyle, width: '120px' }} />
                    <button onClick={() => saveEdit(contact)} disabled={isBusy} style={{ ...btnPrimary, padding: '0.375rem 0.75rem', fontSize: '0.8rem', opacity: isBusy ? 0.6 : 1 }}>
                      <Check size={14} />
                    </button>
                    <button onClick={cancelEdit} disabled={isBusy} style={{ ...btnGhost, padding: '0.375rem 0.75rem', fontSize: '0.8rem', opacity: isBusy ? 0.6 : 1 }}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: '0.875rem', color: COLORS.foreground, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.label ? `${contact.label} (${contact.value})` : contact.value}
                    </span>
                    <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                      <button onClick={() => startEdit(contact)} disabled={isBusy} style={{ ...btnGhost, padding: '0.375rem', color: COLORS.foreground, opacity: isBusy ? 0.4 : 1 }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => onDelete(contact._id || contact.id || '')} disabled={isBusy} style={{ ...btnGhost, padding: '0.375rem', color: COLORS.destructive, opacity: isBusy ? 0.4 : 1 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.background }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (!isAuthenticated) return <LoginScreen />;
  return <AdminContent />;
}
