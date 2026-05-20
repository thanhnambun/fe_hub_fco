import { apiClient } from "@/services/api-client";
import type {
  ReviewResponse,
  VoteResponse,
  AiSummaryResponse,
  RecentReviewResponse,
  ReviewRequest,
  ReplyRequest,
  VoteRequest,
  ReplyResponse,
} from "@/types/review";
import type { PageResponse, ResponseWrapper } from "@/types/player-api";

// ── Card Reviews ──────────────────────────────────────────────────────────────

export async function getCardReviews(
  cardId: number,
  page = 0,
  size = 10,
): Promise<PageResponse<ReviewResponse>> {
  const res = await apiClient.get<ResponseWrapper<PageResponse<ReviewResponse>>>(
    `/api/v1/cards/${cardId}/reviews`,
    { params: { page, size } },
  );
  return res.data.data;
}

export async function submitReview(
  cardId: number,
  request: ReviewRequest,
): Promise<ReviewResponse> {
  const res = await apiClient.post<ResponseWrapper<ReviewResponse>>(
    `/api/v1/cards/${cardId}/reviews`,
    request,
  );
  return res.data.data;
}

// ── Votes ─────────────────────────────────────────────────────────────────────

export async function toggleVote(reviewId: number, request: VoteRequest): Promise<VoteResponse> {
  const res = await apiClient.post<ResponseWrapper<VoteResponse>>(
    `/api/v1/reviews/${reviewId}/vote`,
    request,
  );
  return res.data.data;
}

// ── Replies ───────────────────────────────────────────────────────────────────

export async function addReply(reviewId: number, request: ReplyRequest): Promise<ReplyResponse> {
  const res = await apiClient.post<ResponseWrapper<ReplyResponse>>(
    `/api/v1/reviews/${reviewId}/replies`,
    request,
  );
  return res.data.data;
}

// ── Delete Review ─────────────────────────────────────────────────────────────

export async function deleteReview(reviewId: number): Promise<void> {
  await apiClient.delete(`/api/v1/reviews/${reviewId}`);
}

// ── AI Summary ────────────────────────────────────────────────────────────────

export async function getAiSummary(cardId: number): Promise<AiSummaryResponse | null> {
  const res = await apiClient.get<ResponseWrapper<AiSummaryResponse | null>>(
    `/api/v1/cards/${cardId}/ai-summary`,
  );
  return res.data.data;
}

// ── Recent Reviews ────────────────────────────────────────────────────────────

export async function getRecentReviews(
  page = 0,
  size = 10,
): Promise<PageResponse<RecentReviewResponse>> {
  const res = await apiClient.get<ResponseWrapper<PageResponse<RecentReviewResponse>>>(
    `/api/v1/reviews/recent`,
    { params: { page, size } },
  );
  return res.data.data;
}
