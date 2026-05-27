import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '../hooks/useQuery';
import { http, HttpError } from '../services/http';
import type { AdminInsights, User, Theme, PaginatedResponse } from '../types';

const COLORS = {
  background: '#09090b', foreground: '#fafafa', card: '#18181b',
  muted: '#27272a', mutedForeground: '#a1a1aa', border: '#27272a',
  primary: '#a855f7', destructive: '#ef4444', success: '#22c55e',
};

function getAdminToken(): string | null {
  return localStorage.getItem('admin-token');
}

function adminGet<T>(url: string) {
  const token = getAdminToken();
  return fetch(`/api/admin${url}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }).then(async (res) => {
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Request failed');
    return json.data as T;
  });
}

function adminPost(url: string, body?: any) {
  const token = getAdminToken();
  return fetch(`/api/admin${url}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Request failed');
    return json.data;
  });
}

function adminPatch(url: string) {
  const token = getAdminToken();
  return fetch(`/api/admin${url}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }).then(async (res) => {
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Request failed');
    return json.data;
  });
}

function adminDel(url: string) {
  const token = getAdminToken();
  return fetch(`/api/admin${url}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }).then(async (res) => {
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Request failed');
    return json.data;
  });
}

function useAdminQuery<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  return useQuery((signal?: AbortSignal) => {
    return fetcher();
  }, deps);
}

function InsightsTab() {
  const { data, loading } = useAdminQuery(() => adminGet<AdminInsights>('/insights'), []);

  if (loading) return <p style={{ color: COLORS.mutedForeground }}>Loading insights...</p>;
  if (!data) return null;

  const cards = [
    { label: 'Total Users', value: data.totalUsers },
    { label: 'Active Users', value: data.activeUsers },
    { label: 'Total Projects', value: data.totalProjects },
    { label: 'Total Skills', value: data.totalSkills },
    { label: 'Total Themes', value: data.totalThemes },
  ];

  return (
    <div>
      <h2 style={{ color: COLORS.foreground, marginBottom: '1.5rem' }}>Platform Insights</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {cards.map((card) => (
          <div key={card.label} style={{ background: COLORS.card, padding: '1.5rem', borderRadius: '0.75rem', border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: '0.8rem', color: COLORS.mutedForeground, marginBottom: '0.5rem' }}>{card.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.primary }}>{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useAdminQuery(
    () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('page', page.toString());
      params.set('limit', '20');
      return fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      }).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json as PaginatedResponse<User>;
      });
    },
    [search, page],
  );

  const handleBlock = async (id: string) => {
    await adminPatch(`/users/${id}/block`);
    refetch();
  };

  const handleActivate = async (id: string) => {
    await adminPatch(`/users/${id}/activate`);
    refetch();
  };

  const users = data?.data || [];

  return (
    <div>
      <h2 style={{ color: COLORS.foreground, marginBottom: '1.5rem' }}>User Management</h2>

      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by username or email..."
        style={{ width: '100%', maxWidth: '400px', padding: '0.625rem 0.75rem', background: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '0.5rem', color: COLORS.foreground, fontSize: '0.875rem', outline: 'none', marginBottom: '1.5rem' }}
      />

      {loading ? (
        <p style={{ color: COLORS.mutedForeground }}>Loading users...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {users.map((user) => (
            <div key={user._id} style={{ background: COLORS.card, padding: '1rem', borderRadius: '0.75rem', border: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user.avatarUrl && <img src={user.avatarUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />}
                <div>
                  <div style={{ color: COLORS.foreground, fontWeight: 500 }}>@{user.username}</div>
                  <div style={{ color: COLORS.mutedForeground, fontSize: '0.8rem' }}>{user.email || 'No email'}</div>
                  <div style={{ color: user.isActive ? COLORS.success : COLORS.destructive, fontSize: '0.75rem' }}>
                    {user.isActive ? 'Active' : 'Blocked'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => user.isActive ? handleBlock(user._id) : handleActivate(user._id)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                  fontWeight: 500, fontSize: '0.8rem',
                  background: user.isActive ? COLORS.destructive : COLORS.success,
                  color: 'white',
                }}
              >
                {user.isActive ? 'Block' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      )}

      {data && data.total > 20 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.foreground, cursor: 'pointer' }}>Previous</button>
          <span style={{ color: COLORS.mutedForeground, padding: '0.5rem' }}>Page {data.page} of {Math.ceil(data.total / data.limit)}</span>
          <button disabled={page >= Math.ceil(data.total / data.limit)} onClick={() => setPage((p) => p + 1)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.foreground, cursor: 'pointer' }}>Next</button>
        </div>
      )}
    </div>
  );
}

