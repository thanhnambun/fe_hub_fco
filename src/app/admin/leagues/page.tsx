"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

// Services
import { adminLeagueService, LeagueItem } from "@/services/admin-metadata-service";

// Components
import LeaguesTab from "./components/leagues-tab";
import LeagueModal from "./components/league-modal";

const PAGE_SIZE = 10;

export default function AdminLeaguesPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.roles?.includes("ROLE_ADMIN");

  const [leaguePage, setLeaguePage] = useState(0);
  const [leagueSearch, setLeagueSearch] = useState("");
  const [leagueSearchInput, setLeagueSearchInput] = useState("");

  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<LeagueItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Queries
  const {
    data: leaguesData,
    isLoading: isLeaguesLoading,
    refetch: refetchLeagues,
  } = useQuery({
    queryKey: ["admin", "leagues", leaguePage, leagueSearch],
    queryFn: () => adminLeagueService.getLeagues(leaguePage, PAGE_SIZE, leagueSearch),
  });

  const handleLeagueSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaguePage(0);
    setLeagueSearch(leagueSearchInput);
  };

  const handleLeagueSubmit = async (payload: {
    leagueName: string;
    leagueSlug?: string;
    logoUrl?: string;
  }) => {
    setIsProcessing(true);
    try {
      if (editingLeague) {
        await adminLeagueService.updateLeague(editingLeague.id, payload);
        toast.success("Cập nhật giải đấu thành công");
      } else {
        await adminLeagueService.createLeague(payload);
        toast.success("Thêm giải đấu thành công");
      }
      setIsLeagueModalOpen(false);
      refetchLeagues();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Thao tác thất bại"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteLeague = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa giải đấu này?")) return;
    setIsProcessing(true);
    try {
      await adminLeagueService.deleteLeague(id);
      toast.success("Xóa giải đấu thành công");
      refetchLeagues();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Không thể xóa (Đang có cầu thủ liên kết)"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 font-sans">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-[var(--font-oswald)] text-4xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
            <Activity className="h-9 w-9 text-[#D4AF37] animate-pulse" />
            QUẢN LÝ GIẢI ĐẤU
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Quản lý danh sách giải đấu và cập nhật hình ảnh logo của từng giải.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-6 backdrop-blur-md shadow-2xl">
          <LeaguesTab
            leaguesData={leaguesData}
            isLoading={isLeaguesLoading}
            isAdmin={!!isAdmin}
            searchVal={leagueSearchInput}
            setSearchVal={setLeagueSearchInput}
            onSearchSubmit={handleLeagueSearchSubmit}
            onAddClick={() => {
              setEditingLeague(null);
              setIsLeagueModalOpen(true);
            }}
            onEdit={(l) => {
              setEditingLeague(l);
              setIsLeagueModalOpen(true);
            }}
            onDelete={handleDeleteLeague}
          />

          {/* PAGINATION CONTROLLER */}
          {leaguesData && (
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-white/40 mt-6">
              <div>
                <p>
                  Hiển thị {leaguesData.page * PAGE_SIZE + 1} -{" "}
                  {Math.min((leaguesData.page + 1) * PAGE_SIZE, leaguesData.totalItems)} trên tổng
                  số {leaguesData.totalItems} dòng
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setLeaguePage((l) => Math.max(l - 1, 0))}
                  disabled={leaguePage === 0}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLeaguePage((l) => l + 1)}
                  disabled={leaguePage >= leaguesData.totalPages - 1}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LeagueModal
        key={editingLeague?.id ?? "new-league"}
        isOpen={isLeagueModalOpen}
        onClose={() => setIsLeagueModalOpen(false)}
        editingLeague={editingLeague}
        onSubmit={handleLeagueSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
}
