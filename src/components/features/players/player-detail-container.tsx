"use client";

import { useMemo, useState, useEffect } from "react";
import type { PlayerDetailResponse } from "@/types/player-api";
import { PlayerDetailHero } from "./player-detail-hero";
import { PlayerStatsRadar } from "./player-stats-radar";
import { PlayerPriceTable } from "./player-price-table";
import { PlayerReviewsTab } from "./player-reviews-tab";
import Image from "next/image";
import { baseOvrAtGrade1, cumulativeOvrBonusFromGrade1 } from "@/lib/enhance-grade-ovr";
import { Calendar, Scale, Ruler, Flag, HelpCircle } from "lucide-react";

interface PlayerDetailContainerProps {
  player: PlayerDetailResponse;
}

export function PlayerDetailContainer({ player }: PlayerDetailContainerProps) {
  const storedLevel = Math.min(13, Math.max(1, player.enhanceLevel ?? 1));
  const [grade, setGrade] = useState(storedLevel);
  const [activeTab, setActiveTab] = useState<"traits" | "info" | "price" | "clubs">("traits");

  // Tự động cuộn xuống phần Đánh giá nếu URL có hash #reviews
  useEffect(() => {
    const SCROLL_DELAY_MS = 300;
    if (typeof window !== "undefined" && window.location.hash === "#reviews") {
      const timer = setTimeout(() => {
        const el = document.getElementById("reviews");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, SCROLL_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  // Compute base stats at Grade 1
  const baseStats = useMemo(() => {
    const storedBonus = cumulativeOvrBonusFromGrade1(storedLevel);
    return {
      pace: Math.max(0, (player.pace ?? 0) - storedBonus),
      shooting: Math.max(0, (player.shooting ?? 0) - storedBonus),
      passing: Math.max(0, (player.passing ?? 0) - storedBonus),
      dribbling: Math.max(0, (player.dribbling ?? 0) - storedBonus),
      defending: Math.max(0, (player.defending ?? 0) - storedBonus),
      physicality: Math.max(0, (player.physicality ?? 0) - storedBonus),
    };
  }, [player, storedLevel]);

  // Compute active stats at selected Grade (used by PlayerStatsRadar)
  const activeStats = useMemo(() => {
    const activeBonus = cumulativeOvrBonusFromGrade1(grade);
    return {
      pace: baseStats.pace + activeBonus,
      shooting: baseStats.shooting + activeBonus,
      passing: baseStats.passing + activeBonus,
      dribbling: baseStats.dribbling + activeBonus,
      defending: baseStats.defending + activeBonus,
      physicality: baseStats.physicality + activeBonus,
    };
  }, [baseStats, grade]);

  // Compute dynamic base OVR for Display OVR
  const baseGrade1Ovr = useMemo(
    () => baseOvrAtGrade1(player.ovr ?? 0, player.enhanceLevel),
    [player.ovr, player.enhanceLevel],
  );

  const displayOvr = useMemo(() => {
    const raw = baseGrade1Ovr + cumulativeOvrBonusFromGrade1(grade);
    return Math.min(255, Math.max(0, Math.round(raw)));
  }, [baseGrade1Ovr, grade]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Hero / Grade Selection Section */}
      <PlayerDetailHero player={player} grade={grade} setGrade={setGrade} displayOvr={displayOvr} />

      {/* 2. Bottom Tabs Section (Traits detail with Radar Chart, Bio Info, Price, Clubs) */}
      <div className="w-full rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl">
        {/* Tab Header Switcher */}
        <div className="mb-6 flex flex-wrap border-b border-white/10 gap-1">
          {[
            { id: "traits", label: "Traits", count: player.traits?.length },
            { id: "info", label: "INFO" },
            { id: "price", label: "PRICE" },
            { id: "clubs", label: "Club Career", count: player.clubs?.length },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "traits" | "info" | "price" | "clubs")}
                className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-lg transition border-t-2 border-x ${
                  active
                    ? "bg-[#00FF85]/10 border-t-[#00FF85] border-x-white/10 text-white font-extrabold"
                    : "border-transparent text-white/55 hover:text-white/80"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="p-1">
          {/* A. Traits Tab (Side-by-side: Details list on left, Radar Chart on right) */}
          {activeTab === "traits" && (
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
              {/* Left Column: Traits cards */}
              <div className="flex-1 flex flex-col gap-4 w-full">
                {player.traits && player.traits.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {player.traits.map((trait) => (
                      <div
                        key={trait.traitCode}
                        className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                      >
                        {trait.iconUrl ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/30 p-1 border border-white/5">
                            <Image
                              src={trait.iconUrl}
                              alt={trait.traitName}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/40">
                            <HelpCircle className="h-6 w-6" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <h4 className="text-sm font-black text-[#FFD700] uppercase tracking-wider">
                            {trait.traitName}
                          </h4>
                          <p className="mt-1 text-xs leading-normal text-white/60">
                            {trait.description || "Không có mô tả chi tiết."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/45 py-8 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
                    Cầu thủ này không có chỉ số ẩn (traits) đặc biệt nào.
                  </p>
                )}
              </div>

              {/* Right Column: Sleek Neon Radar Chart */}
              <div className="shrink-0 w-full lg:w-[280px] flex justify-center items-center rounded-2xl border border-white/5 bg-black/45 p-4 self-center lg:self-start">
                <PlayerStatsRadar player={player} activeStats={activeStats} />
              </div>
            </div>
          )}

          {/* B. Info Tab (Standard Bio details) */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#00FF85] border-b border-white/5 pb-2">
                  Thông tin thể chất
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col gap-1 rounded-xl bg-white/[0.01] border border-white/5 p-3">
                    <span className="text-[10px] uppercase font-bold text-white/40">Chiều cao</span>
                    <span className="font-mono text-base font-bold text-white flex items-center gap-1.5">
                      <Ruler className="h-4 w-4 text-cyan-400" />
                      {player.height} cm
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl bg-white/[0.01] border border-white/5 p-3">
                    <span className="text-[10px] uppercase font-bold text-white/40">Cân nặng</span>
                    <span className="font-mono text-base font-bold text-white flex items-center gap-1.5">
                      <Scale className="h-4 w-4 text-cyan-400" />
                      {player.weight} kg
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl bg-white/[0.01] border border-white/5 p-3 col-span-2">
                    <span className="text-[10px] uppercase font-bold text-white/40">Ngày sinh</span>
                    <span className="font-mono text-base font-bold text-white flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      {player.birthdate || "Chưa cập nhật"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#00FF85] border-b border-white/5 pb-2">
                  Đặc tính thi đấu
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col gap-1 rounded-xl bg-white/[0.01] border border-white/5 p-3">
                    <span className="text-[10px] uppercase font-bold text-white/40">
                      Chân thuận
                    </span>
                    <span className="font-mono text-base font-bold text-white">
                      {player.preferredFoot === "left"
                        ? "Trái"
                        : player.preferredFoot === "right"
                          ? "Phải"
                          : "Cả hai"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl bg-white/[0.01] border border-white/5 p-3">
                    <span className="text-[10px] uppercase font-bold text-white/40">
                      Chân không thuận
                    </span>
                    <span className="font-mono text-base font-bold text-amber-400">
                      {player.weakFoot} / 5
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl bg-white/[0.01] border border-white/5 p-3 col-span-2">
                    <span className="text-[10px] uppercase font-bold text-white/40">Quốc tịch</span>
                    <span className="font-mono text-base font-bold text-white flex items-center gap-2">
                      <Flag className="h-4 w-4 text-cyan-400" />
                      {player.nationName || "Chưa cập nhật"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* C. Price Tab (The 13 enhance levels market price list) */}
          {activeTab === "price" && (
            <div className="max-w-3xl">
              <PlayerPriceTable prices={player.prices} />
            </div>
          )}

          {/* D. Club Career Tab (Clubs history list with logos) */}
          {activeTab === "clubs" && (
            <div className="max-w-2xl space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#00FF85] border-b border-white/5 pb-2">
                Danh sách Câu lạc bộ từng cống hiến
              </h4>
              {player.clubs && player.clubs.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {player.clubs.map((club, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 hover:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-3">
                        {club.crestUrl ? (
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden">
                            <Image
                              src={club.crestUrl}
                              alt={club.clubName}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-white/5" />
                        )}
                        <span className="text-sm font-semibold text-white/85">{club.clubName}</span>
                      </div>
                      <span className="text-xs font-semibold text-white/40">
                        {idx === 0
                          ? "Câu lạc bộ hiện tại"
                          : `Trạm dừng chân #${player.clubs.length - idx}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/45 py-8 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
                  Chưa cập nhật thông tin câu lạc bộ.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. dedicated Reviews / Community section at the bottom */}
      <div
        id="reviews"
        className="w-full rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl scroll-mt-6"
      >
        <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-[#00FF85] border-b border-white/10 pb-3 flex items-center gap-2">
          <span>Ý kiến Cộng đồng & AI Insight</span>
        </h3>
        <PlayerReviewsTab cardId={player.id} />
      </div>
    </div>
  );
}
