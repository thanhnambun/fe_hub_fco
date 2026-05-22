export interface ReviewResponse {
  id: number;
  cardId: number;
  authorUsername: string;
  authorFullName: string;
  ingameRank: string | null;
  content: string;
  status: string;
  ngonCount: number;
  pheCount: number;
  /** Vote của user hiện tại: "NGON" | "PHE" | null */
  currentUserVote: "NGON" | "PHE" | null;
  replyCount: number;
  replies: ReplyResponse[];
  createdAt: string;
}

export interface ReplyResponse {
  id: number;
  authorUsername: string;
  authorFullName: string;
  content: string;
  createdAt: string;
}

export interface VoteResponse {
  reviewId: number;
  ngonCount: number;
  pheCount: number;
  currentUserVote: "NGON" | "PHE" | null;
}

export interface AiSummaryResponse {
  cardId: number;
  positiveTags: string[];
  negativeTags: string[];
  summary: string;
  updatedAt: string;
}

export interface RecentReviewResponse {
  reviewId: number;
  cardId: number;
  playerName: string;
  seasonCode: string;
  imageUrl: string | null;
  ovr: number;
  authorUsername: string;
  content: string;
  ingameRank: string | null;
  ngonCount: number;
  pheCount: number;
  createdAt: string;
}

export interface ReviewRequest {
  content: string;
  ingameRank?: string;
}

export interface ReplyRequest {
  content: string;
}

export interface VoteRequest {
  voteType: "NGON" | "PHE";
}

export interface CardVoteRequest {
  voteType: "NGON" | "PHE";
}

export interface CardVoteResponse {
  cardId: number;
  ngonCount: number;
  pheCount: number;
  currentUserVote: "NGON" | "PHE" | null;
}
