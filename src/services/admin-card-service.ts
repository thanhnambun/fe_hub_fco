import { apiClient } from "./api-client";

export interface PlayerCardItem {
  id: number;
  player: { id: number; playerName: string };
  season: { id: number; seasonCode: string; seasonName: string };
  ovr: number;
  enhanceLevel: number;
  salary: number;
  preferredPosition: string | null;
  secondaryPosition: string | null;
  marketPriceBp: number | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCardRequestPayload {
  playerId: number;
  seasonId: number;
  ovr: number;
  salary: number;
  preferredPosition?: string;
  secondaryPosition?: string;
  marketPriceBp?: number;
  imageUrl?: string;
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

export const adminCardService = {
  getCards: async (
    page = 0,
    size = 10,
    search = "",
    seasonCode = "",
  ): Promise<PageResponse<PlayerCardItem>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<PlayerCardItem>>>(
      "/api/v1/admin/cards",
      {
        params: {
          page,
          size,
          keyword: search || undefined,
          seasonCode: seasonCode || undefined,
        },
      },
    );
    return response.data.data;
  },

  createCard: async (payload: AdminCardRequestPayload): Promise<PlayerCardItem> => {
    const response = await apiClient.post<ApiResponse<PlayerCardItem>>(
      "/api/v1/admin/cards",
      payload,
    );
    return response.data.data;
  },

  updateCard: async (
    id: number,
    payload: Partial<AdminCardRequestPayload>,
  ): Promise<PlayerCardItem> => {
    const response = await apiClient.put<ApiResponse<PlayerCardItem>>(
      `/api/v1/admin/cards/${id}`,
      payload,
    );
    return response.data.data;
  },

  deleteCard: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/cards/${id}`);
  },
};
