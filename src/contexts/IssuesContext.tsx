import React, { createContext, useContext, useState, useEffect } from 'react';
import { Issue, IssueStatus, Comment } from '../types';

interface IssuesContextType {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateIssueStatus: (issueId: string, status: IssueStatus, assignedTo?: Issue['assignedTo']) => void;
  addComment: (issueId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getIssueById: (id: string) => Issue | undefined;
  loading: boolean;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
};

// Mock data for demonstration
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'There is a large pothole near the intersection of Main Street and Oak Avenue that is causing damage to vehicles.',
    category: 'pothole',
    status: 'in_progress',
    priority: 'high',
    location: {
      address: '123 Main Street, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    reportedBy: { id: '2', name: 'John Citizen' },
    assignedTo: { id: '3', name: 'Mike Johnson', department: 'Public Works' },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    comments: []
  },
  {
    id: '2',
    title: 'Broken streetlight',
    description: 'The streetlight at the corner of Pine and 2nd Street has been out for over a week.',
    category: 'streetlight',
    status: 'reported',
    priority: 'medium',
    location: {
      address: 'Corner of Pine St & 2nd Street',
    },
    reportedBy: { id: '4', name: 'Sarah Williams' },
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    comments: []
  },
  {
    id: '3',
    title: 'Overflowing garbage bin',
    description: 'The public garbage bin in Central Park is overflowing and attracting pests.',
    category: 'garbage',
    status: 'resolved',
    priority: 'medium',
    location: {
      address: 'Central Park, near playground',
    },
    reportedBy: { id: '5', name: 'Emily Chen' },
    assignedTo: { id: '6', name: 'David Rodriguez', department: 'Sanitation' },
    createdAt: '2024-01-12T08:20:00Z',
    updatedAt: '2024-01-13T14:30:00Z',
    resolvedAt: '2024-01-13T14:30:00Z',
    comments: []
  }
];

export const IssuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [loading, setLoading] = useState(false);

  const addIssue = (newIssue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const issue: Issue = {
      ...newIssue,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    setIssues(prev => [issue, ...prev]);
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus, assignedTo?: Issue['assignedTo']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            status, 
            assignedTo,
            updatedAt: new Date().toISOString(),
            resolvedAt: status === 'resolved' ? new Date().toISOString() : issue.resolvedAt
          }
        : issue
    ));
  };

  const addComment = (issueId: string, newComment: Omit<Comment, 'id' | 'createdAt'>) => {
    const comment: Comment = {
      ...newComment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setIssues(prev => prev.map(issue =>
      issue.id === issueId
        ? { ...issue, comments: [...issue.comments, comment], updatedAt: new Date().toISOString() }
        : issue
    ));
  };

  const getIssueById = (id: string) => {
    return issues.find(issue => issue.id === id);
  };

  return (
    <IssuesContext.Provider value={{
      issues,
      addIssue,
      updateIssueStatus,
      addComment,
      getIssueById,
      loading
    }}>
      {children}
    </IssuesContext.Provider>
  );
};