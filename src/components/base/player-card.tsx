"use client";

import Image from "next/image";

import type { PlayerCardItem } from "@/types/player-api";

type PlayerCardProps = {
  player: PlayerCardItem;
};

function formatPrice(value: number | null) {
  if (!value) {
    return "Đang cập nhật";
  }
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <article className="glass rounded-2xl p-4 shadow-deep">
      <div className="relative h-44 overflow-hidden rounded-xl">
        <Image
          src={player.imageUrl || "/next.svg"}
          alt={player.playerName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fco-navy via-fco-navy/35 to-transparent" />
        <div className="absolute left-3 top-3 rounded-md bg-fco-green px-2 py-1 text-xs font-bold text-fco-navy">
          OVR {player.ovr}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="fco-heading text-lg font-semibold text-white">{player.playerName}</h3>
        <p className="text-sm text-white/70">Mùa giải: {player.seasonCode}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/75">Lương: {player.salary}</span>
          <span className="font-semibold text-fco-gold">Giá BP: {formatPrice(player.marketPriceBp)}</span>
        </div>
      </div>
    </article>
  );
}
