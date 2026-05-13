"use client";

import Link from "next/link";
import { Coins, Hash, Layers, Shield, Sparkles } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { PlayerCardItem } from "@/types/player-api";

interface PlayerCardProps {
  player: PlayerCardItem;
}

const NEON = "#00FF85";
const GOLD = "#FFD700";
const SEASON_LOGO = 18;

const priceFormatter = new Intl.NumberFormat("vi-VN");
const salaryFormatter = new Intl.NumberFormat("vi-VN");



function tierClass(level: number) {
  if (level >= 8) {
    return "bg-[#FFD700] text-black shadow-[0_0_12px_rgba(255,215,0,0.5)]";
  }
  if (level >= 5) {
    return "bg-slate-300 text-black";
  }
  return "bg-zinc-700 text-white";
}

export function PlayerCard({ player }: PlayerCardProps) {
  const [imgSrc, setImgSrc] = useState(player.imageUrl || "/next.svg");
  const [seasonLogoError, setSeasonLogoError] = useState(false);

  const seasonCode = (player.seasonCode || "N/A").toUpperCase();

  const marketPriceLabel = useMemo(() => {
    if (player.marketPriceBp === null || player.marketPriceBp === undefined) {
      return null;
    }
    return priceFormatter.format(player.marketPriceBp);
  }, [player.marketPriceBp]);

  const salaryLabel =
    typeof player.salary === "number" && player.salary > 0
      ? salaryFormatter.format(player.salary)
      : null;

  return (
    <Link href={`/players/${player.id}`} className="group relative flex w-full max-w-[280px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black/95 backdrop-blur-xl shadow-lg shadow-black/40 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00FF85]/55 hover:shadow-[0_20px_50px_-14px_rgba(0,255,133,0.4)]">
      <article className="flex h-full w-full flex-col">
        {/* Subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,255,133,0.08),transparent_55%)] opacity-90 transition-opacity group-hover:opacity-100"
      />

      {/* --- HEADER: Avatar lớn + tên + mùa --- */}
      <header className="relative z-[1] flex flex-col items-center px-4 pb-3 pt-5">
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#00FF85]/20 via-transparent to-[#FFD700]/15 opacity-70 blur-[1px] transition-opacity group-hover:opacity-100"
          />
          <div className="relative overflow-hidden rounded-3xl ring-2 ring-white/15 ring-offset-2 ring-offset-slate-950 transition-[box-shadow] group-hover:ring-[#FFD700]/40">
            <Image
              src={imgSrc}
              alt={player.playerName}
              width={128}
              height={128}
              className="aspect-square h-28 w-28 object-cover object-center transition-transform duration-500 group-hover:scale-[1.03] sm:h-32 sm:w-32"
              sizes="(max-width:640px) 112px, 128px"
              onError={() => setImgSrc("/next.svg")}
            />
          </div>
          {player.enhanceLevel != null && player.enhanceLevel >= 1 && (
            <span
              className={`absolute -right-1 -top-1 flex h-8 min-w-[2rem] items-center justify-center rounded-lg border border-white/25 px-1.5 text-xs font-black backdrop-blur-sm ${tierClass(player.enhanceLevel)}`}
              title="Cấp thẻ"
            >
              +{player.enhanceLevel}
            </span>
          )}
        </div>

        <h3 className="fco-heading mt-4 line-clamp-2 w-full text-center text-sm font-bold uppercase tracking-wide text-white drop-shadow-sm sm:text-base">
          {player.playerName}
        </h3>

        <div className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
          <Layers className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
            {seasonCode}
          </span>
        </div>
      </header>

      {/* --- BODY: Grid thông số (OVR, vị trí, lương, ID) --- */}
      <section className="relative z-[1] flex flex-1 flex-col gap-2 px-4 pb-3">
        <div className="grid grid-cols-2 gap-2">
          {/* OVR — focal stat */}
          <div className="col-span-2 flex flex-row items-center justify-between gap-3 rounded-xl border border-[#FFD700]/25 bg-black/30 px-4 py-3 backdrop-blur-sm sm:flex-row sm:py-3.5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/50">
              <Sparkles className="h-3.5 w-3.5 text-[#FFD700]/80" aria-hidden />
              OVR
            </div>
            <p
              className="fco-heading text-4xl font-black leading-none sm:text-[2.75rem]"
              style={{ color: GOLD }}
            >
              {player.ovr ?? "—"}
            </p>
          </div>

          {/* Vị trí ưa thích */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
              <Shield className="h-3 w-3 shrink-0 text-[#00FF85]/70" aria-hidden />
              Vị trí
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-white/95">
              {player.preferredPosition?.trim() || "Chưa cập nhật"}
            </p>
          </div>

          {/* Lương (nếu có) */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
              <Hash className="h-3 w-3 shrink-0 text-white/40" aria-hidden />
              Lương
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-white/90">
              {salaryLabel ? `${salaryLabel}` : "—"}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-white/10 bg-black/20 px-2.5 py-1.5">
          <p className="truncate text-[10px] text-white/40">
            ID: <span className="font-mono text-white/70">{player.externalId ?? `#${player.id}`}</span>
          </p>
        </div>
      </section>

      {/* --- FOOTER: Giá thị trường nổi bật --- */}
      <footer className="relative z-[1] mt-auto border-t border-[#00FF85]/20 bg-gradient-to-r from-[#00FF85]/[0.07] via-transparent to-[#00FF85]/[0.05] px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/60">
          <Coins className="h-4 w-4" style={{ color: NEON }} aria-hidden />
          Giá thị trường
        </div>
        {marketPriceLabel ? (
          <p className="fco-heading mt-1 text-xl font-bold leading-tight sm:text-2xl">
            <span className="text-[#FFD700]">{marketPriceLabel}</span>{" "}
            <span className="text-white/50">BP</span>
          </p>
        ) : (
          <p className="mt-1 text-sm font-medium text-white/50">Đang cập nhật…</p>
        )}
      </footer>
      </article>
    </Link>
  );
}
