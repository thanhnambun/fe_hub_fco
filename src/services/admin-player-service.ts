import { apiClient } from "./api-client";

export interface FcoPlayerItem {
  id: number;
  playerName: string;
  externalId: string;
  height: number | null;
  weight: number | null;
  birthdate: string | null;
  preferredFoot: string | null;
  weakFoot: number | null;
  nationName: string | null;
  clubName: string | null;
  leagueName: string | null;
  nation?: { id: number; nationName: string; flagUrl: string | null };
  club?: { id: number; clubName: string; crestUrl: string | null };
  league?: { id: number; leagueName: string; logoUrl: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface AdminPlayerRequestPayload {
  playerName: string;
  externalId?: string;
  height?: number;
  weight?: number;
  birthdate?: string;
  preferredFoot?: string;
  weakFoot?: number;
  nationId?: number | null;
  clubId?: number | null;
  leagueId?: number | null;
}

export interface AdminPlayerOptionsResponse {
  nations: Array<{ id: number; nationName: string; flagUrl: string | null }>;
  clubs: Array<{ id: number; clubName: string; crestUrl: string | null }>;
  leagues: Array<{ id: number; leagueName: string; logoUrl: string | null }>;
  seasons: Array<{ id: number; seasonCode: string; seasonName: string }>;
}

interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}

export const adminPlayerService = {
  getPlayers: async (page = 0, size = 10, search = ""): Promise<PageResponse<FcoPlayerItem>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<FcoPlayerItem>>>(
      "/api/v1/admin/players",
      {
        params: { page, size, keyword: search || undefined },
      },
    );
    return response.data.data;
  },

  getOptions: async (): Promise<AdminPlayerOptionsResponse> => {
    const response = await apiClient.get<
      ApiResponse<{
        nations: Array<{ id: number; label: string; slug: string | null; imageUrl: string | null }>;
        clubs: Array<{ id: number; label: string; slug: string | null; imageUrl: string | null }>;
        leagues: Array<{ id: number; label: string; slug: string | null; imageUrl: string | null }>;
        seasons: Array<{ id: number; label: string; slug: string | null; imageUrl: string | null }>;
      }>
    >("/api/v1/admin/players/options");
    const data = response.data.data;
    return {
      nations: (data.nations || []).map((n) => ({
        id: n.id,
        nationName: n.label,
        flagUrl: n.imageUrl,
      })),
      clubs: (data.clubs || []).map((c) => ({
        id: c.id,
        clubName: c.label,
        crestUrl: c.imageUrl,
      })),
      leagues: (data.leagues || []).map((l) => ({
        id: l.id,
        leagueName: l.label,
        logoUrl: l.imageUrl,
      })),
      seasons: (data.seasons || []).map((s) => ({
        id: s.id,
        seasonCode: s.slug || "",
        seasonName: s.label,
      })),
    };
  },

  createPlayer: async (payload: AdminPlayerRequestPayload): Promise<FcoPlayerItem> => {
    const response = await apiClient.post<ApiResponse<FcoPlayerItem>>(
      "/api/v1/admin/players",
      payload,
    );
    return response.data.data;
  },

  updatePlayer: async (id: number, payload: AdminPlayerRequestPayload): Promise<FcoPlayerItem> => {
    const response = await apiClient.put<ApiResponse<FcoPlayerItem>>(
      `/api/v1/admin/players/${id}`,
      payload,
    );
    return response.data.data;
  },

  deletePlayer: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/players/${id}`);
  },
};
