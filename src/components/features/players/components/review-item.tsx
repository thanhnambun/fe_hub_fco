"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toggleVote, deleteReview } from "@/services/review-service";
import type { ReviewResponse } from "@/types/review";
import { ReplyList } from "./reply-list";

interface ReviewItemProps {
  review: ReviewResponse;
  currentUsername: string | null;
  isAdmin: boolean;
  onVoteUpdate: (
    reviewId: number,
    ngon: number,
    phe: number,
    currentVote: "NGON" | "PHE" | null,
  ) => void;
  onDeleted: (reviewId: number) => void;
}

const RANK_COLORS: Record<string, string> = {
  "Thách Đấu": "bg-red-500/20 text-red-300 border-red-500/30",
  "Cao Thủ": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Huyền Thoại": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Tinh Anh": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Vàng: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Bạc: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  Đồng: "bg-orange-700/20 text-orange-400 border-orange-700/30",
};

export function ReviewItem({
  review,
  currentUsername,
  isAdmin,
  onVoteUpdate,
  onDeleted,
}: ReviewItemProps) {
  const [ngon, setNgon] = useState(review.ngonCount);
  const [phe, setPhe] = useState(review.pheCount);
  const [currentVote, setCurrentVote] = useState<"NGON" | "PHE" | null>(review.currentUserVote);
  const [showReplies, setShowReplies] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [voted, setVoted] = useState<"NGON" | "PHE" | null>(null);

  const isOwner = currentUsername === review.authorUsername;
  const canDelete = isOwner || isAdmin;

  async function handleVote(type: "NGON" | "PHE") {
    if (!currentUsername) {
      toast.error("Bạn cần đăng nhập để bình chọn.");
      return;
    }
    if (isVoting) return;
    setIsVoting(true);
    // Micro-animation trigger
    setVoted(type);
    setTimeout(() => setVoted(null), 400);
    try {
      const result = await toggleVote(review.id, { voteType: type });
      setNgon(result.ngonCount);
      setPhe(result.pheCount);
      setCurrentVote(result.currentUserVote);
      onVoteUpdate(review.id, result.ngonCount, result.pheCount, result.currentUserVote);
    } catch {
      toast.error("Không thể bình chọn. Vui lòng thử lại.");
    } finally {
      setIsVoting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này không?")) return;
    setIsDeleting(true);
    try {
      await deleteReview(review.id);
      onDeleted(review.id);
      toast.success("Đã xóa đánh giá.");
    } catch {
      toast.error("Không thể xóa đánh giá.");
    } finally {
      setIsDeleting(false);
    }
  }

  const rankColor =
    review.ingameRank && RANK_COLORS[review.ingameRank]
      ? RANK_COLORS[review.ingameRank]
      : "bg-white/10 text-white/50 border-white/10";

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Avatar placeholder */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00FF85]/30 to-[#00E5FF]/30 text-xs font-black text-white">
            {review.authorUsername.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-bold text-white/90">
              {review.authorFullName || review.authorUsername}
            </span>
            {review.ingameRank && (
              <span
                className={`ml-2 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${rankColor}`}
              >
                {review.ingameRank}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-white/35">{timeAgo}</span>
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 text-white/30 transition hover:text-red-400"
              title="Xóa đánh giá"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="mb-4 text-sm leading-relaxed text-white/75">{review.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* NGON vote */}
        <button
          onClick={() => handleVote("NGON")}
          disabled={isVoting}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black uppercase tracking-wider transition select-none
            ${voted === "NGON" ? "scale-95" : "scale-100"}
            ${
              currentVote === "NGON"
                ? "border-[#00FF85]/40 bg-[#00FF85]/15 text-[#00FF85] shadow-[0_0_12px_rgba(0,255,133,0.2)]"
                : "border-white/10 bg-white/[0.03] text-white/50 hover:border-[#00FF85]/30 hover:text-[#00FF85]"
            }`}
          style={{ transition: "all 0.15s ease" }}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          NGON <span className="font-mono">{ngon}</span>
        </button>

        {/* PHE vote */}
        <button
          onClick={() => handleVote("PHE")}
          disabled={isVoting}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black uppercase tracking-wider transition select-none
            ${voted === "PHE" ? "scale-95" : "scale-100"}
            ${
              currentVote === "PHE"
                ? "border-red-400/40 bg-red-400/15 text-red-400 shadow-[0_0_12px_rgba(248,113,113,0.2)]"
                : "border-white/10 bg-white/[0.03] text-white/50 hover:border-red-400/30 hover:text-red-400"
            }`}
          style={{ transition: "all 0.15s ease" }}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          PHE <span className="font-mono">{phe}</span>
        </button>

        {/* Reply toggle */}
        <button
          onClick={() => setShowReplies((v) => !v)}
          className="ml-auto flex items-center gap-1.5 text-[11px] text-white/35 transition hover:text-white/65"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {review.replyCount > 0 ? `${review.replyCount} phản hồi` : "Phản hồi"}
        </button>
      </div>

      {/* Replies */}
      {showReplies && (
        <div className="mt-4 border-t border-white/[0.05] pt-4">
          <ReplyList
            reviewId={review.id}
            initialReplies={review.replies}
            currentUsername={currentUsername}
          />
        </div>
      )}
    </div>
  );
}
