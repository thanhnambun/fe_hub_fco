"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleCardVote } from "@/services/review-service";
import type { CardVoteResponse } from "@/types/review";
import Link from "next/link";

interface PlayerCardVoteBarProps {
  cardId: number;
  initialNgon: number;
  initialPhe: number;
  initialUserVote: "NGON" | "PHE" | null;
  isAuthenticated: boolean;
}

/**
 * Nút bình chọn NGON / PHẾ trực tiếp trên thẻ cầu thủ.
 *
 * Chiến lược Optimistic UI:
 * 1. Lưu snapshot state trước khi gọi API.
 * 2. Tính toán và áp dụng state mới ngay lập tức (zero-latency feel).
 * 3. Nếu API trả về kết quả thành công → cập nhật với số liệu chính xác từ server.
 * 4. Nếu API fail (401, 500, network disconnect) → rollback về snapshot cũ + toast thông báo.
 * 5. `router.refresh()` sau mỗi vote thành công để đồng bộ với Server Component.
 */
export function PlayerCardVoteBar({
  cardId,
  initialNgon,
  initialPhe,
  initialUserVote,
  isAuthenticated,
}: PlayerCardVoteBarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [ngon, setNgon] = useState(initialNgon);
  const [phe, setPhe] = useState(initialPhe);
  const [currentVote, setCurrentVote] = useState<"NGON" | "PHE" | null>(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);
  const [animating, setAnimating] = useState<"NGON" | "PHE" | null>(null);

  // Chờ sau khi client mount mới render UI phụ thuộc auth state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const total = ngon + phe;
  const ngonPct = total > 0 ? Math.round((ngon / total) * 100) : 50;
  const phePct = total > 0 ? 100 - ngonPct : 50;

  /**
   * Tính toán state optimistic dựa trên state hiện tại + voteType mới.
   * Phản ánh đúng logic toggle phía backend (hủy / đổi / tạo mới).
   */
  function computeOptimisticState(type: "NGON" | "PHE") {
    if (currentVote === type) {
      // Toggle off: hủy vote
      return {
        ngon: type === "NGON" ? Math.max(0, ngon - 1) : ngon,
        phe: type === "PHE" ? Math.max(0, phe - 1) : phe,
        vote: null as "NGON" | "PHE" | null,
      };
    }
    if (currentVote !== null) {
      // Đổi vote: -1 cũ, +1 mới
      return {
        ngon: type === "NGON" ? ngon + 1 : Math.max(0, ngon - 1),
        phe: type === "PHE" ? phe + 1 : Math.max(0, phe - 1),
        vote: type,
      };
    }
    // Tạo mới
    return {
      ngon: type === "NGON" ? ngon + 1 : ngon,
      phe: type === "PHE" ? phe + 1 : phe,
      vote: type,
    };
  }

  const handleVote = useCallback(
    async (type: "NGON" | "PHE") => {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để bình chọn.");
        return;
      }
      // Guard: không gửi request mới khi đang chờ request cũ
      if (isVoting) return;

      // ── Lưu snapshot để rollback nếu cần ──────────────────────────────────
      const snapshot = { ngon, phe, vote: currentVote };

      const ANIMATION_TIMEOUT_MS = 350;
      const HTTP_STATUS_TOO_MANY_REQUESTS = 429;

      // ── Optimistic update ngay lập tức ────────────────────────────────────
      const optimistic = computeOptimisticState(type);
      setNgon(optimistic.ngon);
      setPhe(optimistic.phe);
      setCurrentVote(optimistic.vote);
      setAnimating(type);
      setTimeout(() => setAnimating(null), ANIMATION_TIMEOUT_MS);
      setIsVoting(true);

      try {
        // ── Gọi API ──────────────────────────────────────────────────────────
        const result: CardVoteResponse = await toggleCardVote(cardId, { voteType: type });

        // ── Cập nhật với số liệu chính xác từ server ─────────────────────────
        setNgon(result.ngonCount);
        setPhe(result.pheCount);
        setCurrentVote(result.currentUserVote);

        // ── Refresh Server Component để đồng bộ cache Next.js ────────────────
        router.refresh();
      } catch (err: unknown) {
        // ── ROLLBACK về state cũ ─────────────────────────────────────────────
        setNgon(snapshot.ngon);
        setPhe(snapshot.phe);
        setCurrentVote(snapshot.vote);

        // Phân loại lỗi để hiển thị toast phù hợp
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else if (status === HTTP_STATUS_TOO_MANY_REQUESTS) {
          toast.error("Bạn đang thao tác quá nhanh. Vui lòng chờ một chút.");
        } else if (!status) {
          toast.error("Mất kết nối. Vui lòng kiểm tra internet và thử lại.");
        } else {
          toast.error("Không thể bình chọn. Vui lòng thử lại.");
        }
      } finally {
        setIsVoting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, isVoting, ngon, phe, currentVote, cardId, router],
  );

  return (
    <div className="mt-6 w-full max-w-xl rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
      {/* Title */}
      <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-white/40">
        Cộng đồng đánh giá thẻ này
      </p>

      {/* Vote buttons */}
      <div className="flex items-center gap-3">
        {/* NGON button */}
        <button
          id={`btn-ngon-card-${cardId}`}
          type="button"
          disabled={isVoting}
          onClick={() => handleVote("NGON")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-black uppercase tracking-wider transition select-none
            ${animating === "NGON" ? "scale-95" : "scale-100"}
            ${
              currentVote === "NGON"
                ? "border-[#00FF85]/50 bg-[#00FF85]/15 text-[#00FF85] shadow-[0_0_20px_rgba(0,255,133,0.25)]"
                : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#00FF85]/30 hover:text-[#00FF85]/90"
            }
            disabled:cursor-not-allowed disabled:opacity-60`}
          style={{ transition: "all 0.15s ease" }}
          title={mounted && !isAuthenticated ? "Đăng nhập để bình chọn" : undefined}
        >
          <ThumbsUp className="h-4 w-4 shrink-0" />
          <span>NGON</span>
          <span className="font-mono text-base">{ngon.toLocaleString("vi-VN")}</span>
        </button>

        {/* PHE button */}
        <button
          id={`btn-phe-card-${cardId}`}
          type="button"
          disabled={isVoting}
          onClick={() => handleVote("PHE")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-black uppercase tracking-wider transition select-none
            ${animating === "PHE" ? "scale-95" : "scale-100"}
            ${
              currentVote === "PHE"
                ? "border-red-400/50 bg-red-400/15 text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.25)]"
                : "border-white/10 bg-white/[0.03] text-white/60 hover:border-red-400/30 hover:text-red-400/90"
            }
            disabled:cursor-not-allowed disabled:opacity-60`}
          style={{ transition: "all 0.15s ease" }}
          title={mounted && !isAuthenticated ? "Đăng nhập để bình chọn" : undefined}
        >
          <ThumbsDown className="h-4 w-4 shrink-0" />
          <span>PHẾ</span>
          <span className="font-mono text-base">{phe.toLocaleString("vi-VN")}</span>
        </button>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mt-3 overflow-hidden rounded-full bg-white/5" style={{ height: 6 }}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00FF85] to-[#00E5FF] transition-all duration-500"
            style={{ width: `${ngonPct}%` }}
          />
        </div>
      )}

      {/* Percentage labels */}
      {total > 0 ? (
        <div className="mt-1.5 flex justify-between text-[10px] font-bold text-white/30">
          <span className="text-[#00FF85]/60">{ngonPct}% Ngon</span>
          <span className="text-red-400/60">{phePct}% Phế</span>
        </div>
      ) : (
        <p className="mt-2 text-[10px] text-white/25 text-center">
          Chưa có bình chọn nào. Hãy là người đầu tiên!
        </p>
      )}

      {/* Login prompt for guests — chỉ hiển thị sau khi client mount để tránh hydration mismatch */}
      {mounted && !isAuthenticated && (
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] py-2 text-[11px] text-white/35">
          <LogIn className="h-3 w-3" />
          <Link
            href="/auth/login"
            className="text-[#00FF85]/60 hover:text-[#00FF85] transition font-semibold"
          >
            Đăng nhập
          </Link>
          <span>để tham gia bình chọn</span>
        </div>
      )}
    </div>
  );
}