function ThemesTab() {
  const { data: themes, loading, refetch } = useAdminQuery(() => adminGet<Theme[]>('/themes'), []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', primary: '', rgb: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = async () => {
    if (editingId) {
      await adminPost(`/themes/${editingId}`, form);
    } else {
      await adminPost('/themes', form);
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', slug: '', primary: '', rgb: '' });
    refetch();
  };

  const handleDelete = async (id: string) => {
    await adminDel(`/themes/${id}`);
    refetch();
  };

  const handleEdit = (theme: Theme) => {
    setForm({ name: theme.name, slug: theme.slug, primary: theme.primary, rgb: theme.rgb });
    setEditingId(theme._id!);
    setShowForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: COLORS.foreground }}>Theme Management</h2>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', slug: '', primary: '', rgb: '' }); }} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: COLORS.primary, color: COLORS.foreground, fontWeight: 500 }}>Add Theme</button>
      </div>

      {showForm && (
        <div style={{ background: COLORS.card, padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name (e.g. Neon Green)" style={{ padding: '0.5rem', background: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '0.375rem', color: COLORS.foreground, outline: 'none' }} />
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug (e.g. green)" style={{ padding: '0.5rem', background: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '0.375rem', color: COLORS.foreground, outline: 'none' }} />
            <input value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} placeholder="Primary (e.g. #39ff14)" style={{ padding: '0.5rem', background: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '0.375rem', color: COLORS.foreground, outline: 'none' }} />
            <input value={form.rgb} onChange={(e) => setForm({ ...form, rgb: e.target.value })} placeholder="RGB (e.g. 57, 255, 20)" style={{ padding: '0.5rem', background: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '0.375rem', color: COLORS.foreground, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSave} disabled={!form.name || !form.slug || !form.primary || !form.rgb} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', background: COLORS.primary, color: '#09090b', fontWeight: 500 }}>Save</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.mutedForeground, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: COLORS.mutedForeground }}>Loading themes...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
          {(themes || []).map((theme) => (
            <div key={theme._id} style={{ background: COLORS.card, padding: '1rem', borderRadius: '0.75rem', border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: theme.primary, border: `2px solid ${COLORS.border}` }} />
                <div>
                  <div style={{ color: COLORS.foreground, fontWeight: 500 }}>{theme.name}</div>
                  <div style={{ color: COLORS.mutedForeground, fontSize: '0.75rem' }}>{theme.slug}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: COLORS.mutedForeground, marginBottom: '0.75rem' }}>
                {theme.primary} | rgb({theme.rgb})
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(theme)} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.foreground, cursor: 'pointer', fontSize: '0.75rem' }}>Edit</button>
                <button onClick={() => handleDelete(theme._id!)} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: `1px solid ${COLORS.destructive}`, background: 'transparent', color: COLORS.destructive, cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('insights');

  const token = getAdminToken();
  if (!token) {
    navigate('/admin/super/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    navigate('/admin/super/login');
  };

  const tabs = [
    { id: 'insights', label: 'Insights' },
    { id: 'users', label: 'Users' },
    { id: 'themes', label: 'Themes' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: COLORS.foreground, fontSize: '1.5rem' }}>Super Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                  fontWeight: 500, fontSize: '0.875rem',
                  background: tab === t.id ? COLORS.primary : 'transparent',
                  color: tab === t.id ? '#09090b' : COLORS.mutedForeground,
                }}
              >
                {t.label}
              </button>
            ))}
            <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.mutedForeground, cursor: 'pointer', fontSize: '0.875rem' }}>Logout</button>
          </div>
        </div>

        {tab === 'insights' && <InsightsTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'themes' && <ThemesTab />}
      </div>
    </div>
  );
}
