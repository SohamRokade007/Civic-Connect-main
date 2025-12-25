import React from 'react';
import { MapPin, Clock, User, AlertTriangle, CheckCircle, PlayCircle, XCircle } from 'lucide-react';
import { Issue } from '../../types';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'reported':
        return <AlertTriangle className="h-4 w-4" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'reported':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'low':
        return 'border-l-green-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'high':
        return 'border-l-orange-500';
      case 'critical':
        return 'border-l-red-500';
    }
  };

  const getCategoryLabel = (category: Issue['category']) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${getPriorityColor(issue.priority)} overflow-hidden hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
              {getStatusIcon(issue.status)}
              <span className="ml-1">{issue.status.replace('_', ' ').toUpperCase()}</span>
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {getCategoryLabel(issue.category)}
            </span>
          </div>
          <span className={`text-xs font-medium ${
            issue.priority === 'critical' ? 'text-red-600' :
            issue.priority === 'high' ? 'text-orange-600' :
            issue.priority === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {issue.priority.toUpperCase()}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {issue.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {issue.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{issue.location.address}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Reported by {issue.reportedBy.name}</span>
          </div>
          
          {issue.assignedTo && (
            <div className="flex items-center text-sm text-blue-600">
              <User className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Assigned to {issue.assignedTo.name} ({issue.assignedTo.department})</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Created {formatDate(issue.createdAt)}</span>
          </div>
        </div>
      </div>

      {issue.comments.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {issue.comments.length} comment{issue.comments.length === 1 ? '' : 's'}
          </p>
        </div>
      )}
    </div>
  );
};