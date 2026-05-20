"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

// Services
import { adminSeasonService, SeasonItem } from "@/services/admin-metadata-service";

// Components
import SeasonsTab from "./components/seasons-tab";
import SeasonModal from "./components/season-modal";

const PAGE_SIZE = 10;

export default function AdminSeasonsPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.roles?.includes("ROLE_ADMIN");

  const [seasonPage, setSeasonPage] = useState(0);
  const [seasonSearch, setSeasonSearch] = useState("");
  const [seasonSearchInput, setSeasonSearchInput] = useState("");

  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<SeasonItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Queries
  const {
    data: seasonsData,
    isLoading: isSeasonsLoading,
    refetch: refetchSeasons,
  } = useQuery({
    queryKey: ["admin", "seasons", seasonPage, seasonSearch],
    queryFn: () => adminSeasonService.getSeasons(seasonPage, PAGE_SIZE, seasonSearch),
  });

  const handleSeasonSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSeasonPage(0);
    setSeasonSearch(seasonSearchInput);
  };

  const handleSeasonSubmit = async (payload: {
    seasonCode: string;
    seasonName: string;
    isCoreSeason: boolean;
    isActiveSeason: boolean;
  }) => {
    setIsProcessing(true);
    const body = {
      seasonCode: payload.seasonCode,
      seasonName: payload.seasonName,
      isCore: payload.isCoreSeason,
      isActive: payload.isActiveSeason,
    };
    try {
      if (editingSeason) {
        await adminSeasonService.updateSeason(editingSeason.id, body);
        toast.success("Cập nhật mùa giải thành công");
      } else {
        await adminSeasonService.createSeason(body);
        toast.success("Thêm mùa giải thành công");
      }
      setIsSeasonModalOpen(false);
      refetchSeasons();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Thao tác thất bại"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSeason = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mùa giải này?")) return;
    setIsProcessing(true);
    try {
      await adminSeasonService.deleteSeason(id);
      toast.success("Xóa mùa giải thành công");
      refetchSeasons();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Không thể xóa (Đang có thẻ liên kết)"));
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
            QUẢN LÝ MÙA GIẢI
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Cấu hình mã mùa giải, kích hoạt/vô hiệu hóa các mùa giải trong hệ thống.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-6 backdrop-blur-md shadow-2xl">
          <SeasonsTab
            seasonsData={seasonsData}
            isLoading={isSeasonsLoading}
            isAdmin={!!isAdmin}
            searchVal={seasonSearchInput}
            setSearchVal={setSeasonSearchInput}
            onSearchSubmit={handleSeasonSearchSubmit}
            onAddClick={() => {
              setEditingSeason(null);
              setIsSeasonModalOpen(true);
            }}
            onEdit={(s) => {
              setEditingSeason(s);
              setIsSeasonModalOpen(true);
            }}
            onDelete={handleDeleteSeason}
          />

          {/* PAGINATION CONTROLLER */}
          {seasonsData && (
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-white/40 mt-6">
              <div>
                <p>
                  Hiển thị {seasonsData.page * PAGE_SIZE + 1} -{" "}
                  {Math.min((seasonsData.page + 1) * PAGE_SIZE, seasonsData.totalItems)} trên tổng
                  số {seasonsData.totalItems} dòng
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSeasonPage((s) => Math.max(s - 1, 0))}
                  disabled={seasonPage === 0}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSeasonPage((s) => s + 1)}
                  disabled={seasonPage >= seasonsData.totalPages - 1}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SeasonModal
        key={editingSeason?.id ?? "new-season"}
        isOpen={isSeasonModalOpen}
        onClose={() => setIsSeasonModalOpen(false)}
        editingSeason={editingSeason}
        onSubmit={handleSeasonSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
}
