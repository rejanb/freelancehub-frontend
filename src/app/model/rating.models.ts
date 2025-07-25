export interface Rating {
  id: number;
  project_id: number;
  project_title: string;
  freelancer_id: number;
  client_id: number;
  rated_by: number;
  rated_by_name: string;
  rated_user: number;
  rated_user_name: string;
  rating: number; // Overall rating 1-5
  review?: string;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  payment_rating?: number;
  clarity_rating?: number;
  would_recommend: boolean;
  created_at: string;
  updated_at: string;
}

export interface RatingSummary {
  average_rating: number;
  total_ratings: number;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  payment_rating?: number;
  clarity_rating?: number;
  rating_breakdown: {
    five_star: number;
    four_star: number;
    three_star: number;
    two_star: number;
    one_star: number;
  };
}

export interface PendingRating {
  project_id: number;
  project_title: string;
  project_description?: string;
  project_status: string;
  freelancer_id: number;
  freelancer_name: string;
  client_id: number;
  client_name: string;
  completed_date: string;
  rating_for: 'freelancer' | 'client';
  days_since_completion: number;
}

export interface RatingRequest {
  project_id: number;
  freelancer_id?: number;
  client_id?: number;
  rating: number;
  review?: string;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  payment_rating?: number;
  clarity_rating?: number;
  would_recommend?: boolean;
}
