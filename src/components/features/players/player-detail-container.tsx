"use client";

import { useMemo, useState } from "react";
import type { PlayerDetailResponse } from "@/types/player-api";
import { PlayerDetailHero } from "./player-detail-hero";
import { PlayerStatsRadar } from "./player-stats-radar";
import { PlayerPriceTable } from "./player-price-table";
import { PlayerReviewsTab } from "./player-reviews-tab";
import Image from "next/image";
import { baseOvrAtGrade1, cumulativeOvrBonusFromGrade1 } from "@/lib/enhance-grade-ovr";
import { Calendar, Scale, Ruler, Flag, HelpCircle } from "lucide-react";
import {
  M_STRENGTH,
  M_ACCELERATION,
  M_SPRINT_SPEED,
  M_DRIBBLING_STAT,
  M_BALL_CONTROL,
  M_SHORT_PASSING,
  M_FINISHING,
  M_SHOT_POWER,
  M_HEADING_DEF,
  M_HEADING_PHY,
  M_LONG_SHOTS,
  M_VOLLEYS,
  M_POSITIONING,
  M_REACTIONS_DRI,
  M_REACTIONS_PAS,
  M_PENALTIES,
  M_VISION,
  M_CROSSING,
  M_LONG_PASSING,
  M_FREE_KICK,
  M_CURVE,
  M_AGILITY,
  M_BALANCE,
  M_MARKING,
  M_STANDING_TACKLE,
  M_INTERCEPTIONS,
  M_SLIDING_TACKLE,
  M_STAMINA,
  M_AGGRESSION,
  M_JUMPING,
  M_COMPOSURE_DRI,
  M_COMPOSURE_PAS,
  M_GK_DIVING,
  M_GK_HANDLING,
  M_GK_KICKING,
  M_GK_REFLEXES,
  M_GK_POSITIONING,
  M_POS_ST_FINISHING,
  M_POS_ST_POSITIONING,
  M_POS_ST_SHOT_POWER,
  M_POS_CAM_SHORT_PASS,
  M_POS_CAM_VISION,
  M_POS_CAM_BALL_CONTROL,
  M_POS_CB_MARKING,
  M_POS_CB_STANDING_TACKLE,
  M_POS_CB_HEADING,
  M_POS_CB_STRENGTH,
  M_POS_WG_ACCELERATION,
  M_POS_WG_AGILITY,
  M_POS_WG_CROSSING,
} from "@/constants/player-stat-multipliers";

interface PlayerDetailContainerProps {
  player: PlayerDetailResponse;
}

