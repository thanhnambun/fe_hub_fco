"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

// Services
import { adminNationService, NationItem } from "@/services/admin-metadata-service";

// Components
import NationsTab from "./components/nations-tab";
import NationModal from "./components/nation-modal";

const PAGE_SIZE = 10;

export default function AdminNationsPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.roles?.includes("ROLE_ADMIN");

  const [nationPage, setNationPage] = useState(0);
  const [nationSearch, setNationSearch] = useState("");
  const [nationSearchInput, setNationSearchInput] = useState("");

  const [isNationModalOpen, setIsNationModalOpen] = useState(false);
  const [editingNation, setEditingNation] = useState<NationItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Queries
  const {
    data: nationsData,
    isLoading: isNationsLoading,
    refetch: refetchNations,
  } = useQuery({
    queryKey: ["admin", "nations", nationPage, nationSearch],
    queryFn: () => adminNationService.getNations(nationPage, PAGE_SIZE, nationSearch),
  });

  const handleNationSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNationPage(0);
    setNationSearch(nationSearchInput);
  };

  const handleNationSubmit = async (payload: {
    nationName: string;
    nationSlug?: string;
    flagUrl?: string;
  }) => {
    setIsProcessing(true);
    try {
      if (editingNation) {
        await adminNationService.updateNation(editingNation.id, payload);
        toast.success("Cập nhật quốc gia thành công");
      } else {
        await adminNationService.createNation(payload);
        toast.success("Thêm quốc gia thành công");
      }
      setIsNationModalOpen(false);
      refetchNations();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Thao tác thất bại"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteNation = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa quốc tịch này?")) return;
    setIsProcessing(true);
    try {
      await adminNationService.deleteNation(id);
      toast.success("Xóa quốc tịch thành công");
      refetchNations();
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
            QUẢN LÝ QUỐC GIA
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Quản lý danh sách quốc gia/quốc tịch và cập nhật link quốc kỳ hiển thị.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-6 backdrop-blur-md shadow-2xl">
          <NationsTab
            nationsData={nationsData}
            isLoading={isNationsLoading}
            isAdmin={!!isAdmin}
            searchVal={nationSearchInput}
            setSearchVal={setNationSearchInput}
            onSearchSubmit={handleNationSearchSubmit}
            onAddClick={() => {
              setEditingNation(null);
              setIsNationModalOpen(true);
            }}
            onEdit={(n) => {
              setEditingNation(n);
              setIsNationModalOpen(true);
            }}
            onDelete={handleDeleteNation}
          />

          {/* PAGINATION CONTROLLER */}
          {nationsData && (
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-white/40 mt-6">
              <div>
                <p>
                  Hiển thị {nationsData.page * PAGE_SIZE + 1} -{" "}
                  {Math.min((nationsData.page + 1) * PAGE_SIZE, nationsData.totalItems)} trên tổng
                  số {nationsData.totalItems} dòng
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setNationPage((n) => Math.max(n - 1, 0))}
                  disabled={nationPage === 0}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setNationPage((n) => n + 1)}
                  disabled={nationPage >= nationsData.totalPages - 1}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <NationModal
        key={editingNation?.id ?? "new-nation"}
        isOpen={isNationModalOpen}
        onClose={() => setIsNationModalOpen(false)}
        editingNation={editingNation}
        onSubmit={handleNationSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
}
