import { apiClient } from "./api-client";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Profile data trả về trong body — KHÔNG chứa token.
 * Token được backend set vào httpOnly Cookie.
 */
export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  roles: string[];
}

interface ApiResponse<T> {
  code: number;
  status: string;
  message?: string;
  data: T;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/api/v1/auth/login", payload);
    localStorage.removeItem("fco_hub_force_logout");
    // Cookie được set bởi backend — không cần làm gì thêm
    return response.data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/api/v1/auth/register",
      payload,
    );
    return response.data.data;
  },

  /**
   * Gọi logout API — backend sẽ blacklist access token,
   * xóa refresh token khỏi Redis, và clear cả 2 cookie.
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/api/v1/auth/logout");
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post("/api/v1/auth/forgot-password", { email });
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await apiClient.post("/api/v1/auth/reset-password", payload);
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<AuthResponse> => {
    // UserController trả về AuthResponse trực tiếp trong body (không bọc ResponseWrapper).
    const response = await apiClient.put<AuthResponse>("/api/v1/users/profile", payload);
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>("/api/v1/users/password", payload);
    return response.data;
  },
};
