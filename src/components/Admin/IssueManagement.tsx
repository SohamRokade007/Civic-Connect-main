import React, { useState } from 'react';
import { Search, Filter, Edit, MessageSquare } from 'lucide-react';
import { useIssues } from '../../contexts/IssuesContext';
import { useAuth } from '../../contexts/AuthContext';
import { Issue, IssueStatus } from '../../types';
import { IssueCard } from '../Dashboard/IssueCard';

export const IssueManagement: React.FC = () => {
  const { issues, updateIssueStatus } = useIssues();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (issueId: string, newStatus: IssueStatus) => {
    const assignedTo = newStatus === 'in_progress' && user ? {
      id: user.id,
      name: user.name,
      department: user.department || 'Public Works'
    } : undefined;

    updateIssueStatus(issueId, newStatus, assignedTo);
    setSelectedIssue(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Issue Management</h2>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="reported">Reported</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIssues.map(issue => (
          <div key={issue.id} className="relative">
            <IssueCard
              issue={issue}
              onClick={() => setSelectedIssue(issue)}
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSelectedIssue(issue)}
                className="bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors"
                title="Manage issue"
              >
                <Edit className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedIssue.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Issue #{selectedIssue.id} • Reported by {selectedIssue.reportedBy.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedIssue.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-700">{selectedIssue.location.address}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['reported', 'in_progress', 'resolved', 'closed'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedIssue.id, status as IssueStatus)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedIssue.status === status
                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                        }`}
                      >
                        {status.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedIssue.assignedTo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Assigned To</h4>
                    <p className="text-gray-700">
                      {selectedIssue.assignedTo.name} ({selectedIssue.assignedTo.department})
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Created: {new Date(selectedIssue.createdAt).toLocaleString()}</p>
                    <p>Updated: {new Date(selectedIssue.updatedAt).toLocaleString()}</p>
                    {selectedIssue.resolvedAt && (
                      <p>Resolved: {new Date(selectedIssue.resolvedAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};