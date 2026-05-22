"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { addReply } from "@/services/review-service";
import type { ReplyResponse } from "@/types/review";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { getErrorMessage } from "@/lib/utils";

interface ReplyListProps {
  reviewId: number;
  initialReplies: ReplyResponse[];
  currentUsername: string | null;
}

export function ReplyList({ reviewId, initialReplies, currentUsername }: ReplyListProps) {
  const [replies, setReplies] = useState<ReplyResponse[]>(initialReplies);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function mentionUser(username: string) {
    setReplyText((prev) => {
      const base = prev.trim();
      const prefix = `@${username} `;
      return base.startsWith(prefix) ? base : prefix + base;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUsername) {
      toast.error("Bạn cần đăng nhập để phản hồi.");
      return;
    }
    if (replyText.trim().length < 2) return;
    setIsSubmitting(true);
    try {
      const newReply = await addReply(reviewId, { content: replyText.trim() });
      setReplies((prev) => [...prev, newReply]);
      setReplyText("");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Không thể gửi phản hồi."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Existing replies */}
      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-white/60">
            {reply.authorUsername.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 py-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <button
                className="text-[11px] font-bold text-[#00E5FF]/80 hover:text-[#00E5FF] transition"
                onClick={() => mentionUser(reply.authorUsername)}
                title="Nhắc đến người này"
              >
                @{reply.authorUsername}
              </button>
              <span className="text-[10px] text-white/25">
                {formatDistanceToNow(new Date(reply.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>
            <p className="text-xs text-white/65 leading-relaxed">{reply.content}</p>
          </div>
        </div>
      ))}

      {/* Reply input */}
      {currentUsername ? (
        <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Viết phản hồi..."
            maxLength={280}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/80 placeholder-white/25 focus:border-[#00FF85]/30 focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={isSubmitting || replyText.trim().length < 2}
            className="flex items-center gap-1 rounded-xl border border-[#00FF85]/25 bg-[#00FF85]/10 px-3 py-2 text-xs font-bold text-[#00FF85] transition hover:bg-[#00FF85]/20 disabled:opacity-40"
          >
            <Send className="h-3 w-3" />
          </button>
        </form>
      ) : (
        <p className="text-[11px] text-white/30 text-center pt-1">Đăng nhập để phản hồi.</p>
      )}
    </div>
  );
}
