"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserResponse, AdminUserUpdateRequest } from "@/types/admin-user";

const MAX_NAME_LENGTH = 120;
const ROLE_ID_STAFF = "2";
const ROLE_ID_CUSTOMER = "3";

const formSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ và tên không được để trống")
    .max(MAX_NAME_LENGTH, "Họ và tên quá dài"),
  phone: z
    .string()
    .regex(
      /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
      "Số điện thoại không hợp lệ",
    )
    .nullable()
    .or(z.literal("")),
  roleId: z.string().min(1, "Vui lòng chọn vai trò"),
});

interface UserEditModalProps {
  user: UserResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AdminUserUpdateRequest) => Promise<void>;
  isLoading: boolean;
}

export function UserEditModal({ user, isOpen, onClose, onSave, isLoading }: UserEditModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      roleId: "",
    },
  });

  useEffect(() => {
    if (user) {
      // Map current user roles to roleId
      // ROLE_ADMIN = 1 (but we don't allow editing or assigning)
      // ROLE_STAFF = 2
      // ROLE_CUSTOMER = 3
      let currentRoleId = ROLE_ID_CUSTOMER;
      if (user.roles.includes("ROLE_STAFF")) currentRoleId = ROLE_ID_STAFF;

      form.reset({
        fullName: user.fullName,
        phone: user.phone || "",
        roleId: currentRoleId,
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSave({
      fullName: values.fullName,
      phone: values.phone || null,
      roleId: parseInt(values.roleId),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0A0A0A] border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          <p className="text-sm text-white/50">
            Cập nhật thông tin chi tiết cho tài khoản:{" "}
            <span className="text-[#D4AF37]">{user?.username}</span>
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white/5 border-white/10 focus:border-[#D4AF37]/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      className="bg-white/5 border-white/10 focus:border-[#D4AF37]/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 focus:border-[#D4AF37]/50">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                      <SelectItem value={ROLE_ID_CUSTOMER}>Khách hàng (CUSTOMER)</SelectItem>
                      <SelectItem value={ROLE_ID_STAFF}>Nhân viên (STAFF)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="text-white hover:bg-white/5"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
