import Image from "next/image";

import { GlassCard } from "@/components/base/glass-card";
import type { Account } from "@/types/account";

type AccountCardProps = {
  account: Account;
};

function formatBp(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function AccountCard({ account }: AccountCardProps) {
  const player = account.highlightPlayer;

  return (
    <GlassCard className="overflow-hidden">
      <div className="relative h-52 w-full">
        <Image
          src={player.avatarUrl}
          alt={player.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 420px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fco-navy via-fco-navy/40 to-transparent" />
        <div className="absolute bottom-3 left-3 rounded-md border border-white/20 bg-fco-navy/70 px-2 py-1 text-xs font-medium">
          OVR {player.rating ?? "N/A"} | {player.position}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <p className="fco-heading text-xl font-semibold text-white">{player.name}</p>
        <p className="text-sm text-white/70">
          {account.ownerName} - {account.server}
        </p>
        <p className="text-sm text-fco-gold">Giá BP: {formatBp(account.valueBp)} BP</p>
        <button className="w-full rounded-xl bg-fco-green px-4 py-2.5 text-sm font-semibold text-fco-navy shadow-glow transition hover:brightness-110">
          Xem chi tiết
        </button>
      </div>
    </GlassCard>
  );
}
