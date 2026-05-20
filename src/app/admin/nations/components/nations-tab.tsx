"use client";

import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { NationItem, PageResponse } from "@/services/admin-metadata-service";

interface NationsTabProps {
  nationsData: PageResponse<NationItem> | undefined;
  isLoading: boolean;
  isAdmin: boolean;
  searchVal: string;
  setSearchVal: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onAddClick: () => void;
  onEdit: (nation: NationItem) => void;
  onDelete: (id: number) => void;
}

export default function NationsTab({
  nationsData,
  isLoading,
  isAdmin,
  searchVal,
  setSearchVal,
  onSearchSubmit,
  onAddClick,
  onEdit,
  onDelete,
}: NationsTabProps) {
  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={onSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Tìm theo tên quốc gia..."
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
            THÊM QUỐC GIA
          </button>
        )}
      </div>

      {/* Nations Table */}
      {isLoading ? (
        <div className="flex py-12 justify-center">
          <p className="text-white/40 text-sm">Đang tải danh sách quốc gia...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0B0F19]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold text-white/60">Ảnh</th>
                <th className="px-6 py-4 font-semibold text-white/60">Tên Quốc Gia</th>
                <th className="px-6 py-4 font-semibold text-white/60">Slug</th>
                <th className="px-6 py-4 font-semibold text-white/60 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {nationsData?.items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-white/40">
                    Không tìm thấy quốc gia nào.
                  </td>
                </tr>
              ) : (
                nationsData?.items.map((n: NationItem) => (
                  <tr key={n.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      {n.flagUrl ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element -- onError fallback requires native img */}
                          <img
                            src={n.flagUrl}
                            alt={n.nationName}
                            className="h-6 w-9 object-cover rounded border border-white/10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/flag-placeholder.png";
                            }}
                          />
                        </>
                      ) : (
                        <span className="text-xs text-white/20">Không có flag</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">{n.nationName}</td>
                    <td className="px-6 py-4 font-mono text-white/60">{n.nationSlug || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => onEdit(n)}
                              className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDelete(n.id)}
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
