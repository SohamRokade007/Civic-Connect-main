import React, { useMemo } from 'react';
import { TrendingUp, Clock, CheckCircle, Users, AlertTriangle, BarChart3 } from 'lucide-react';
import { useIssues } from '../../contexts/IssuesContext';
import { StatsCard } from '../Dashboard/StatsCard';

export const AdminStats: React.FC = () => {
  const { issues } = useIssues();

  const stats = useMemo(() => {
    const totalIssues = issues.length;
    const reportedIssues = issues.filter(i => i.status === 'reported').length;
    const inProgressIssues = issues.filter(i => i.status === 'in_progress').length;
    const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
    const criticalIssues = issues.filter(i => i.priority === 'critical').length;
    const highPriorityIssues = issues.filter(i => i.priority === 'high').length;

    // Calculate average resolution time (mock calculation)
    const resolvedWithTime = issues.filter(i => i.resolvedAt);
    const avgResolutionDays = resolvedWithTime.length > 0 ? 
      resolvedWithTime.reduce((sum, issue) => {
        const created = new Date(issue.createdAt).getTime();
        const resolved = new Date(issue.resolvedAt!).getTime();
        return sum + (resolved - created) / (1000 * 60 * 60 * 24);
      }, 0) / resolvedWithTime.length : 0;

    // Category breakdown
    const categoryStats = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalIssues,
      reportedIssues,
      inProgressIssues,
      resolvedIssues,
      criticalIssues,
      highPriorityIssues,
      avgResolutionDays: Math.round(avgResolutionDays * 10) / 10,
      categoryStats
    };
  }, [issues]);

  const getCategoryLabel = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Issues"
            value={stats.totalIssues}
            icon={BarChart3}
            color="blue"
          />
          <StatsCard
            title="Awaiting Response"
            value={stats.reportedIssues}
            icon={AlertTriangle}
            color="red"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgressIssues}
            icon={Clock}
            color="amber"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolvedIssues}
            icon={CheckCircle}
            color="emerald"
          />
          <StatsCard
            title="Critical Issues"
            value={stats.criticalIssues}
            icon={AlertTriangle}
            color="red"
          />
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Resolution Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgResolutionDays} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h3>
          <div className="space-y-4">
            {Object.entries(stats.categoryStats)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => {
                const percentage = (count / stats.totalIssues) * 100;
                return (
                  <div key={category} className="flex items-center">
                    <div className="flex-1 flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {getCategoryLabel(category)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {count} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {issues
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map(issue => (
                <div key={issue.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {issue.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {issue.status.replace('_', ' ').toUpperCase()} • {new Date(issue.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                    issue.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {issue.status.replace('_', ' ')}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};