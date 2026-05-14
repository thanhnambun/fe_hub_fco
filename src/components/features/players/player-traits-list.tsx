"use client";

import Image from "next/image";
import type { PlayerDetailResponse } from "@/types/player-api";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlayerTraitsListProps {
  traits: PlayerDetailResponse["traits"];
}

export function PlayerTraitsList({ traits }: PlayerTraitsListProps) {
  if (!traits || traits.length === 0) return null;

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/70">
        Chỉ số ẩn (Traits)
      </h3>
      <div className="flex flex-wrap gap-3">
        <TooltipProvider delayDuration={200}>
          {traits.map((trait) => (
            <Tooltip key={trait.traitCode}>
              <TooltipTrigger asChild>
                <div className="flex cursor-help items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10">
                  <Image
                    src={trait.iconUrl}
                    alt={trait.traitName}
                    width={20}
                    height={20}
                    unoptimized
                    className="h-5 w-5 object-contain"
                  />
                  <span className="text-xs font-semibold text-white/90">{trait.traitName}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-[250px] border-white/10 bg-black/90 p-3 text-white backdrop-blur-md"
              >
                <p className="text-xs leading-relaxed">{trait.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
