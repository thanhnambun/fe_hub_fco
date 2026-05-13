"use client";

import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import type { PlayerDetailResponse } from "@/types/player-api";

interface PlayerStatsRadarProps {
  player: PlayerDetailResponse;
}

export function PlayerStatsRadar({ player }: PlayerStatsRadarProps) {
  const data = useMemo(() => [
    { subject: "Tốc độ", value: player.pace || 0, fullMark: 140 },
    { subject: "Sút", value: player.shooting || 0, fullMark: 140 },
    { subject: "Chuyền", value: player.passing || 0, fullMark: 140 },
    { subject: "Rê bóng", value: player.dribbling || 0, fullMark: 140 },
    { subject: "Phòng thủ", value: player.defending || 0, fullMark: 140 },
    { subject: "Thể lực", value: player.physicality || 0, fullMark: 140 },
  ], [player]);

  return (
    <div className="relative flex aspect-square w-full max-w-[400px] flex-col items-center justify-center rounded-3xl border border-[#00FF85]/20 bg-black/40 p-6 backdrop-blur-xl">
      <h3 className="absolute left-6 top-6 text-sm font-bold uppercase tracking-widest text-white/70">
        Chỉ số lõi
      </h3>

      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            {/* SVG Filter for Neon Glow */}
            <defs>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#00FF85" floodOpacity="0.8" />
              </filter>
            </defs>
            <PolarGrid stroke="#ffffff33" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#ffffff99", fontSize: 11, fontWeight: 600 }} />
            <Radar
              name="Player"
              dataKey="value"
              stroke="#00FF85"
              strokeWidth={2}
              fill="#00FF85"
              fillOpacity={0.3}
              filter="url(#neonGlow)"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
