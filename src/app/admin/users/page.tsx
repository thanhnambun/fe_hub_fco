"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  UserCog,
  Lock,
  Unlock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminUserService } from "@/services/admin-user-service";
import { UserResponse, PaginationResponse, AdminUserUpdateRequest } from "@/types/admin-user";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { UserEditModal } from "@/components/admin/user-edit-modal";
import { ConfirmActionModal } from "@/components/admin/confirm-action-modal";
import { useAuth } from "@/hooks/use-auth";

export default function AdminUsersPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.roles?.includes("ROLE_ADMIN");

  const [data, setData] = useState<PaginationResponse<UserResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const PAGE_SIZE = 10;
  const DEBOUNCE_DELAY = 500;
  const SKELETON_ROWS = 5;
  const SKELETON_COLS = 6;
  const ROOT_ADMIN_ID = 1;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminUserService.getUsers(page, PAGE_SIZE, search);
      setData(result);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không thể tải danh sách người dùng"));
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleEdit = (user: UserResponse) => {
    if (user.id === ROOT_ADMIN_ID) {
      toast.error("Không thể chỉnh sửa Root Admin");
      return;
    }
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = (user: UserResponse) => {
    if (user.id === ROOT_ADMIN_ID) {
      toast.error("Không thể khóa Root Admin");
      return;
    }
    setSelectedUser(user);
    setIsStatusModalOpen(true);
  };

  const onUpdateUser = async (updateData: AdminUserUpdateRequest) => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      await adminUserService.updateUser(selectedUser.id, updateData);
      toast.success("Cập nhật người dùng thành công");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Cập nhật thất bại"));
    } finally {
      setIsProcessing(false);
    }
  };

  const onToggleStatusConfirm = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      await adminUserService.toggleStatus(selectedUser.id);
      toast.success(selectedUser.status ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");
      setIsStatusModalOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Thao tác thất bại"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Header & Search */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-wider text-white">
            QUẢN LÝ NGƯỜI DÙNG
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Xem danh sách, phân quyền và kiểm soát trạng thái tài khoản.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            placeholder="Tìm theo tên, email, username..."
            className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/30 focus:border-[#D4AF37]/50"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60 font-semibold">ID</TableHead>
              <TableHead className="text-white/60 font-semibold">Thông tin</TableHead>
              <TableHead className="text-white/60 font-semibold">Vai trò</TableHead>
              <TableHead className="text-white/60 font-semibold">Trạng thái</TableHead>
              <TableHead className="text-white/60 font-semibold">Ngày tạo</TableHead>
              <TableHead className="text-right text-white/60 font-semibold">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(SKELETON_ROWS)].map((_, i) => (
                <TableRow key={i} className="border-white/10">
                  {[...Array(SKELETON_COLS)].map((__, j) => (
                    <TableCell key={j}>
                      <div className="h-5 w-full animate-pulse rounded bg-white/5" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-white/40">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : (
              data?.content.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-white/10 hover:bg-white/[0.02] transition-colors"
                >
                  <TableCell className="font-mono text-white/50">#{user.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{user.fullName}</span>
                      <span className="text-xs text-white/40">{user.email}</span>
                      <span className="text-[10px] font-mono text-[#D4AF37]/70 italic">
                        @{user.username}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge
                          key={role}
                          variant="outline"
                          className={`text-[10px] border-white/10 px-1.5 py-0 ${
                            role === "ROLE_ADMIN"
                              ? "bg-red-500/10 text-red-400"
                              : role === "ROLE_STAFF"
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-[#00FF85]/10 text-[#00FF85]"
                          }`}
                        >
                          {role.replace("ROLE_", "")}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        user.status
                          ? "bg-[#00FF85]/10 text-[#00FF85]"
                          : "bg-red-500/10 text-red-400"
                      } border-none font-normal`}
                    >
                      {user.status ? "Active" : "Locked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-white/40">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/40 hover:text-white hover:bg-white/10"
                        >
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#0A0A0A] border-white/10 text-white"
                      >
                        {isAdmin && (
                          <DropdownMenuItem
                            onClick={() => handleEdit(user)}
                            className="flex items-center gap-2 cursor-pointer focus:bg-white/5"
                            disabled={user.id === ROOT_ADMIN_ID}
                          >
                            <UserCog size={16} className="text-blue-400" />
                            Sửa thông tin
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user)}
                          className="flex items-center gap-2 cursor-pointer focus:bg-white/5 text-red-400 focus:text-red-300"
                          disabled={user.id === ROOT_ADMIN_ID}
                        >
                          {user.status ? (
                            <>
                              <Lock size={16} /> Khóa tài khoản
                            </>
                          ) : (
                            <>
                              <Unlock size={16} className="text-[#00FF85]" /> Mở khóa tài khoản
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <p className="text-xs text-white/40">
              Hiển thị {data.page * data.size + 1} -{" "}
              {Math.min((data.page + 1) * data.size, data.totalElements)} trên tổng số{" "}
              {data.totalElements}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 0 || isLoading}
                className="bg-transparent border-white/10 text-white hover:bg-white/5"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= data.totalPages - 1 || isLoading}
                className="bg-transparent border-white/10 text-white hover:bg-white/5"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Security Notice for Root Admin */}
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">
        <ShieldAlert size={20} />
        <p className="text-xs">
          <strong>Lưu ý bảo mật:</strong> Tài khoản Root Admin (#1) được bảo vệ hệ thống. Không thể
          chỉnh sửa thông tin, phân lại quyền hoặc khóa tài khoản này thông qua giao diện quản trị.
        </p>
      </div>

      {/* Modals */}
      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onUpdateUser}
        isLoading={isProcessing}
      />

      <ConfirmActionModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={onToggleStatusConfirm}
        isLoading={isProcessing}
        title={selectedUser?.status ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        description={
          selectedUser?.status
            ? `Bạn có chắc chắn muốn khóa tài khoản của ${selectedUser.fullName}? Người dùng này sẽ bị logout ngay lập tức và không thể đăng nhập cho đến khi được mở khóa.`
            : `Mở khóa tài khoản cho ${selectedUser?.fullName}?`
        }
        confirmText={selectedUser?.status ? "Khóa ngay" : "Mở khóa"}
        variant={selectedUser?.status ? "destructive" : "default"}
      />
    </div>
  );
}
