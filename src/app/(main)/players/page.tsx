"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlayerCard } from "@/components/features/players/player-card";
import { getPlayers } from "@/services/player-service";

const PAGE_SIZE = 10;

function PlayerCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-xl bg-white/10" />
          <div className="flex-1">
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="mt-2 h-3 w-1/3 rounded bg-white/10" />
          </div>
          <div className="h-8 w-10 rounded bg-white/10" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-16 rounded bg-white/10" />
          <div className="h-16 rounded bg-white/10" />
        </div>
        <div className="mt-3 h-14 rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function PlayersPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["players", page],
    queryFn: () => getPlayers({ page, size: PAGE_SIZE }),
  });

  const players = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalItems = data?.totalItems ?? 0;

  const canPrev = page > 0;
  const canNext = totalPages > 0 && page < totalPages - 1;

  return (
    <main className="min-h-screen bg-[#0A0E1A] px-4 py-8 text-white md:px-8">
      <div className="mx-auto w-full max-w-[1800px]">
        <header className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <h1 className="fco-heading text-3xl font-bold md:text-4xl">Danh sách cầu thủ</h1>
          <p className="mt-2 text-sm text-white/70">
            Theo dõi chỉ số OVR, lương và thông tin card mới nhất từ FCO HUB.
          </p>
          <p className="mt-3 text-xs text-white/60">
            Tổng bản ghi: <span className="font-semibold text-[#00FF85]">{totalItems}</span>
          </p>
        </header>

        {isError && (
          <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-200">
            Không thể tải danh sách cầu thủ. Vui lòng thử lại.
          </div>
        )}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: PAGE_SIZE }).map((_, index) => <PlayerCardSkeleton key={`sk-${index}`} />)
            : players.map((player) => <PlayerCard key={player.id} player={player} />)}
        </section>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={!canPrev || isLoading}
            className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:border-[#00FF85] hover:text-[#00FF85] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </button>

          <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm">
            Trang <span className="font-semibold text-[#FFD700]">{page + 1}</span> /{" "}
            <span className="font-semibold">{Math.max(totalPages, 1)}</span>
          </div>

          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!canNext || isLoading}
            className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:border-[#00FF85] hover:text-[#00FF85] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
