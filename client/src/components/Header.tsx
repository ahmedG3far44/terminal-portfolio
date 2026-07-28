import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogIn, LayoutDashboard, LogOut, User } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const { isAuthenticated, user, loading, login, logout } = useAuth();
  const { colors } = useTheme();
  const primary = colors?.primary || '#ec4899';
  const rgb = colors?.rgb || '57, 255, 20';
  const [visible, setVisible] = useState(true);
  const prevScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const delta = current - prevScroll.current;
      if (current < 20) {
        setVisible(true);
      } else if (delta > 5) {
        setVisible(false);
      } else if (delta < -5) {
        setVisible(true);
      }
      prevScroll.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'rgba(9, 9, 11, 0.4)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${primary}20`,
        fontFamily: "'JetBrains Mono', monospace",
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0.625rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
      <Logo color={primary} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {loading ? (
          <span style={{ fontSize: '0.75rem', color: `rgba(${rgb}, 0.5)` }}>...</span>
        ) : isAuthenticated && user ? (
          <>
            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                border: `1px solid ${primary}30`,
                color: `rgba(${rgb}, 0.7)`,
                textDecoration: 'none',
                fontSize: '0.75rem',
                transition: 'all 0.15s',
              }}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.625rem 0.25rem 0.25rem',
                borderRadius: '9999px',
                border: `1px solid ${primary}20`,
              }}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `rgba(${rgb}, 0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={12} style={{ color: `rgba(${rgb}, 0.6)` }} />
                </div>
              )}
              <span style={{ fontSize: '0.75rem', color: `rgba(${rgb}, 0.7)` }}>{user.username}</span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{
                background: 'none',
                border: `1px solid ${primary}20`,
                borderRadius: '0.375rem',
                color: `rgba(${rgb}, 0.5)`,
                cursor: 'pointer',
                padding: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <LogOut size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={login}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.375rem',
              border: `1px solid ${primary}`,
              background: 'transparent',
              color: primary,
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <LogIn size={14} />
            Login
          </button>
        )}
      </div>
      </div>
    </header>
  );
}
