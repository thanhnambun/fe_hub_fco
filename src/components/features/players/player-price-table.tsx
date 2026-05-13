"use client";

import type { PlayerDetailResponse } from "@/types/player-api";

interface PlayerPriceTableProps {
  prices: PlayerDetailResponse["prices"];
}

const priceFormatter = new Intl.NumberFormat("vi-VN");

function tierClass(level: number) {
  if (level >= 8) return "bg-[#FFD700] text-black font-bold shadow-[0_0_12px_rgba(255,215,0,0.5)]";
  if (level >= 5) return "bg-slate-300 text-black font-semibold";
  return "bg-zinc-700 text-white font-medium";
}

export function PlayerPriceTable({ prices }: PlayerPriceTableProps) {
  if (!prices || prices.length === 0) return null;

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="p-6 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/70">
          Bảng giá thị trường (13 cấp thẻ)
        </h3>
      </div>
      
      <div className="relative max-h-[350px] w-full overflow-y-auto custom-scrollbar">
        <table className="w-full text-left text-sm text-white/80">
          <thead className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur-md">
            <tr>
              <th className="px-6 py-3 font-semibold uppercase text-white/50">Cấp</th>
              <th className="px-6 py-3 font-semibold uppercase text-white/50">Giá BP</th>
              <th className="px-6 py-3 text-right font-semibold uppercase text-white/50">Ngày cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {prices
              .filter((p, index, self) => index === self.findIndex((t) => t.grade === p.grade))
              .map((price) => (
              <tr key={price.grade} className="transition-colors hover:bg-white/5">
                <td className="px-6 py-3">
                  <span className={`inline-flex h-6 w-8 items-center justify-center rounded text-xs ${tierClass(price.grade)}`}>
                    +{price.grade}
                  </span>
                </td>
                <td className="px-6 py-3 font-mono font-medium text-[#00FF85]">
                  {price.priceBp > 0 ? priceFormatter.format(price.priceBp) : "—"}
                </td>
                <td className="px-6 py-3 text-right text-xs text-white/40">
                  {price.priceDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
