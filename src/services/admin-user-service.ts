import { apiClient } from "./api-client";
import {
  ApiResponse,
  PaginationResponse,
  UserResponse,
  AdminUserUpdateRequest,
} from "@/types/admin-user";

const DEFAULT_PAGE_SIZE = 10;

export const adminUserService = {
  getUsers: async (page = 0, size = DEFAULT_PAGE_SIZE, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
    });
    const response = await apiClient.get<ApiResponse<PaginationResponse<UserResponse>>>(
      `/api/v1/admin/users?${params.toString()}`,
    );
    return response.data.data;
  },

  getUser: async (id: number) => {
    const response = await apiClient.get<ApiResponse<UserResponse>>(`/api/v1/admin/users/${id}`);
    return response.data.data;
  },

  updateUser: async (id: number, data: AdminUserUpdateRequest) => {
    const response = await apiClient.put<ApiResponse<UserResponse>>(
      `/api/v1/admin/users/${id}`,
      data,
    );
    return response.data.data;
  },

  toggleStatus: async (id: number) => {
    const response = await apiClient.patch<ApiResponse<void>>(`/api/v1/admin/users/${id}/status`);
    return response.data;
  },
};
