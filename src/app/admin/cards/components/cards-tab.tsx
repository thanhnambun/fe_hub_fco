"use client";

import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PlayerCardItem, PageResponse } from "@/services/admin-card-service";

interface CardsTabProps {
  cardsData: PageResponse<PlayerCardItem> | undefined;
  isLoading: boolean;
  isAdmin: boolean;
  searchVal: string;
  setSearchVal: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  selectedSeason: string;
  setSelectedSeason: (season: string) => void;
  seasonsOptions: Array<{ id: number; seasonCode: string; seasonName: string }> | undefined;
  onAddClick: () => void;
  onEdit: (card: PlayerCardItem) => void;
  onDelete: (id: number) => void;
}

export default function CardsTab({
  cardsData,
  isLoading,
  isAdmin,
  searchVal,
  setSearchVal,
  onSearchSubmit,
  selectedSeason,
  setSelectedSeason,
  seasonsOptions,
  onAddClick,
  onEdit,
  onDelete,
}: CardsTabProps) {
  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center max-w-2xl">
          <form onSubmit={onSearchSubmit} className="relative flex-1">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Tìm theo tên cầu thủ..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-[#D4AF37] focus:bg-white/[0.07]"
            />
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-white/40" />
          </form>

          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37] min-w-[160px]"
          >
            <option value="">Tất cả mùa giải</option>
            {seasonsOptions?.map((s) => (
              <option key={s.id} value={s.seasonCode}>
                {s.seasonCode} - {s.seasonName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black hover:brightness-110"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          TẠO THẺ CARD
        </button>
      </div>

      {/* Cards Table */}
      {isLoading ? (
        <div className="flex py-12 justify-center">
          <p className="text-white/40 text-sm">Đang tải danh sách thẻ card...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0B0F19]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold text-white/60">Ảnh</th>
                <th className="px-6 py-4 font-semibold text-white/60">Tên / Mùa</th>
                <th className="px-6 py-4 font-semibold text-white/60">OVR / Lương</th>
                <th className="px-6 py-4 font-semibold text-white/60">Vị trí</th>
                <th className="px-6 py-4 font-semibold text-white/60">Giá thị trường (BP)</th>
                <th className="px-6 py-4 font-semibold text-white/60 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {cardsData?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    Không tìm thấy thẻ card nào.
                  </td>
                </tr>
              ) : (
                cardsData?.items.map((c: PlayerCardItem) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      {/* eslint-disable-next-line @next/next/no-img-element -- onError fallback requires native img; next/image does not expose this handler for dynamic URLs */}
                      <img
                        src={c.imageUrl || "/images/player-placeholder.png"}
                        alt={c.player?.playerName}
                        className="h-12 w-12 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/player-placeholder.png";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{c.player?.playerName}</p>
                        <p className="text-xs text-[#D4AF37] font-mono font-bold">
                          {c.season?.seasonCode}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">OVR {c.ovr}</p>
                        <p className="text-xs text-white/40">Lương: {c.salary}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="inline-block rounded bg-[#D4AF37]/20 px-1.5 py-0.5 text-xs font-bold text-[#D4AF37]">
                          {c.preferredPosition}
                        </span>
                        {c.secondaryPosition && (
                          <span className="ml-1.5 inline-block rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/60">
                            {c.secondaryPosition}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#D4AF37] font-semibold">
                      {c.marketPriceBp?.toLocaleString() || "0"} BP
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(c)}
                          className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => onDelete(c.id)}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
