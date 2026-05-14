export interface UserResponse {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string | null;
  status: boolean;
  roles: string[];
  createdAt: string;
}

export interface PaginationResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminUserUpdateRequest {
  fullName: string;
  phone: string | null;
  roleId: number;
}
