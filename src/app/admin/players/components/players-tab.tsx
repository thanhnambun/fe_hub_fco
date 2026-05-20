"use client";

import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { FcoPlayerItem, PageResponse } from "@/services/admin-player-service";

interface PlayersTabProps {
  playersData: PageResponse<FcoPlayerItem> | undefined;
  isLoading: boolean;
  isAdmin: boolean;
  searchVal: string;
  setSearchVal: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onAddClick: () => void;
  onEdit: (player: FcoPlayerItem) => void;
  onDelete: (id: number) => void;
}

export default function PlayersTab({
  playersData,
  isLoading,
  isAdmin,
  searchVal,
  setSearchVal,
  onSearchSubmit,
  onAddClick,
  onEdit,
  onDelete,
}: PlayersTabProps) {
  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={onSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Tìm theo tên cầu thủ hoặc External ID..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-[#D4AF37] focus:bg-white/[0.07]"
          />
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-white/40" />
        </form>

        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black hover:brightness-110"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          THÊM CẦU THỦ GỐC
        </button>
      </div>

      {/* Players Table */}
      {isLoading ? (
        <div className="flex py-12 justify-center">
          <p className="text-white/40 text-sm">Đang tải danh sách cầu thủ...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0B0F19]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold text-white/60">ID</th>
                <th className="px-6 py-4 font-semibold text-white/60">Tên Cầu Thủ</th>
                <th className="px-6 py-4 font-semibold text-white/60">Nhận Diện (ID Ngoài)</th>
                <th className="px-6 py-4 font-semibold text-white/60">Thể Hình</th>
                <th className="px-6 py-4 font-semibold text-white/60">Quốc Tịch</th>
                <th className="px-6 py-4 font-semibold text-white/60">CLB / Giải</th>
                <th className="px-6 py-4 font-semibold text-white/60 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {playersData?.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                    Không tìm thấy cầu thủ nào.
                  </td>
                </tr>
              ) : (
                playersData?.items.map((p: FcoPlayerItem) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 text-white/60 font-mono">{p.id}</td>
                    <td className="px-6 py-4 font-semibold text-white">{p.playerName}</td>
                    <td className="px-6 py-4 font-mono text-white/60">{p.externalId || "-"}</td>
                    <td className="px-6 py-4 text-white/60">
                      {p.height}cm / {p.weight}kg
                    </td>
                    <td className="px-6 py-4 text-white/80">{p.nationName || "-"}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white/80 font-medium">{p.clubName || "-"}</p>
                        <p className="text-[10px] text-white/40">{p.leagueName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(p)}
                          className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => onDelete(p.id)}
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
