"use client";

import { ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-react";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { PlayerCard } from "@/components/features/players/player-card";
import { getPlayers, getSeasons } from "@/services/player-service";

const PAGE_SIZE = 10;

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

function PlayersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") ?? "0", 10);
  const keyword = searchParams.get("keyword") ?? "";
  const seasonCode = searchParams.get("seasonCode") ?? "";
  const position = searchParams.get("position") ?? "";
  const minPriceStr = searchParams.get("minPrice") ?? "";
  const maxPriceStr = searchParams.get("maxPrice") ?? "";

  const minPrice = minPriceStr ? parseInt(minPriceStr, 10) : undefined;
  const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : undefined;

  const { data: seasonsList } = useQuery({
    queryKey: ["public", "seasons"],
    queryFn: () => getSeasons(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["players", page, keyword, seasonCode, position, minPrice, maxPrice],
    queryFn: () =>
      getPlayers({
        page,
        size: PAGE_SIZE,
        keyword: keyword || undefined,
        seasonCode: seasonCode || undefined,
        position: position || undefined,
        minPrice,
        maxPrice,
      }),
  });

  const players = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalItems = data?.totalItems ?? 0;

  const canPrev = page > 0;
  const canNext = totalPages > 0 && page < totalPages - 1;

  const updateParams = (newParams: Record<string, string | number | undefined | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!("page" in newParams)) {
      params.set("page", "0");
    }

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    router.push(`/players?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/players");
  };

  return (
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

      {/* FILTER PANEL */}
      <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Keyword Search */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Tên cầu thủ
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Tìm tên..."
                value={keyword}
                onChange={(e) => updateParams({ keyword: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#00FF85] focus:bg-white/10"
              />
            </div>
          </div>

          {/* Season Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Mùa thẻ
            </label>
            <select
              value={seasonCode}
              onChange={(e) => updateParams({ seasonCode: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#00FF85] focus:bg-white/10 [&>option]:bg-[#0A0E1A] [&>option]:text-white"
            >
              <option value="">Tất cả mùa</option>
              {seasonsList?.map((s) => (
                <option key={s.id} value={s.seasonCode}>
                  {s.seasonCode} - {s.seasonName}
                </option>
              ))}
            </select>
          </div>

          {/* Position Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Vị trí
            </label>
            <select
              value={position}
              onChange={(e) => updateParams({ position: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#00FF85] focus:bg-white/10 [&>option]:bg-[#0A0E1A] [&>option]:text-white"
            >
              <option value="">Tất cả vị trí</option>
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Giá tối thiểu (BP)
            </label>
            <input
              type="number"
              placeholder="Từ..."
              value={minPriceStr}
              onChange={(e) => updateParams({ minPrice: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#00FF85] focus:bg-white/10"
            />
          </div>

          {/* Max Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Giá tối đa (BP)
            </label>
            <input
              type="number"
              placeholder="Đến..."
              value={maxPriceStr}
              onChange={(e) => updateParams({ maxPrice: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#00FF85] focus:bg-white/10"
            />
          </div>
        </div>

        {/* Action Bar */}
        {(keyword || seasonCode || position || minPriceStr || maxPriceStr) && (
          <div className="mt-4 flex justify-end border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </section>

      {isError && (
        <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-200">
          Không thể tải danh sách cầu thủ. Vui lòng thử lại.
        </div>
      )}

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <PlayerCardSkeleton key={`sk-${index}`} />
            ))
          : players.map((player) => <PlayerCard key={player.id} player={player} />)}
      </section>

      {/* PAGINATION */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => updateParams({ page: Math.max(0, page - 1) })}
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
          onClick={() => updateParams({ page: page + 1 })}
          disabled={!canNext || isLoading}
          className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:border-[#00FF85] hover:text-[#00FF85] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function PlayersPage() {
  return (
    <main className="min-h-screen bg-[#0A0E1A] px-4 py-8 text-white md:px-8">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-[1800px] animate-pulse">
            <div className="h-32 rounded-2xl bg-white/5" />
          </div>
        }
      >
        <PlayersContent />
      </Suspense>
    </main>
  );
}
