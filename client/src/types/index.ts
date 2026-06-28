export interface User {
  id: string; // uuid
  email: string;
  fullName: string;
  userType: "community" | "company";
  communityRole?: "student" | "lecturer" | "staff" | "admin";
  companyName?: string;
  industry?: string;
  contactPerson?: string;
  phone?: string;
  createdAt?: string;
  profilePicture?: string;
  location?: string;
}

export interface Idea {
  id: string; // uuid
  userId: string; // uuid
  startupName: string;
  category: string;
  shortDescription: string;
  coverImageUrl?: string;
  logoUrl?: string;
  ownerName: string;
  ownerProfilePicture?: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  commentCount: number;
  downvoteCount: number;
  upvoteCount: number;
  youtubeUrl?: string;
  slidesUrl?: string;
  hasPitchDeck?: boolean;
  interestCount?: number;
  phoneNumber?: string;
}

export interface Comment {
  id: string;
  ideaId: string;
  userId: string;
  content: string;
  authorName: string;
  createdAt: string;
  authorPicture: string;
  companyName: string;
}

export type VoteType = "up" | "down";

export interface VoteResponse {
  netScore: number;
  userVote: VoteType | null;
}

export type InterestStatus =
  | "pending"
  | "contacted"
  | "in_discussion"
  | "declined"
  | "closed";

export interface Interest {
  id: string;
  ideaId: string;
  companyId: string;
  companyName: string;
  industry: string;
  email: string;
  message: string | null;
  createdAt: string;
  status: InterestStatus;
  statusUpdatedAt: string | null;
  ideaName: string;
  profilePicture?: string;
}

export interface SentInterest {
  id: string;
  ideaId: string;
  companyId: string;
  ideaName: string;
  message: string | null;
  createdAt: string;
  status: InterestStatus;
  statusUpdatedAt: string | null;
  ownerEmail: string | null;
}

export interface TopIdea {
  id: string;
  startupName: string;
  logoUrl: string | null;
  upvoteCount: number;
}
