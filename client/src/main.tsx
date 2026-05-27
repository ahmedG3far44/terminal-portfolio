import { AuthProvider } from './context/AuthContext';
import { GitHubProvider } from './context/GitHubContext';
import { AdminProvider } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <GitHubProvider>
        <LanguageProvider>
          <ThemeProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </ThemeProvider>
        </LanguageProvider>
      </GitHubProvider>
    </AuthProvider>
  </React.StrictMode>,
);
