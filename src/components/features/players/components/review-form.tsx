"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { submitReview } from "@/services/review-service";
import type { ReviewResponse } from "@/types/review";
import { getErrorMessage } from "@/lib/utils";

const INGAME_RANKS = ["Thách Đấu", "Cao Thủ", "Huyền Thoại", "Tinh Anh", "Vàng", "Bạc", "Đồng"];

const MAX_CHARS = 280;

interface ReviewFormProps {
  cardId: number;
  onSubmitted: (review: ReviewResponse) => void;
}

export function ReviewForm({ cardId, onSubmitted }: ReviewFormProps) {
  const [content, setContent] = useState("");
  const [ingameRank, setIngameRank] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;
  const isTooShort = content.trim().length < 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isTooShort || isOverLimit) return;

    setIsSubmitting(true);
    try {
      const review = await submitReview(cardId, {
        content: content.trim(),
        ingameRank: ingameRank || undefined,
      });
      onSubmitted(review);
      setContent("");
      setIngameRank("");
      toast.success("Đăng đánh giá thành công!");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Không thể gửi đánh giá. Vui lòng thử lại."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3"
    >
      <p className="text-xs font-black uppercase tracking-widest text-[#00FF85]">
        Viết đánh giá của bạn
      </p>

      {/* Rank selector */}
      <select
        value={ingameRank}
        onChange={(e) => setIngameRank(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 focus:border-[#00FF85]/40 focus:outline-none focus:ring-1 focus:ring-[#00FF85]/20"
      >
        <option value="">-- Rank in-game của bạn (tuỳ chọn) --</option>
        {INGAME_RANKS.map((r) => (
          <option key={r} value={r} className="bg-slate-900">
            {r}
          </option>
        ))}
      </select>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chia sẻ trải nghiệm thực tế của bạn về thẻ này... (tối thiểu 10 ký tự)"
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 placeholder-white/30 focus:border-[#00FF85]/40 focus:outline-none focus:ring-1 focus:ring-[#00FF85]/20 transition"
        />
        {/* Character counter */}
        <span
          className={`absolute bottom-3 right-3 text-[11px] font-mono font-bold transition ${
            isOverLimit ? "text-red-400" : remaining <= 30 ? "text-amber-400" : "text-white/30"
          }`}
        >
          {remaining}
        </span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || isTooShort || isOverLimit}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00FF85] px-5 py-2.5 text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#00FF85]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
      </button>
    </form>
  );
}
