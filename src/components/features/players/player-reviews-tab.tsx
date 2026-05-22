"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getCardReviews, getAiSummary } from "@/services/review-service";
import type { ReviewResponse, AiSummaryResponse } from "@/types/review";
import { AiInsightPanel } from "./components/ai-insight-panel";
import { ReviewForm } from "./components/review-form";
import { ReviewItem } from "./components/review-item";
import { MessageSquareDashed, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

interface PlayerReviewsTabProps {
  cardId: number;
}

export function PlayerReviewsTab({ cardId }: PlayerReviewsTabProps) {
  const { profile, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [aiSummary, setAiSummary] = useState<AiSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = profile?.roles?.some((r) => ["ROLE_ADMIN", "ROLE_STAFF"].includes(r)) ?? false;

  const hasUserReviewed =
    isAuthenticated && reviews.some((r) => r.authorUsername === profile?.username);

  const loadReviews = useCallback(
    async (p: number) => {
      setIsLoading(true);
      try {
        const data = await getCardReviews(cardId, p, 10);
        if (p === 0) {
          setReviews(data.items);
        } else {
          setReviews((prev) => [...prev, ...data.items]);
        }
        setHasMore(data.hasNext);
        setTotalReviews(data.totalItems);
        setPage(p);
        setError(null);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Không thể tải danh sách đánh giá. Vui lòng thử lại."));
      } finally {
        setIsLoading(false);
      }
    },
    [cardId],
  );

  useEffect(() => {
    void (async () => {
      await loadReviews(0);
      const summary = await getAiSummary(cardId).catch(() => null);
      setAiSummary(summary);
    })();
  }, [cardId, loadReviews]);

  function handleReviewSubmitted(newReview: ReviewResponse) {
    setReviews((prev) => [newReview, ...prev]);
    setTotalReviews((n) => n + 1);
  }

  function handleVoteUpdate(
    reviewId: number,
    ngon: number,
    phe: number,
    currentVote: "NGON" | "PHE" | null,
  ) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, ngonCount: ngon, pheCount: phe, currentUserVote: currentVote }
          : r,
      ),
    );
  }

  function handleDeleted(reviewId: number) {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setTotalReviews((n) => Math.max(0, n - 1));
  }

  return (
    <div className="max-w-3xl">
      {/* AI Insight Panel (hiển thị nếu có dữ liệu) */}
      <AiInsightPanel summary={aiSummary} />

      {/* Review Form — chỉ khi đã đăng nhập & chưa review */}
      {isAuthenticated && !hasUserReviewed && (
        <ReviewForm cardId={cardId} onSubmitted={handleReviewSubmitted} />
      )}

      {isAuthenticated && hasUserReviewed && (
        <div className="mb-5 rounded-xl border border-[#00FF85]/20 bg-[#00FF85]/5 px-4 py-3 text-sm text-[#00FF85]/80">
          ✓ Bạn đã chia sẻ đánh giá cho thẻ cầu thủ này.
        </div>
      )}

      {!isAuthenticated && (
        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm text-white/45">
          <a href="/auth/login" className="text-[#00FF85] hover:underline font-semibold">
            Đăng nhập
          </a>{" "}
          để chia sẻ đánh giá của bạn về thẻ này.
        </div>
      )}

      {/* Review count header */}
      {totalReviews > 0 && (
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/35">
          {totalReviews} đánh giá từ cộng đồng
        </p>
      )}

      {/* Loading state */}
      {isLoading && page === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#00FF85]/50" />
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-red-400 font-medium mb-4">{error}</p>
          <button
            onClick={() => loadReviews(0)}
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 active:scale-95"
          >
            Thử lại
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <MessageSquareDashed className="h-10 w-10 text-white/15" />
          <p className="text-sm text-white/35">
            Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              currentUsername={profile?.username ?? null}
              isAdmin={isAdmin}
              onVoteUpdate={handleVoteUpdate}
              onDeleted={handleDeleted}
            />
          ))}

          {/* Load More */}
          {hasMore && (
            <button
              onClick={() => loadReviews(page + 1)}
              disabled={isLoading}
              className="mt-4 w-full rounded-xl border border-white/10 py-2.5 text-sm text-white/45 transition hover:border-white/20 hover:text-white/65 disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Xem thêm đánh giá"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
