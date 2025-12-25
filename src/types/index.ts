export interface User {
  id: string;
  email: string;
  name: string;
  role: 'resident' | 'authority';
  department?: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  reportedBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    department: string;
  };
  images?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    role: 'resident' | 'authority';
  };
  createdAt: string;
}

export type IssueCategory = 
  | 'pothole'
  | 'streetlight'
  | 'garbage'
  | 'graffiti'
  | 'traffic_signal'
  | 'water_leak'
  | 'noise'
  | 'other';

export type IssueStatus = 
  | 'reported'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface DashboardStats {
  totalIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  averageResolutionTime: number;
}