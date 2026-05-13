"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";

type RoleValue = string;

export interface UserProfile {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string | null;
  balance: number;
  isActive?: boolean;
  roles: RoleValue[];
}

/** Khớp ResponseWrapper từ AuthController GET /me */
interface MeApiResponse {
  code: number;
  status: string;
  message?: string;
  data: UserProfile;
}

async function fetchMe(): Promise<UserProfile> {
  const response = await apiClient.get<MeApiResponse>("/api/v1/auth/me");
  return response.data.data;
}

export function useAuth() {
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    staleTime: 30 * 1000, // 30s — tránh gọi lại /auth/me liên tục khi mount
    retry: 0,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    profile: query.data ?? null,
    isAuthenticated: Boolean(query.data),
  };
}
