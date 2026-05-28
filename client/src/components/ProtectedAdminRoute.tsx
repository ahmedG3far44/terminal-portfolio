import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

function getAdminToken(): string | null {
  return localStorage.getItem('admin-token');
}

export default function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const token = getAdminToken();
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
