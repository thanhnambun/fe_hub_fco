"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { toast } from "sonner";
import SearchableSelect from "@/app/admin/components/searchable-select";
import { PlayerCardItem, AdminCardRequestPayload } from "@/services/admin-card-service";

const POSITIONS = [
  "ST",
  "CF",
  "LW",
  "RW",
  "CAM",
  "CM",
  "LM",
  "RM",
  "CDM",
  "CB",
  "LB",
  "RB",
  "LWB",
  "RWB",
  "GK",
];

interface PlayerOption {
  id: number;
  playerName: string;
}

interface SeasonOption {
  id: number;
  seasonCode: string;
  seasonName: string;
}

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCard: PlayerCardItem | null;
  playersOptions: PlayerOption[] | undefined;
  optionsData:
    | {
        seasons: SeasonOption[];
      }
    | undefined;
  onSubmit: (payload: AdminCardRequestPayload) => Promise<void>;
  isProcessing: boolean;
  onPlayerSearchChange?: (search: string) => void;
  isPlayersLoading?: boolean;
}

export default function CardModal({
  isOpen,
  onClose,
  editingCard,
  playersOptions,
  optionsData,
  onSubmit,
  isProcessing,
  onPlayerSearchChange,
  isPlayersLoading = false,
}: CardModalProps) {
  // Initialize state directly from prop — no useEffect needed
  // Parent must pass key={editingCard?.id ?? 'new'} to remount when switching items
  const [cardPlayerId, setCardPlayerId] = useState<number | null>(editingCard?.player?.id ?? null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerOption | null>(
    editingCard?.player
      ? { id: editingCard.player.id, playerName: editingCard.player.playerName }
      : null,
  );
  const [cardSeasonId, setCardSeasonId] = useState<number | null>(editingCard?.season?.id ?? null);
  const [cardOvr, setCardOvr] = useState<number>(editingCard?.ovr ?? 100);
  const [cardSalary, setCardSalary] = useState<number>(editingCard?.salary ?? 15);
  const [cardPrefPos, setCardPrefPos] = useState(editingCard?.preferredPosition ?? "ST");
  const [cardSecPos, setCardSecPos] = useState(editingCard?.secondaryPosition ?? "");
  const [cardPrice, setCardPrice] = useState<number>(editingCard?.marketPriceBp ?? 0);
  const [cardImage, setCardImage] = useState(editingCard?.imageUrl ?? "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard && !cardPlayerId) {
      toast.error("Vui lòng chọn cầu thủ");
      return;
    }
    if (!editingCard && !cardSeasonId) {
      toast.error("Vui lòng chọn mùa giải");
      return;
    }

    if (cardSecPos.trim()) {
      const parts = cardSecPos.split(",").map((p) => p.trim().toUpperCase());
      const invalid = parts.filter((p) => p && !POSITIONS.includes(p));
      if (invalid.length > 0) {
        toast.error(
          `Vị trí phụ không hợp lệ: "${invalid.join(
            ", ",
          )}". Các vị trí hợp lệ gồm: ST, CF, LW, RW, CAM, CM, LM, RM, CDM, CB, LB, RB, LWB, RWB, GK`,
        );
        return;
      }
      if (cardSecPos.length > 100) {
        toast.error("Vị trí phụ không được vượt quá 100 ký tự");
        return;
      }
    }

    onSubmit({
      playerId: editingCard ? editingCard.player.id : (cardPlayerId as number),
      seasonId: editingCard ? editingCard.season.id : (cardSeasonId as number),
      ovr: cardOvr,
      salary: cardSalary,
      preferredPosition: cardPrefPos,
      secondaryPosition: cardSecPos.trim() || undefined,
      marketPriceBp: cardPrice,
      imageUrl: cardImage.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0B0F19] p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="font-[var(--font-oswald)] text-2xl font-bold text-white mb-6">
          {editingCard ? "CẬP NHẬT THẺ CARD" : "TẠO THẺ CARD MỚI"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {!editingCard ? (
              <SearchableSelect
                label="Chọn cầu thủ gốc"
                items={
                  selectedPlayer && !playersOptions?.some((p) => p.id === selectedPlayer.id)
                    ? [selectedPlayer, ...(playersOptions || [])]
                    : playersOptions || []
                }
                value={cardPlayerId}
                onChange={(val) => {
                  setCardPlayerId(val as number | null);
                  const found = playersOptions?.find((p) => p.id === val);
                  if (found) {
                    setSelectedPlayer(found);
                  } else if (val === null) {
                    setSelectedPlayer(null);
                  }
                }}
                getLabel={(p) => p.playerName}
                getValue={(p) => p.id}
                placeholder="Chọn..."
                onSearchChange={onPlayerSearchChange}
                isLoading={isPlayersLoading}
              />
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Cầu thủ
                </label>
                <input
                  type="text"
                  disabled
                  value={editingCard.player?.playerName}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/50 cursor-not-allowed"
                />
              </div>
            )}
            {!editingCard ? (
              <SearchableSelect
                label="Mùa giải"
                items={optionsData?.seasons || []}
                value={cardSeasonId}
                onChange={(val) => setCardSeasonId(val as number | null)}
                getLabel={(s) => `${s.seasonCode} - ${s.seasonName}`}
                getValue={(s) => s.id}
                placeholder="Chọn..."
              />
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Mùa giải
                </label>
                <input
                  type="text"
                  disabled
                  value={`${editingCard.season?.seasonCode} - ${editingCard.season?.seasonName}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/50 cursor-not-allowed"
                />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Chỉ số OVR
              </label>
              <input
                type="number"
                required
                min={1}
                max={150}
                value={cardOvr}
                onChange={(e) => setCardOvr(parseInt(e.target.value, 10) || 100)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Lương ingame
              </label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={cardSalary}
                onChange={(e) => setCardSalary(parseInt(e.target.value, 10) || 15)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Vị trí sở trường
              </label>
              <select
                value={cardPrefPos}
                onChange={(e) => setCardPrefPos(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              >
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Vị trí phụ (CF, LW...)
              </label>
              <input
                type="text"
                value={cardSecPos}
                onChange={(e) => setCardSecPos(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
                placeholder="CF, LW"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Giá thị trường BP
              </label>
              <input
                type="number"
                value={cardPrice}
                onChange={(e) => setCardPrice(parseInt(e.target.value, 10) || 0)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Link ảnh thẻ
              </label>
              <input
                type="text"
                value={cardImage}
                onChange={(e) => setCardImage(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/5 bg-white/5 p-3 text-[11px] text-white/60">
            <Info className="h-4 w-4 shrink-0 text-[#D4AF37] mt-0.5" />
            <p>
              Cập nhật thông số core quyết định hiển thị, các chỉ số chi tiết sút/tốc/chuyền sẽ tự
              động điền khi chạy crawl.
            </p>
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
              {editingCard ? "Lưu" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
