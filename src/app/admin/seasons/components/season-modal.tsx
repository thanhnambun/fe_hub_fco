"use client";

import { useState } from "react";
import { SeasonItem } from "@/services/admin-metadata-service";

interface SeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSeason: SeasonItem | null;
  onSubmit: (payload: {
    seasonCode: string;
    seasonName: string;
    isCoreSeason: boolean;
    isActiveSeason: boolean;
  }) => Promise<void>;
  isProcessing: boolean;
}

export default function SeasonModal({
  isOpen,
  onClose,
  editingSeason,
  onSubmit,
  isProcessing,
}: SeasonModalProps) {
  // Initialize state directly from prop — parent must pass key={editingSeason?.id ?? 'new'} to remount
  const [seasonCode, setSeasonCode] = useState(editingSeason?.seasonCode ?? "");
  const [seasonName, setSeasonName] = useState(editingSeason?.seasonName ?? "");
  const [isCoreSeason, setIsCoreSeason] = useState(editingSeason?.isCore ?? true);
  const [isActiveSeason, setIsActiveSeason] = useState(editingSeason?.isActive ?? true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      seasonCode: seasonCode.trim(),
      seasonName: seasonName.trim(),
      isCoreSeason,
      isActiveSeason,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19] p-6 text-white shadow-2xl">
        <h2 className="font-[var(--font-oswald)] text-2xl font-bold text-white mb-6">
          {editingSeason ? "CẬP NHẬT MÙA GIẢI" : "THÊM MÙA GIẢI MỚI"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Mã Mùa (Season Code)
            </label>
            <input
              type="text"
              required
              disabled={!!editingSeason}
              value={seasonCode}
              onChange={(e) => setSeasonCode(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] disabled:opacity-50"
              placeholder="Ví dụ: 24TOTY, LN"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Tên Mùa
            </label>
            <input
              type="text"
              required
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              placeholder="Ví dụ: 2024 Team of the Year"
            />
          </div>
          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={isCoreSeason}
                onChange={(e) => setIsCoreSeason(e.target.checked)}
                className="rounded border-white/10 accent-[#D4AF37]"
              />{" "}
              Core Season
            </label>
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={isActiveSeason}
                onChange={(e) => setIsActiveSeason(e.target.checked)}
                className="rounded border-white/10 accent-[#D4AF37]"
              />{" "}
              Kích hoạt (Active)
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm hover:bg-white/5"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-50"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
