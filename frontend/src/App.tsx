import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { AssetsPage } from './pages/AssetsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { TasksPage } from './pages/TasksPage';
import { UsersPage } from './pages/UsersPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/assets" element={<AssetsPage />} />
                  <Route path="/incidents" element={<IncidentsPage />} />
                  <Route path="/tasks" element={<TasksPage />} />

                  {/* Role Guarded IT Head Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['IT_HEAD']} />}>
                    <Route path="/users" element={<UsersPage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>
            </Routes>
          </HashRouter>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
