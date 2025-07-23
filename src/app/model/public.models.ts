// Public data models for non-authenticated users

export interface PublicUser {
  id: number;
  username: string;
  user_type: 'client' | 'freelancer' | 'admin';
}

export interface PublicJob {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  location: string;
  skills_required: string[];
  status: string;
  created_at: string;
  client: PublicUser;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  is_featured?: boolean;
}

export interface PublicProject {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  location: string;
  skills_required: string[];
  status: string;
  created_at: string;
  client: PublicUser;
  selected_freelancer?: PublicUser;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  is_featured?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface PublicListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PublicStats {
  total_jobs: number;
  total_projects: number;
  active_freelancers: number;
  active_clients: number;
  categories: Category[];
}
