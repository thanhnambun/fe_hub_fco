"use client";

import { useState, useEffect } from "react";
import { getRecentReviews } from "@/services/review-service";
import type { RecentReviewResponse } from "@/types/review";
import Image from "next/image";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Loader2, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<RecentReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  async function loadPage(p: number) {
    setIsLoading(true);
    try {
      const data = await getRecentReviews(p, 12);
      if (p === 0) setReviews(data.items);
      else setReviews((prev) => [...prev, ...data.items]);
      setHasMore(data.hasNext);
      setPage(p);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void (async () => {
      await loadPage(0);
    })();
  }, []);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00FF85]/15 border border-[#00FF85]/25">
            <Users className="h-5 w-5 text-[#00FF85]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Đánh giá từ Cộng đồng</h1>
        </div>
        <p className="text-sm text-white/40 ml-12">
          Trải nghiệm thực tế về các thẻ cầu thủ FC Online từ game thủ Việt Nam
        </p>
      </div>

      {/* Reviews Grid */}
      {isLoading && page === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#00FF85]/40" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <RecentReviewCard key={r.reviewId} review={r} />
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="py-20 text-center text-white/35">
              Chưa có đánh giá nào trong hệ thống.
            </div>
          )}

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => loadPage(page + 1)}
                disabled={isLoading}
                className="rounded-xl border border-white/15 bg-white/[0.03] px-8 py-3 text-sm font-bold text-white/60 transition hover:border-white/25 hover:text-white/80 disabled:opacity-40"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xem thêm đánh giá"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

function RecentReviewCard({ review }: { review: RecentReviewResponse }) {
  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <Link
      href={`/players/${review.cardId}?tab=reviews`}
      className="group block rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-white/15 hover:bg-white/[0.04]"
    >
      {/* Player mini card header */}
      <div className="mb-3 flex items-center gap-3 border-b border-white/[0.05] pb-3">
        {review.imageUrl ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <Image
              src={review.imageUrl}
              alt={review.playerName}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-xl bg-white/5 border border-white/10" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-white/90 group-hover:text-white transition">
            {review.playerName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-bold text-white/40">{review.seasonCode}</span>
            <span className="text-white/20">·</span>
            <span className="text-[11px] font-black text-[#00FF85]">OVR {review.ovr}</span>
          </div>
        </div>
      </div>

      {/* Review content */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-white/60">
            {review.authorUsername.charAt(0).toUpperCase()}
          </div>
          <span className="text-[11px] font-bold text-white/50">@{review.authorUsername}</span>
          {review.ingameRank && (
            <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-bold text-white/40">
              {review.ingameRank}
            </span>
          )}
          <span className="ml-auto text-[10px] text-white/25">{timeAgo}</span>
        </div>
        <p className="text-xs leading-relaxed text-white/65 line-clamp-3">{review.content}</p>
      </div>

      {/* Vote counts */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-[11px] font-bold text-[#00FF85]/70">
          <ThumbsUp className="h-3 w-3" />
          {review.ngonCount} NGON
        </span>
        <span className="flex items-center gap-1 text-[11px] font-bold text-red-400/70">
          <ThumbsDown className="h-3 w-3" />
          {review.pheCount} PHE
        </span>
      </div>
    </Link>
  );
}
