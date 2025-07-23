export interface DashboardStats {
  totalJobs: number;
  totalProjects: number;
  totalUsers: number;
  totalRevenue: number;
  recentJobs: Job[];
  recentProjects: Project[];
}

export interface AdminStats {
  jobs: {
    open_jobs: number;
    total: number;
    open: number;
    closed: number;
    recent: Job[];
  };
  projects: {
    total_projects: number;
    total: number;
    open: number;
    in_progress: number;
    completed: number;
    by_category: Array<{name: string; count: number}>;
    recent: Project[];
  };
  users: {
    total: number;
    clients: number;
    freelancers: number;
    admins: number;
  };
}

export interface ClientStats {
  myJobs: {
    total: number;
    open: number;
    in_progress: number;
    completed: number;
    applications_received: number;
  };
  myProjects: {
    total: number;
    open: number;
    in_progress: number;
    completed: number;
    proposals_received: number;
  };
  recentActivity: any[];
}

export interface FreelancerStats {
  applications: {
    jobs: number;
    projects: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  activeWork: {
    jobs: number;
    projects: number;
  };
  earnings: {
    total: number;
    thisMonth: number;
    pending: number;
  };
  recentActivity: any[];
}

export interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  location: string;
  skills_required: string[];
  status: string;
  is_open: boolean;
  created_at: string;
  client: User;
  category?: Category;
  applications_count?: number;
  user_has_applied?: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  location: string;
  skills_required: string[];
  status: string;
  created_at: string;
  client: User;
  selected_freelancer?: User;
  category?: Category;
  proposals_count?: number;
  user_has_applied?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  user_type: 'admin' | 'client' | 'freelancer';
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}
