"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

// Services
import {
  adminPlayerService,
  FcoPlayerItem,
  AdminPlayerRequestPayload,
} from "@/services/admin-player-service";

// Components
import PlayersTab from "./components/players-tab";
import PlayerModal from "./components/player-modal";

const PAGE_SIZE = 10;

export default function AdminPlayersPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.roles?.includes("ROLE_ADMIN");

  // Pagination & Search States
  const [playerPage, setPlayerPage] = useState(0);
  const [playerSearch, setPlayerSearch] = useState("");
  const [playerSearchInput, setPlayerSearchInput] = useState("");

  // Modals & Editing States
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<FcoPlayerItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Queries
  const { data: optionsData } = useQuery({
    queryKey: ["admin", "players", "options"],
    queryFn: () => adminPlayerService.getOptions(),
  });

  const {
    data: playersData,
    isLoading: isPlayersLoading,
    refetch: refetchPlayers,
  } = useQuery({
    queryKey: ["admin", "players", playerPage, playerSearch],
    queryFn: () => adminPlayerService.getPlayers(playerPage, PAGE_SIZE, playerSearch),
  });

  // Search Handlers
  const handlePlayerSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlayerPage(0);
    setPlayerSearch(playerSearchInput);
  };

  // Submit Operations
  const handlePlayerSubmit = async (payload: AdminPlayerRequestPayload) => {
    setIsProcessing(true);
    try {
      if (editingPlayer) {
        await adminPlayerService.updatePlayer(editingPlayer.id, payload);
        toast.success("Cập nhật cầu thủ thành công");
      } else {
        await adminPlayerService.createPlayer(payload);
        toast.success("Thêm mới cầu thủ thành công");
      }
      setIsPlayerModalOpen(false);
      refetchPlayers();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Thao tác thất bại"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete Handlers
  const handleDeletePlayer = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa cầu thủ này? Tất cả thẻ liên kết sẽ bị xóa sạch!"))
      return;
    setIsProcessing(true);
    try {
      await adminPlayerService.deletePlayer(id);
      toast.success("Xóa cầu thủ thành công");
      refetchPlayers();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Xóa cầu thủ thất bại"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 font-sans">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-[var(--font-oswald)] text-4xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
            <Users className="h-9 w-9 text-[#D4AF37] animate-pulse" />
            QUẢN LÝ CẦU THỦ GỐC
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Quản lý thông tin cầu thủ gốc, chiều cao, cân nặng, quốc tịch, câu lạc bộ và giải đấu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-6 backdrop-blur-md shadow-2xl">
          <PlayersTab
            playersData={playersData}
            isLoading={isPlayersLoading}
            isAdmin={!!isAdmin}
            searchVal={playerSearchInput}
            setSearchVal={setPlayerSearchInput}
            onSearchSubmit={handlePlayerSearchSubmit}
            onAddClick={() => {
              setEditingPlayer(null);
              setIsPlayerModalOpen(true);
            }}
            onEdit={(p) => {
              setEditingPlayer(p);
              setIsPlayerModalOpen(true);
            }}
            onDelete={handleDeletePlayer}
          />

          {/* PAGINATION CONTROLLER */}
          {playersData && (
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-white/40 mt-6">
              <div>
                <p>
                  Hiển thị {playersData.page * PAGE_SIZE + 1} -{" "}
                  {Math.min((playersData.page + 1) * PAGE_SIZE, playersData.totalItems)} trên tổng
                  số {playersData.totalItems} dòng
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPlayerPage((p) => Math.max(p - 1, 0))}
                  disabled={playerPage === 0}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPlayerPage((p) => p + 1)}
                  disabled={playerPage >= playersData.totalPages - 1}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PlayerModal
        key={editingPlayer?.id ?? "new-player"}
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        editingPlayer={editingPlayer}
        optionsData={optionsData}
        onSubmit={handlePlayerSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
}
