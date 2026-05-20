"use client";

import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { SeasonItem, PageResponse } from "@/services/admin-metadata-service";

interface SeasonsTabProps {
  seasonsData: PageResponse<SeasonItem> | undefined;
  isLoading: boolean;
  isAdmin: boolean;
  searchVal: string;
  setSearchVal: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onAddClick: () => void;
  onEdit: (season: SeasonItem) => void;
  onDelete: (id: number) => void;
}

export default function SeasonsTab({
  seasonsData,
  isLoading,
  isAdmin,
  searchVal,
  setSearchVal,
  onSearchSubmit,
  onAddClick,
  onEdit,
  onDelete,
}: SeasonsTabProps) {
  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={onSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Tìm theo mã hoặc tên mùa giải..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-[#D4AF37] focus:bg-white/[0.07]"
          />
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-white/40" />
        </form>

        {isAdmin && (
          <button
            onClick={onAddClick}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black hover:brightness-110"
          >
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
            THÊM MÙA GIẢI
          </button>
        )}
      </div>

      {/* Seasons Table */}
      {isLoading ? (
        <div className="flex py-12 justify-center">
          <p className="text-white/40 text-sm">Đang tải danh sách mùa giải...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0B0F19]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold text-white/60">Mã Mùa</th>
                <th className="px-6 py-4 font-semibold text-white/60">Tên Mùa Giải</th>
                <th className="px-6 py-4 font-semibold text-white/60">Loại mùa</th>
                <th className="px-6 py-4 font-semibold text-white/60">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-white/60 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {seasonsData?.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    Không tìm thấy mùa giải nào.
                  </td>
                </tr>
              ) : (
                seasonsData?.items.map((s: SeasonItem) => (
                  <tr key={s.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-mono font-bold text-[#D4AF37]">{s.seasonCode}</td>
                    <td className="px-6 py-4 font-semibold text-white">{s.seasonName}</td>
                    <td className="px-6 py-4">
                      {s.isCore ? (
                        <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                          Core Season
                        </span>
                      ) : (
                        <span className="rounded bg-white/5 px-2 py-1 text-xs text-white/40">
                          Thường
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {s.isActive ? (
                        <span className="rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
                          Active
                        </span>
                      ) : (
                        <span className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-400">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => onEdit(s)}
                              className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDelete(s.id)}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-white/20 text-xs italic">Chỉ đọc</span>
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
