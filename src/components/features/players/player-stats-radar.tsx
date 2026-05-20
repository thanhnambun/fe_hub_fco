"use client";

import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import type { PlayerDetailResponse } from "@/types/player-api";

interface PlayerStatsRadarProps {
  player: PlayerDetailResponse;
  activeStats?: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physicality: number;
  };
}

// Stat value color & bar thresholds
const STAT_THRESHOLD_ELITE = 120;
const STAT_THRESHOLD_GREAT = 110;
const STAT_THRESHOLD_GOOD = 100;
const STAT_THRESHOLD_AVG = 80;
// Progress bar scale maximum (stats can exceed 100 in this game)
const STAT_BAR_SCALE_MAX = 150;

function getStatColor(val: number) {
  if (val >= STAT_THRESHOLD_ELITE)
    return "text-[#00FF85] drop-shadow-[0_0_8px_rgba(0,255,133,0.6)] font-black";
  if (val >= STAT_THRESHOLD_GREAT)
    return "text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] font-black";
  if (val >= STAT_THRESHOLD_GOOD) return "text-amber-400 font-bold";
  if (val >= STAT_THRESHOLD_AVG) return "text-slate-100 font-semibold";
  return "text-slate-400 font-medium";
}

function getStatBarBg(val: number) {
  if (val >= STAT_THRESHOLD_ELITE) return "bg-[#00FF85]";
  if (val >= STAT_THRESHOLD_GREAT) return "bg-[#FFD700]";
  if (val >= STAT_THRESHOLD_GOOD) return "bg-amber-400";
  if (val >= STAT_THRESHOLD_AVG) return "bg-slate-200";
  return "bg-slate-500";
}

export function PlayerStatsRadar({ player, activeStats }: PlayerStatsRadarProps) {
  // Use active stats passed down from parent container or fall back to player base stats
  const stats = useMemo(() => {
    return (
      activeStats || {
        pace: player.pace || 0,
        shooting: player.shooting || 0,
        passing: player.passing || 0,
        dribbling: player.dribbling || 0,
        defending: player.defending || 0,
        physicality: player.physicality || 0,
      }
    );
  }, [activeStats, player]);

  const radarData = useMemo(
    () => [
      { subject: "Tốc độ", value: stats.pace, fullMark: 140 },
      { subject: "Sút", value: stats.shooting, fullMark: 140 },
      { subject: "Chuyền", value: stats.passing, fullMark: 140 },
      { subject: "Rê bóng", value: stats.dribbling, fullMark: 140 },
      { subject: "Phòng thủ", value: stats.defending, fullMark: 140 },
      { subject: "Thể lực", value: stats.physicality, fullMark: 140 },
    ],
    [stats],
  );

  const statList = useMemo(
    () => [
      { abbr: "PAC", name: "Tốc độ", value: stats.pace },
      { abbr: "SHO", name: "Sút", value: stats.shooting },
      { abbr: "PAS", name: "Chuyền", value: stats.passing },
      { abbr: "DRI", name: "Rê bóng", value: stats.dribbling },
      { abbr: "DEF", name: "Phòng thủ", value: stats.defending },
      { abbr: "PHY", name: "Thể lực", value: stats.physicality },
    ],
    [stats],
  );

  return (
    <div className="relative flex w-full max-w-[400px] flex-col rounded-3xl border border-[#00FF85]/20 bg-black/40 p-6 backdrop-blur-xl">
      <h3 className="text-sm font-bold uppercase tracking-widest text-white/70">Chỉ số lõi</h3>

      {/* Radar Chart section */}
      <div className="relative aspect-square w-full -mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
            {/* SVG Filter for Neon Glow */}
            <defs>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="8"
                  floodColor="#00FF85"
                  floodOpacity="0.8"
                />
              </filter>
            </defs>
            <PolarGrid stroke="#ffffff22" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#ffffff88", fontSize: 11, fontWeight: 600 }}
            />
            <Radar
              name="Player"
              dataKey="value"
              stroke="#00FF85"
              strokeWidth={2}
              fill="#00FF85"
              fillOpacity={0.25}
              filter="url(#neonGlow)"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Separator Line */}
      <div className="mb-5 mt-2 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Grid of numeric stats with custom styles */}
      <div className="grid grid-cols-2 gap-3">
        {statList.map((st) => (
          <div
            key={st.abbr}
            className="group/item flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-3 transition duration-300 hover:bg-white/[0.05] hover:border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40 group-hover/item:text-[#00FF85]/60 transition-colors">
                  {st.abbr}
                </span>
                <span className="text-xs font-semibold text-white/75 group-hover/item:text-white transition-colors">
                  {st.name}
                </span>
              </div>
              <span className={`font-mono text-2xl tracking-tighter ${getStatColor(st.value)}`}>
                {st.value}
              </span>
            </div>

            {/* Custom linear progress bar */}
            <div className="mt-2 h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getStatBarBg(st.value)}`}
                style={{ width: `${Math.min(100, (st.value / STAT_BAR_SCALE_MAX) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
