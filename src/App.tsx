import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { AuthForm } from './components/Auth/AuthForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ReportForm } from './components/Report/ReportForm';
import { AdminPanel } from './components/Admin/AdminPanel';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IssuesProvider } from './contexts/IssuesContext';

type View = 'dashboard' | 'report' | 'admin' | 'auth';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if user is not logged in and trying to access protected routes
  if (!user && (currentView === 'report' || currentView === 'admin')) {
    setCurrentView('auth');
  }

  // Auto-redirect from auth page if user is already logged in
  if (user && currentView === 'auth') {
    setCurrentView('dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'auth' && (
        <Header currentView={currentView} onViewChange={setCurrentView} />
      )}
      
      <main>
        {currentView === 'auth' && <AuthForm />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'report' && <ReportForm />}
        {currentView === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <IssuesProvider>
        <AppContent />
      </IssuesProvider>
    </AuthProvider>
  );
}

export default App;