"use client";

import { useEffect, useState } from "react";

import { PlayerCard } from "@/components/base/player-card";
import { getPlayers } from "@/services/player-service";
import { getErrorMessage } from "@/lib/utils";
import type { PlayerCardItem } from "@/types/player-api";

function SkeletonCard() {
  return (
    <div className="glass animate-pulse rounded-2xl p-4">
      <div className="h-44 rounded-xl bg-white/10" />
      <div className="mt-4 h-4 w-2/3 rounded bg-white/10" />
      <div className="mt-3 h-3 w-1/2 rounded bg-white/10" />
      <div className="mt-3 h-3 w-3/4 rounded bg-white/10" />
    </div>
  );
}

export function PlayerSection() {
  const [players, setPlayers] = useState<PlayerCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlayers() {
      try {
        setLoading(true);
        const pageData = await getPlayers({ page: 0, size: 8 });
        setPlayers(pageData.items);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, "Không thể tải dữ liệu cầu thủ. Vui lòng thử lại sau."));
      } finally {
        setLoading(false);
      }
    }

    loadPlayers();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="fco-heading text-2xl font-semibold text-fco-gold">Phân tích cầu thủ</h2>
          <p className="mt-2 text-sm text-white/75">
            Dữ liệu cầu thủ được đồng bộ từ scraper Python và backend Spring Boot.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="glass rounded-2xl p-5 text-sm text-red-300">{error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </section>
  );
}
