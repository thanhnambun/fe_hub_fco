"use client";

import Image from "next/image";
import type { PlayerDetailResponse } from "@/types/player-api";
import { Shield, Sparkles, User, Flag, Users } from "lucide-react";

interface PlayerDetailHeroProps {
  player: PlayerDetailResponse;
  grade: number;
  setGrade: (grade: number) => void;
  displayOvr: number;
}

const GOLD = "#FFD700";
const GRADE_LABEL = "#3d2914";
const GRADE_BTN = "rgba(201, 166, 107, 0.85)";
const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

export function PlayerDetailHero({ player, grade, setGrade, displayOvr }: PlayerDetailHeroProps) {
  const storedLevel = Math.min(13, Math.max(1, player.enhanceLevel ?? 1));

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
      {/* Background Blur Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={player.imageUrl || "/next.svg"}
          alt={player.playerName}
          fill
          className="object-cover opacity-20 blur-3xl"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center p-8 pt-12 text-center md:flex-row md:items-start md:text-left">
        {/* Avatar */}
        <div className="relative mb-6 shrink-0 md:mb-0 md:mr-10">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#00FF85]/30 to-[#FFD700]/20 opacity-70 blur-xl" />
          <div className="relative overflow-hidden rounded-3xl ring-4 ring-white/10">
            <Image
              src={player.imageUrl || "/next.svg"}
              alt={player.playerName}
              width={220}
              height={220}
              className="aspect-square object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col md:pt-4">
          <div className="mb-2 flex items-center justify-center gap-3 md:justify-start">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="text-sm font-bold uppercase tracking-widest text-white/90">
                {player.seasonCode}
              </span>
            </div>
            {player.salary > 0 && (
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md">
                Lương {player.salary}
              </span>
            )}
          </div>

          <h1 className="fco-heading mb-4 text-4xl font-black text-white drop-shadow-md sm:text-5xl md:text-6xl">
            {player.playerName}
          </h1>

          {/* OVR & Pos */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-[#FFD700]/30 bg-black/40 px-5 py-3 backdrop-blur-md">
              <Sparkles className="h-5 w-5 text-[#FFD700]/80" />
              <span className="text-sm font-bold uppercase text-white/50">OVR</span>
              <span
                className="fco-heading text-3xl font-black leading-none"
                style={{ color: GOLD }}
              >
                {displayOvr}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md">
              <Shield className="h-5 w-5 text-[#00FF85]/70" />
              <span className="text-sm font-bold uppercase text-white/50">Vị trí</span>
              <span className="text-xl font-bold text-white">
                {player.preferredPosition || "—"}
              </span>
            </div>
          </div>

          {/* Bio info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70 md:justify-start">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 opacity-50" />
              <span>
                {player.height}cm, {player.weight}kg
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flag className="h-4 w-4 opacity-50" />
              <span>{player.nationName || "—"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="opacity-50">Chân:</span>
              <span className="font-medium text-white">
                {player.preferredFoot} {player.weakFoot}-5
              </span>
            </div>
          </div>

          {/* Clubs */}
          {player.clubs && player.clubs.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <Users className="mr-2 h-4 w-4 text-white/40" />
              {player.clubs.slice(0, 5).map((club, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1"
                >
                  {club.crestUrl && (
                    <Image
                      src={club.crestUrl}
                      alt={club.clubName}
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                      unoptimized
                    />
                  )}
                  <span className="text-xs font-medium text-white/80">{club.clubName}</span>
                </div>
              ))}
              {player.clubs.length > 5 && (
                <span className="text-xs text-white/40">+{player.clubs.length - 5}</span>
              )}
            </div>
          )}

          {/* Grade (+1 … +13) — chỉ đổi OVR hiển thị trên FE */}
          <div className="mt-8 w-full max-w-xl rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md md:mx-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div
                className="shrink-0 rounded-lg px-4 py-2 text-center text-sm font-bold uppercase tracking-wide text-white shadow-inner sm:py-3"
                style={{ backgroundColor: GRADE_LABEL }}
              >
                Grade
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {GRADES.slice(0, 5).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className="min-h-[2.25rem] rounded-md text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] sm:min-h-[2.5rem] sm:text-base"
                      style={{
                        backgroundColor: grade === g ? GRADE_LABEL : GRADE_BTN,
                        color: grade === g ? GOLD : "#fff",
                        boxShadow: grade === g ? `0 0 0 1px ${GOLD}` : undefined,
                      }}
                    >
                      +{g}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {GRADES.slice(5, 10).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className="min-h-[2.25rem] rounded-md text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] sm:min-h-[2.5rem] sm:text-base"
                      style={{
                        backgroundColor: grade === g ? GRADE_LABEL : GRADE_BTN,
                        color: grade === g ? GOLD : "#fff",
                        boxShadow: grade === g ? `0 0 0 1px ${GOLD}` : undefined,
                      }}
                    >
                      +{g}
                    </button>
                  ))}
                </div>
                <div className="grid max-w-[75%] grid-cols-3 gap-1.5 sm:gap-2">
                  {GRADES.slice(10, 13).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className="min-h-[2.25rem] rounded-md text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] sm:min-h-[2.5rem] sm:text-base"
                      style={{
                        backgroundColor: grade === g ? GRADE_LABEL : GRADE_BTN,
                        color: grade === g ? GOLD : "#fff",
                        boxShadow: grade === g ? `0 0 0 1px ${GOLD}` : undefined,
                      }}
                    >
                      +{g}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] leading-snug text-white/45">
                  OVR hiển thị = OVR mốc +1 + cộng dồn theo cấp (chỉ trên trang này). Thẻ API: +
                  {storedLevel}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
