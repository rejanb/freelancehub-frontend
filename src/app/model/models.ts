export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  user_type: 'client' | 'freelancer';
  bio: string;
  skills: string[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  user_type: 'client' | 'freelancer';
  bio?: string;
  skills?: string[];
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CurrentUser {
  name: string;
  type: 'client' | 'freelancer';
  email: string;
  id: number;
  profile_picture? : string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: string;
  id: number;
  email: string;
  user_type: 'client' | 'freelancer';
  profile_picture?: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  client: number;
  created_at: string;
  updated_at: string;
  status: string;
  category?: number;
  tags?: string[];
  attachments?: string;
  location?: string;
  skills_required?: string[];
  is_public: boolean;
  selected_freelancer?: number;
  completed_at?: string;
  is_featured: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Job {
  id: number;
  client: User;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  created_at: string;
  is_open: boolean;
}

export interface Proposal {
  id: number;
  job: Job;
  freelancer:  User;
  cover_letter: string;
  bid_amount: number;
  created_at: string;
  is_accepted: boolean;
}

export interface Contract {
  id: number;
  proposal?: any;  // Proposal model (for job contracts)
  project_proposal?: any;  // ProjectProposal model (for project contracts)
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'cancelled';
  total_payment: number;
  deliverables?: string;
  milestones?: string;
  created_at: string;
  updated_at: string;
  client?: User;
  freelancer?: User;
  attachments?: any[];  // Contract attachments
}

export interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: number;
  due_date: string;
  status: MilestoneStatus;
  project: number;
  created_by: number;
  assigned_to?: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  payment_status: PaymentStatus;
  deliverables?: string[];
  notes?: string;
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  REFUNDED = 'refunded'
}

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string;
  transaction_id?: string;
  contract?: number;
  milestone?: number;
  payer: number;
  payee: number;
  description?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  refunded_at?: string;
}

export interface CreateMilestone {
  title: string;
  description: string;
  amount: number;
  due_date: string;
  project: number;
  assigned_to?: number;
  deliverables?: string[];
  notes?: string;
}

export interface UpdateMilestone {
  title?: string;
  description?: string;
  amount?: number;
  due_date?: string;
  status?: MilestoneStatus;
  assigned_to?: number;
  deliverables?: string[];
  notes?: string;
  payment_status?: PaymentStatus;
}

export interface MilestoneResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Milestone[];
}
