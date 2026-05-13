import type { Player } from "@/types/player";

export interface Account {
  id: string;
  ownerName: string;
  server: string;
  valueBp: number;
  rank: string;
  highlightPlayer: Player;
}
