import { apiClient } from "./api-client";

export interface SeasonItem {
  id: number;
  seasonCode: string;
  seasonName: string;
  isCore: boolean;
  isActive: boolean;
}

export interface NationItem {
  id: number;
  nationName: string;
  nationSlug: string;
  flagUrl: string | null;
}

export interface LeagueItem {
  id: number;
  leagueName: string;
  leagueSlug: string;
  logoUrl: string | null;
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

export const adminSeasonService = {
  getSeasons: async (page = 0, size = 20, search = ""): Promise<PageResponse<SeasonItem>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<SeasonItem>>>(
      "/api/v1/admin/seasons",
      {
        params: { page, size, keyword: search || undefined },
      },
    );
    return response.data.data;
  },

  createSeason: async (payload: Partial<SeasonItem>): Promise<SeasonItem> => {
    const response = await apiClient.post<ApiResponse<SeasonItem>>(
      "/api/v1/admin/seasons",
      payload,
    );
    return response.data.data;
  },

  updateSeason: async (id: number, payload: Partial<SeasonItem>): Promise<SeasonItem> => {
    const response = await apiClient.put<ApiResponse<SeasonItem>>(
      `/api/v1/admin/seasons/${id}`,
      payload,
    );
    return response.data.data;
  },

  deleteSeason: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/seasons/${id}`);
  },
};

export const adminNationService = {
  getNations: async (page = 0, size = 20, search = ""): Promise<PageResponse<NationItem>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<NationItem>>>(
      "/api/v1/admin/nations",
      {
        params: { page, size, keyword: search || undefined },
      },
    );
    return response.data.data;
  },

  createNation: async (payload: Partial<NationItem>): Promise<NationItem> => {
    const response = await apiClient.post<ApiResponse<NationItem>>(
      "/api/v1/admin/nations",
      payload,
    );
    return response.data.data;
  },

  updateNation: async (id: number, payload: Partial<NationItem>): Promise<NationItem> => {
    const response = await apiClient.put<ApiResponse<NationItem>>(
      `/api/v1/admin/nations/${id}`,
      payload,
    );
    return response.data.data;
  },

  deleteNation: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/nations/${id}`);
  },
};

export const adminLeagueService = {
  getLeagues: async (page = 0, size = 20, search = ""): Promise<PageResponse<LeagueItem>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<LeagueItem>>>(
      "/api/v1/admin/leagues",
      {
        params: { page, size, keyword: search || undefined },
      },
    );
    return response.data.data;
  },

  createLeague: async (payload: Partial<LeagueItem>): Promise<LeagueItem> => {
    const response = await apiClient.post<ApiResponse<LeagueItem>>(
      "/api/v1/admin/leagues",
      payload,
    );
    return response.data.data;
  },

  updateLeague: async (id: number, payload: Partial<LeagueItem>): Promise<LeagueItem> => {
    const response = await apiClient.put<ApiResponse<LeagueItem>>(
      `/api/v1/admin/leagues/${id}`,
      payload,
    );
    return response.data.data;
  },

  deleteLeague: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/leagues/${id}`);
  },
};
