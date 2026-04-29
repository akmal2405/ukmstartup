export interface User {
  id: number;
  email: string;
  fullName: string;
  userType: "community" | "company";
  communityRole?: "student" | "lecturer" | "staff";
  companyName?: string;
  industry?: string;
  contactPerson?: string;
  phone?: string;
}

export interface Idea {
  id: number;
  user_id: number;
  company_name: string;
  startup_name?: string;
  category: string;
  short_description: string;
  cover_image_url?: string;
  logo_url?: string;
  owner_name: string;
  created_at: string;
  comment_count: number;
  downvote_count: number;
  upvote_count: number;
}

export interface Comment {
  id: number;
  idea_id: number;
  user_id: number;
  content: string;
  author_name: string;
  created_at: string;
}

export type VoteType = "up" | "down";

export interface VoteResponse {
  net_score: number;
  user_vote: VoteType | null;
}