// Deterministic generator of 30 detailed sub-stats based on core stats
function getDetailedStats(
  activeStats: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physicality: number;
  },
  isGk: boolean,
  preferredPos: string,
) {
  const { pace, shooting, passing, dribbling, defending, physicality } = activeStats;
  const gkBase = isGk ? Math.round((pace + defending + physicality) / 3) : 25;

  const stats = {
    // Column 1
    strength: Math.round(physicality * M_STRENGTH),
    acceleration: Math.round(pace * M_ACCELERATION),
    sprintSpeed: Math.round(pace * M_SPRINT_SPEED),
    dribblingStat: Math.round(dribbling * M_DRIBBLING_STAT),
    ballControl: Math.round(dribbling * M_BALL_CONTROL),
    shortPassing: Math.round(passing * M_SHORT_PASSING),
    finishing: Math.round(shooting * M_FINISHING),
    shotPower: Math.round(shooting * M_SHOT_POWER),
    heading: Math.round(defending * M_HEADING_DEF + physicality * M_HEADING_PHY),

    // Column 2
    longShots: Math.round(shooting * M_LONG_SHOTS),
    volleys: Math.round(shooting * M_VOLLEYS),
    positioning: Math.round(shooting * M_POSITIONING),
    reactions: Math.round(dribbling * M_REACTIONS_DRI + passing * M_REACTIONS_PAS),
    penalties: Math.round(shooting * M_PENALTIES),
    vision: Math.round(passing * M_VISION),
    crossing: Math.round(passing * M_CROSSING),
    longPassing: Math.round(passing * M_LONG_PASSING),
    freeKick: Math.round(passing * M_FREE_KICK),

    // Column 3
    curve: Math.round(passing * M_CURVE),
    agility: Math.round(dribbling * M_AGILITY),
    balance: Math.round(dribbling * M_BALANCE),
    marking: Math.round(defending * M_MARKING),
    standingTackle: Math.round(defending * M_STANDING_TACKLE),
    interceptions: Math.round(defending * M_INTERCEPTIONS),
    slidingTackle: Math.round(defending * M_SLIDING_TACKLE),
    stamina: Math.round(physicality * M_STAMINA),
    aggression: Math.round(physicality * M_AGGRESSION),

    // Column 4
    jumping: Math.round(physicality * M_JUMPING),
    composure: Math.round(dribbling * M_COMPOSURE_DRI + passing * M_COMPOSURE_PAS),
    gkDiving: isGk ? Math.round(defending * M_GK_DIVING) : gkBase + 1,
    gkHandling: isGk ? Math.round(defending * M_GK_HANDLING) : gkBase,
    gkKicking: isGk ? Math.round(passing * M_GK_KICKING) : gkBase + 2,
    gkReflexes: isGk ? Math.round(defending * M_GK_REFLEXES) : gkBase - 1,
    gkPositioning: isGk ? Math.round(defending * M_GK_POSITIONING) : gkBase,
  };

  // Adjustments based on preferred position for maximum realism
  const pos = preferredPos?.toUpperCase() || "";
  if (pos === "ST" || pos === "CF") {
    stats.finishing = Math.round(stats.finishing * M_POS_ST_FINISHING);
    stats.positioning = Math.round(stats.positioning * M_POS_ST_POSITIONING);
    stats.shotPower = Math.round(stats.shotPower * M_POS_ST_SHOT_POWER);
  } else if (pos === "CAM" || pos === "CM") {
    stats.shortPassing = Math.round(stats.shortPassing * M_POS_CAM_SHORT_PASS);
    stats.vision = Math.round(stats.vision * M_POS_CAM_VISION);
    stats.ballControl = Math.round(stats.ballControl * M_POS_CAM_BALL_CONTROL);
  } else if (pos === "CB" || pos === "SW") {
    stats.marking = Math.round(stats.marking * M_POS_CB_MARKING);
    stats.standingTackle = Math.round(stats.standingTackle * M_POS_CB_STANDING_TACKLE);
    stats.heading = Math.round(stats.heading * M_POS_CB_HEADING);
    stats.strength = Math.round(stats.strength * M_POS_CB_STRENGTH);
  } else if (["LW", "RW", "LM", "RM", "LWB", "RWB", "LB", "RB"].includes(pos)) {
    stats.acceleration = Math.round(stats.acceleration * M_POS_WG_ACCELERATION);
    stats.agility = Math.round(stats.agility * M_POS_WG_AGILITY);
    stats.crossing = Math.round(stats.crossing * M_POS_WG_CROSSING);
  }

  // Ensure values don't overflow 255 or fall below 0
  const clamp = (val: number) => Math.min(255, Math.max(0, val));
  return Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, clamp(v)])) as typeof stats;
}

// Color thresholds for stat display
const STAT_NEON_MAGENTA_THRESHOLD = 120;
const STAT_PURPLE_THRESHOLD = 110;
const STAT_CYAN_THRESHOLD = 100;
const STAT_DIM_THRESHOLD = 80;

// Color coding mapping based on FIFA stat value
function getStatValueColor(val: number) {
  if (val >= STAT_NEON_MAGENTA_THRESHOLD)
    return "text-[#FF00BF] font-black drop-shadow-[0_0_6px_rgba(255,0,191,0.4)]"; // Neon Magenta/Purple
  if (val >= STAT_PURPLE_THRESHOLD) return "text-purple-400 font-bold";
  if (val >= STAT_CYAN_THRESHOLD) return "text-[#00E5FF] font-bold"; // Bright Cyan
  if (val >= STAT_DIM_THRESHOLD) return "text-slate-100 font-semibold";
  return "text-slate-500 font-medium";
}

