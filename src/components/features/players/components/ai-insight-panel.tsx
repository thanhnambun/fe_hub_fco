"use client";

import type { AiSummaryResponse } from "@/types/review";
import { Sparkles } from "lucide-react";

interface AiInsightPanelProps {
  summary: AiSummaryResponse | null;
}

export function AiInsightPanel({ summary }: AiInsightPanelProps) {
  if (!summary || (!summary.summary && summary.positiveTags.length === 0)) {
    return null;
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#00FF85]/20 bg-gradient-to-br from-[#00FF85]/5 via-[#00E5FF]/5 to-transparent p-5 shadow-[0_0_30px_rgba(0,255,133,0.07)]">
      {/* Glow accent */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00FF85]/10 blur-3xl" />

      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00FF85]/20 to-[#00E5FF]/20 border border-[#00FF85]/30">
          <Sparkles className="h-4 w-4 text-[#00FF85]" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#00FF85]">
            AI Community Insight
          </span>
          <p className="text-[10px] text-white/40">
            Tổng hợp từ đánh giá cộng đồng • Cập nhật định kỳ
          </p>
        </div>
      </div>

      {/* Summary text */}
      {summary.summary && (
        <p className="mb-4 text-sm leading-relaxed text-white/75 italic border-l-2 border-[#00FF85]/30 pl-3">
          &ldquo;{summary.summary}&rdquo;
        </p>
      )}

      {/* Tags grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Positive tags */}
        {summary.positiveTags.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#00FF85]/70">
              ✦ Ưu điểm
            </p>
            <div className="flex flex-wrap gap-1.5">
              {summary.positiveTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#00FF85]/25 bg-[#00FF85]/10 px-2.5 py-1 text-[11px] font-bold text-[#00FF85]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Negative tags */}
        {summary.negativeTags.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-400/70">
              ✦ Nhược điểm
            </p>
            <div className="flex flex-wrap gap-1.5">
              {summary.negativeTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-red-400/25 bg-red-400/10 px-2.5 py-1 text-[11px] font-bold text-red-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
