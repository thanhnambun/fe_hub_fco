import { apiClient } from "@/services/api-client";
import type { PageResponse, PlayerCardItem, ResponseWrapper } from "@/types/player-api";

export async function getPlayers(params?: {
  page?: number;
  size?: number;
  keyword?: string;
  seasonCode?: string;
}) {
  const response = await apiClient.get<ResponseWrapper<PageResponse<PlayerCardItem>>>("/api/v1/players", {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 8,
      keyword: params?.keyword,
      seasonCode: params?.seasonCode,
    }
  });

  return response.data.data;
}

export async function getPlayerById(id: number) {
  if (!Number.isFinite(id)) {
    throw new Error("Invalid player id");
  }
  const response = await apiClient.get<ResponseWrapper<import("@/types/player-api").PlayerDetailResponse>>(`/api/v1/players/${id}`);
  return response.data.data;
}