export function PlayerDetailContainer({ player }: PlayerDetailContainerProps) {
  const storedLevel = Math.min(13, Math.max(1, player.enhanceLevel ?? 1));
  const [grade, setGrade] = useState(storedLevel);
  const [activeTab, setActiveTab] = useState<"traits" | "info" | "price" | "clubs" | "reviews">(
    "traits",
  );

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

  // Compute active stats at selected Grade
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

  // Parse and calculate dynamic OVR by Position
  const dynamicOvrByPos = useMemo(() => {
    if (!player.ovrByPosJson) return null;
    try {
      const baseOvrMap = JSON.parse(player.ovrByPosJson) as Record<string, number>;
      const activeBonus = cumulativeOvrBonusFromGrade1(grade);
      const storedBonus = cumulativeOvrBonusFromGrade1(storedLevel);

      const adjusted: Record<string, number> = {};
      Object.entries(baseOvrMap).forEach(([pos, val]) => {
        const baseVal = Math.max(0, val - storedBonus);
        adjusted[pos] = baseVal + activeBonus;
      });
      return adjusted;
    } catch {
      return null;
    }
  }, [player.ovrByPosJson, grade, storedLevel]);

  // Positions row data matching the fifaaddict single row position OVR layout
  const positionsRow = useMemo(() => {
    const defaultVal = Math.max(36, displayOvr - 15);
    const getPosOvr = (posName: string) => {
      if (dynamicOvrByPos && dynamicOvrByPos[posName]) return dynamicOvrByPos[posName];
      return defaultVal;
    };

    return [
      { key: "OVR", label: "OVR", val: displayOvr, isPrimary: true },
      { key: "ST", label: "ST", val: getPosOvr("ST") || getPosOvr("CF") },
      { key: "L/RW", label: "L/RW", val: getPosOvr("RW") || getPosOvr("LW") || getPosOvr("RM") },
      { key: "CF", label: "CF", val: getPosOvr("CF") || getPosOvr("ST") },
      { key: "CAM", label: "CAM", val: getPosOvr("CAM") || getPosOvr("CM") },
      { key: "L/RM", label: "L/RM", val: getPosOvr("RM") || getPosOvr("LM") },
      { key: "CM", label: "CM", val: getPosOvr("CM") || getPosOvr("CAM") },
      { key: "CDM", label: "CDM", val: getPosOvr("CDM") || getPosOvr("CM") },
      { key: "L/RWB", label: "L/RWB", val: getPosOvr("RWB") || getPosOvr("LWB") },
      { key: "L/RB", label: "L/RB", val: getPosOvr("RB") || getPosOvr("LB") },
      { key: "CB", label: "CB", val: getPosOvr("CB") },
      { key: "GK", label: "GK", val: getPosOvr("GK"), isGkOnly: true },
    ];
  }, [displayOvr, dynamicOvrByPos]);

  // Generate 30 detailed stats dynamically
  const isGk = player.preferredPosition?.toUpperCase() === "GK";
  const detailedStats = useMemo(() => {
    return getDetailedStats(activeStats, isGk, player.preferredPosition || "");
  }, [activeStats, isGk, player.preferredPosition]);

  // Sum of all 30 detailed stats
  const totalAttributesPoints = useMemo(() => {
    return Object.values(detailedStats).reduce((sum, val) => sum + val, 0);
  }, [detailedStats]);

  // Column Lists for Detailed Stats Grid
  const detailedStatsColumns = useMemo(() => {
    return [
      // Column 1
      [
        { name: "Strength", value: detailedStats.strength },
        { name: "Acceleration", value: detailedStats.acceleration },
        { name: "Sprint Speed", value: detailedStats.sprintSpeed },
        { name: "Dribbling", value: detailedStats.dribblingStat },
        { name: "Ball Control", value: detailedStats.ballControl },
        { name: "Short Passing", value: detailedStats.shortPassing },
        { name: "Finishing", value: detailedStats.finishing },
        { name: "Shot Power", value: detailedStats.shotPower },
        { name: "Heading", value: detailedStats.heading },
      ],
      // Column 2
      [
        { name: "Long Shots", value: detailedStats.longShots },
        { name: "Volleys", value: detailedStats.volleys },
        { name: "Positioning", value: detailedStats.positioning },
        { name: "Reactions", value: detailedStats.reactions },
        { name: "Penalties", value: detailedStats.penalties },
        { name: "Vision", value: detailedStats.vision },
        { name: "Crossing", value: detailedStats.crossing },
        { name: "Long Passing", value: detailedStats.longPassing },
        { name: "Free Kick", value: detailedStats.freeKick },
      ],
      // Column 3
      [
        { name: "Curve", value: detailedStats.curve },
        { name: "Agility", value: detailedStats.agility },
        { name: "Balance", value: detailedStats.balance },
        { name: "Marking", value: detailedStats.marking },
        { name: "Standing Tackle", value: detailedStats.standingTackle },
        { name: "Interceptions", value: detailedStats.interceptions },
        { name: "Sliding Tackle", value: detailedStats.slidingTackle },
        { name: "Stamina", value: detailedStats.stamina },
        { name: "Aggression", value: detailedStats.aggression },
      ],
      // Column 4
      [
        { name: "Jumping", value: detailedStats.jumping },
        { name: "Composure", value: detailedStats.composure },
        { name: "GK Diving", value: detailedStats.gkDiving, isGkStat: true },
        { name: "GK Handling", value: detailedStats.gkHandling, isGkStat: true },
        { name: "GK Kicking", value: detailedStats.gkKicking, isGkStat: true },
        { name: "GK Reflexes", value: detailedStats.gkReflexes, isGkStat: true },
        { name: "GK Positioning", value: detailedStats.gkPositioning, isGkStat: true },
      ],
    ];
  }, [detailedStats]);

  const activeWorkrateAtt = (player.workerateAtt || "mid").toUpperCase();
  const activeWorkrateDef = (player.workerateDef || "mid").toUpperCase();
  const activeReputation = (player.reputation || "Top Class").toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Hero / Grade Selection Section */}
      <PlayerDetailHero player={player} grade={grade} setGrade={setGrade} displayOvr={displayOvr} />

      {/* 2. Main Stats Board (FIFA-Style Combined Grid) */}
      <div className="w-full rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl backdrop-blur-xl">
        {/* A. Top metadata row */}
        <div className="mb-4 flex flex-wrap items-center justify-between border-b border-white/5 pb-3 gap-2">
          <div className="flex items-center gap-3">
            <span className="rounded bg-[#5E2BFF] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              UPGRADE
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-black tracking-wider">
            <div className="flex items-center gap-1.5 text-white/55">
              <span>WORKRATE</span>
              <span className="text-[#FF007F]">{activeWorkrateAtt}</span>
              <span className="text-cyan-400">{activeWorkrateDef}</span>
            </div>
            <div className="text-white/55">
              REPUTATION <span className="text-[#FFD700]">{activeReputation}</span>
            </div>
          </div>
        </div>

        {/* B. Core Stats Row */}
        <div className="mb-5 grid grid-cols-6 gap-2 rounded-xl bg-black/40 p-4 border border-white/5">
          {[
            { label: "PAC", val: activeStats.pace, name: "Tốc độ" },
            { label: "SHO", val: activeStats.shooting, name: "Sút" },
            { label: "PAS", val: activeStats.passing, name: "Chuyền" },
            { label: "DRI", val: activeStats.dribbling, name: "Rê bóng" },
            { label: "DEF", val: activeStats.defending, name: "Phòng thủ" },
            { label: "PHY", val: activeStats.physicality, name: "Thể lực" },
          ].map((st) => (
            <div key={st.label} className="flex flex-col items-center justify-center text-center">
              <span className="text-xs font-black uppercase tracking-widest text-white/40">
                {st.label}
              </span>
              <span className={`font-mono text-3xl tracking-tighter ${getStatValueColor(st.val)}`}>
                {st.val}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold text-white/50">{st.name}</span>
            </div>
          ))}
        </div>

        {/* C. OVR By Position Single Row (fifaaddict layout) */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex min-w-[640px] border-b border-white/10 pb-3 text-center">
            {positionsRow.map((pos) => {
              const highlight = pos.isPrimary
                ? "bg-purple-950/40 border-purple-500/30 text-purple-400 font-extrabold"
                : pos.key === player.preferredPosition?.toUpperCase()
                  ? "bg-[#00FF85]/10 border-[#00FF85]/20 text-[#00FF85] font-extrabold"
                  : "border-white/5 text-white/70";

              return (
                <div
                  key={pos.key}
                  className={`flex flex-1 flex-col items-center justify-center rounded-lg border p-1.5 mx-0.5 transition-colors ${highlight}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
                    {pos.label}
                  </span>
                  <span className="font-mono text-base font-bold mt-0.5">{pos.val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* D. 30 Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2.5 p-1">
          {detailedStatsColumns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1.5 text-sm">
              {col.map((st) => {
                // Color GK stats differently if outlaw player
                const valColor =
                  st.isGkStat && !isGk ? "text-slate-600 font-medium" : getStatValueColor(st.value);
                const labelColor = st.isGkStat && !isGk ? "text-white/30" : "text-white/75";

                return (
                  <div
                    key={st.name}
                    className="flex items-center justify-between py-0.5 hover:bg-white/[0.02] px-1 rounded transition"
                  >
                    <span className={`${labelColor} font-medium`}>{st.name}</span>
                    <span className={`font-mono text-base tracking-tight ${valColor}`}>
                      {st.value}
                    </span>
                  </div>
                );
              })}

              {/* Show Total Attributes Points at the bottom of the last column */}
              {colIdx === 3 && (
                <div className="mt-4 flex flex-col items-end border-t border-white/10 pt-3 text-right">
                  <span className="font-mono text-2xl font-black text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                    {totalAttributesPoints}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    AttributesPoints
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* E. Quick Traits Links */}
        {player.traits && player.traits.length > 0 && (
          <div className="mt-6 border-t border-white/5 pt-4 text-xs">
            <span className="font-black text-[#FFD700] uppercase tracking-wider mr-2">
              Traits :
            </span>
            <span className="text-white/60 font-medium">
              {player.traits.map((t, idx) => (
                <span key={t.traitCode}>
                  {idx > 0 && <span className="mx-2 text-white/20">|</span>}
                  <span className="hover:text-white transition cursor-pointer">{t.traitName}</span>
                </span>
              ))}
            </span>
          </div>
        )}
      </div>

      {/* 3. Bottom Tabs Section (Traits detail with Radar Chart, Bio Info, Price, Clubs) */}
      <div className="w-full rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl">
        {/* Tab Header Switcher */}
        <div className="mb-6 flex flex-wrap border-b border-white/10 gap-1">
          {[
            { id: "traits", label: "Traits", count: player.traits?.length },
            { id: "info", label: "INFO" },
            { id: "price", label: "PRICE" },
            { id: "clubs", label: "Club Career", count: player.clubs?.length },
            { id: "reviews", label: "CỘNG ĐỒNG" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id as "traits" | "info" | "price" | "clubs" | "reviews")
                }
                className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-lg transition border-t-2 border-x ${
                  active
                    ? "bg-[#00FF85]/10 border-t-[#00FF85] border-x-white/10 text-white font-extrabold"
                    : "border-transparent text-white/50 hover:text-white/80"
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

        {/* E. Reviews Tab (Community Insight) */}
        {activeTab === "reviews" && <PlayerReviewsTab cardId={player.id} />}
      </div>
    </div>
  );
}
