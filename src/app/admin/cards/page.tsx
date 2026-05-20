"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

// Services
import { adminPlayerService } from "@/services/admin-player-service";
import {
  adminCardService,
  PlayerCardItem,
  AdminCardRequestPayload,
} from "@/services/admin-card-service";

// Components
import CardsTab from "./components/cards-tab";
import CardModal from "./components/card-modal";

const PAGE_SIZE = 10;

export default function AdminCardsPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.roles?.includes("ROLE_ADMIN");

  const [cardPage, setCardPage] = useState(0);
  const [cardSearch, setCardSearch] = useState("");
  const [cardSearchInput, setCardSearchInput] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<PlayerCardItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add search state for player selection dropdown
  const [playerSelectSearch, setPlayerSelectSearch] = useState("");

  // Queries
  const { data: optionsData } = useQuery({
    queryKey: ["admin", "players", "options"],
    queryFn: () => adminPlayerService.getOptions(),
  });

  const { data: selectPlayersData, isLoading: isSelectPlayersLoading } = useQuery({
    queryKey: ["admin", "players", "select-search", playerSelectSearch],
    queryFn: () => adminPlayerService.getPlayers(0, 50, playerSelectSearch),
    enabled: isCardModalOpen,
  });

  const {
    data: cardsData,
    isLoading: isCardsLoading,
    refetch: refetchCards,
  } = useQuery({
    queryKey: ["admin", "cards", cardPage, cardSearch, selectedSeason],
    queryFn: () => adminCardService.getCards(cardPage, PAGE_SIZE, cardSearch, selectedSeason),
  });

  const handleCardSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardPage(0);
    setCardSearch(cardSearchInput);
  };

  const handleCardSubmit = async (payload: AdminCardRequestPayload) => {
    setIsProcessing(true);
    try {
      if (editingCard) {
        await adminCardService.updateCard(editingCard.id, payload);
        toast.success("Cập nhật thẻ card thành công");
      } else {
        await adminCardService.createCard(payload);
        toast.success("Thêm thẻ card thành công");
      }
      setIsCardModalOpen(false);
      refetchCards();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Thao tác thất bại"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thẻ card này?")) return;
    setIsProcessing(true);
    try {
      await adminCardService.deleteCard(id);
      toast.success("Xóa thẻ card thành công");
      refetchCards();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Xóa thẻ card thất bại"));
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
            QUẢN LÝ THẺ CARDS CẦU THỦ
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Tạo thẻ card cho các mùa giải, điều chỉnh chỉ số hiển thị và quản lý giá BP.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-6 backdrop-blur-md shadow-2xl">
          <CardsTab
            cardsData={cardsData}
            isLoading={isCardsLoading}
            isAdmin={!!isAdmin}
            searchVal={cardSearchInput}
            setSearchVal={setCardSearchInput}
            onSearchSubmit={handleCardSearchSubmit}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
            seasonsOptions={optionsData?.seasons}
            onAddClick={() => {
              setEditingCard(null);
              setIsCardModalOpen(true);
            }}
            onEdit={(c) => {
              setEditingCard(c);
              setIsCardModalOpen(true);
            }}
            onDelete={handleDeleteCard}
          />

          {/* PAGINATION CONTROLLER */}
          {cardsData && (
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-white/40 mt-6">
              <div>
                <p>
                  Hiển thị {cardsData.page * PAGE_SIZE + 1} -{" "}
                  {Math.min((cardsData.page + 1) * PAGE_SIZE, cardsData.totalItems)} trên tổng số{" "}
                  {cardsData.totalItems} dòng
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCardPage((c) => Math.max(c - 1, 0))}
                  disabled={cardPage === 0}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCardPage((c) => c + 1)}
                  disabled={cardPage >= cardsData.totalPages - 1}
                  className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CardModal
        key={editingCard?.id ?? "new-card"}
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setPlayerSelectSearch("");
        }}
        editingCard={editingCard}
        playersOptions={selectPlayersData?.items}
        optionsData={optionsData}
        onSubmit={handleCardSubmit}
        isProcessing={isProcessing}
        onPlayerSearchChange={setPlayerSelectSearch}
        isPlayersLoading={isSelectPlayersLoading}
      />
    </div>
  );
}
