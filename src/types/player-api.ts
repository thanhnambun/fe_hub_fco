export interface PlayerCardItem {
  id: number;
  externalId?: string;
  playerName: string;
  seasonCode: string;
  ovr: number;
  salary: number;
  preferredPosition?: string;
  marketPriceBp: number | null;
  imageUrl: string | null;
  enhanceLevel?: number;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physicality?: number;
}

export interface ClubResponse {
  clubName: string;
  clubSlug: string;
  clubFifaaddictId: number;
  crestUrl: string;
}

export interface TraitResponse {
  traitCode: string;
  traitName: string;
  description: string;
  iconId: string;
  iconUrl: string;
}

export interface PriceResponse {
  grade: number;
  priceBp: number;
  priceRaw: string;
  priceDate: string;
}

export interface PlayerDetailResponse extends PlayerCardItem {
  liveperf: number;
  hasLivePerf: boolean;
  skillLevel: number;
  secondaryPosition: string;
  workerateAtt: string;
  workerateDef: string;
  bodytype: string;
  reputation: string;
  priceUpdatedAt: string;
  ovrByPosJson: string;

  height: number;
  weight: number;
  birthdate: string;
  preferredFoot: string;
  weakFoot: number;
  nationName: string;
  nationSlug: string;
  leagueName: string;
  leagueSlug: string;

  clubs: ClubResponse[];
  traits: TraitResponse[];
  prices: PriceResponse[];
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ResponseWrapper<T> {
  status: string;
  code: number;
  data: T;
}
