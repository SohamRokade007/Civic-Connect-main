import React, { useState } from 'react';
import { Settings, Users, FileText, BarChart3, Filter } from 'lucide-react';
import { useIssues } from '../../contexts/IssuesContext';
import { useAuth } from '../../contexts/AuthContext';
import { IssueManagement } from './IssueManagement';
import { AdminStats } from './AdminStats';

type AdminView = 'overview' | 'issues' | 'users' | 'reports';

export const AdminPanel: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const { user } = useAuth();
  const { issues } = useIssues();

  if (!user || user.role !== 'authority') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Settings className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700">You must be a municipal authority to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'issues', label: 'Issue Management', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: Filter }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Settings className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                <p className="text-sm text-gray-600">{user.department}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as AdminView)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {currentView === 'overview' && <AdminStats />}
          {currentView === 'issues' && <IssueManagement />}
          {currentView === 'users' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
              <p className="text-gray-600">User management functionality coming soon.</p>
            </div>
          )}
          {currentView === 'reports' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports</h3>
              <p className="text-gray-600">Advanced reporting functionality coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};