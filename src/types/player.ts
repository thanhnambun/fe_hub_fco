export interface Player {
  id: number;
  name: string;
  team?: string;
  position: string;
  rating?: number;
  priceBp?: number;
  avatarUrl: string;
  externalId?: string;
  season?: string;
  ovr?: number;
  salary?: number;
}

