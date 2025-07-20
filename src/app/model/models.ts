export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  user_type: 'client' | 'freelancer';
  bio: string;
  skills: string[];
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
