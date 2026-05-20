"use client";

import { useState } from "react";
import SearchableSelect from "@/app/admin/components/searchable-select";
import { FcoPlayerItem, AdminPlayerRequestPayload } from "@/services/admin-player-service";

const DEFAULT_HEIGHT = 180;
const DEFAULT_WEIGHT = 75;

interface NationOption {
  id: number;
  nationName: string;
  flagUrl: string | null;
}

interface ClubOption {
  id: number;
  clubName: string;
  crestUrl: string | null;
}

interface LeagueOption {
  id: number;
  leagueName: string;
  logoUrl: string | null;
}

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlayer: FcoPlayerItem | null;
  optionsData:
    | {
        nations: NationOption[];
        clubs: ClubOption[];
        leagues: LeagueOption[];
      }
    | undefined;
  onSubmit: (payload: AdminPlayerRequestPayload) => Promise<void>;
  isProcessing: boolean;
}

export default function PlayerModal({
  isOpen,
  onClose,
  editingPlayer,
  optionsData,
  onSubmit,
  isProcessing,
}: PlayerModalProps) {
  // Initialize state directly from prop — parent must pass key={editingPlayer?.id ?? 'new'} to remount
  const [playerName, setPlayerName] = useState(editingPlayer?.playerName ?? "");
  const [externalId, setExternalId] = useState(editingPlayer?.externalId ?? "");
  const [height, setHeight] = useState<number>(editingPlayer?.height ?? DEFAULT_HEIGHT);
  const [weight, setWeight] = useState<number>(editingPlayer?.weight ?? DEFAULT_WEIGHT);
  const [birthdate, setBirthdate] = useState(editingPlayer?.birthdate ?? "");
  const [preferredFoot, setPreferredFoot] = useState(editingPlayer?.preferredFoot ?? "Phải");
  const [weakFoot, setWeakFoot] = useState<number>(editingPlayer?.weakFoot ?? 5);
  const [nationId, setNationId] = useState<number | null>(editingPlayer?.nation?.id ?? null);
  const [clubId, setClubId] = useState<number | null>(editingPlayer?.club?.id ?? null);
  const [leagueId, setLeagueId] = useState<number | null>(editingPlayer?.league?.id ?? null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      playerName: playerName.trim(),
      externalId: externalId.trim() || undefined,
      height,
      weight,
      birthdate: birthdate.trim() || undefined,
      preferredFoot,
      weakFoot,
      nationId: nationId || undefined,
      clubId: clubId || undefined,
      leagueId: leagueId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0B0F19] p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="font-[var(--font-oswald)] text-2xl font-bold text-white mb-6">
          {editingPlayer ? "CẬP NHẬT CẦU THỦ GỐC" : "THÊM MỚI CẦU THỦ GỐC"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Tên cầu thủ
              </label>
              <input
                type="text"
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
                placeholder="Nhập tên..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                External ID (Nhận diện)
              </label>
              <input
                type="text"
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
                placeholder="Ví dụ: p1010372"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Chiều cao (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value, 10) || DEFAULT_HEIGHT)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Cân nặng (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value, 10) || DEFAULT_WEIGHT)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Ngày sinh
              </label>
              <input
                type="text"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Chân thuận
              </label>
              <select
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              >
                <option value="Phải">Phải</option>
                <option value="Trái">Trái</option>
                <option value="Hai chân">Hai chân</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Chỉ số chân yếu
              </label>
              <select
                value={weakFoot}
                onChange={(e) => setWeakFoot(parseInt(e.target.value, 10))}
                className="rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              >
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>
                    {v}/5
                  </option>
                ))}
              </select>
            </div>
            <SearchableSelect
              label="Quốc tịch"
              items={optionsData?.nations || []}
              value={nationId}
              onChange={(val) => setNationId(val as number | null)}
              getLabel={(n) => n.nationName}
              getValue={(n) => n.id}
              placeholder="Chọn..."
            />
            <SearchableSelect
              label="Câu lạc bộ"
              items={optionsData?.clubs || []}
              value={clubId}
              onChange={(val) => setClubId(val as number | null)}
              getLabel={(c) => c.clubName}
              getValue={(c) => c.id}
              placeholder="Chọn..."
            />
            <SearchableSelect
              label="Giải đấu"
              items={optionsData?.leagues || []}
              value={leagueId}
              onChange={(val) => setLeagueId(val as number | null)}
              getLabel={(l) => l.leagueName}
              getValue={(l) => l.id}
              placeholder="Chọn..."
            />
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-4">
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
              {editingPlayer ? "Lưu" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
