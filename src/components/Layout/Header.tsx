import React from 'react';
import { MapPin, User, LogOut, Home, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">CivicConnect</h1>
            </div>
            
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'dashboard'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Home className="inline h-4 w-4 mr-1" />
                Dashboard
              </button>
              
              {user && (
                <>
                  <button
                    onClick={() => onViewChange('report')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'report'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    Report Issue
                  </button>
                  
                  {user.role === 'authority' && (
                    <button
                      onClick={() => onViewChange('admin')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === 'admin'
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <Settings className="inline h-4 w-4 mr-1" />
                      Admin Panel
                    </button>
                  )}
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  {user.role === 'authority' && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {user.department}
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onViewChange('auth')}
                className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};