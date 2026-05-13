"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, Phone, Mail, AtSign, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth-service";

/** Khớp validation backend UpdateProfileRequest */
const FULL_NAME_MAX = 120;
const PHONE_MAX = 20;

const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ tên không được để trống")
    .max(FULL_NAME_MAX, `Họ tên tối đa ${FULL_NAME_MAX} ký tự`),
  phone: z
    .string()
    .regex(/^$|^0[35789]\d{8}$/, "Số điện thoại không hợp lệ (Phải bắt đầu bằng 03, 05, 07, 08, 09 và gồm 10 số)")
    .optional()
    .or(z.literal("")),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải từ 8 ký tự")
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Mật khẩu mới phải chứa ít nhất 1 chữ cái và 1 chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: string }).message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
  }
  return "Có lỗi xảy ra. Vui lòng thử lại.";
};

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profile, isAuthenticated, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "" },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Đã cập nhật hồ sơ thành công.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const passwordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      resetPassword();
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    const phoneTrimmed = data.phone?.trim();
    updateMutation.mutate({
      fullName: data.fullName.trim(),
      ...(phoneTrimmed ? { phone: phoneTrimmed } : { phone: "" }),
    });
  };

  const onSubmitPassword = (data: PasswordFormValues) => {
    passwordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
        <Loader2 className="h-10 w-10 animate-spin text-[#00FF85]" aria-label="Đang tải" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
      <div className="text-center">
        <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-wider text-[#00FF85]">
          QUẢN LÝ TÀI KHOẢN
        </h1>
        <p className="mt-2 text-sm text-white/60">Cập nhật thông tin cá nhân và bảo mật tài khoản của bạn.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* CỘT 1: THÔNG TIN CÁ NHÂN */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md h-full">
            <h2 className="mb-6 font-[var(--font-oswald)] text-xl font-bold tracking-wider text-[#00FF85]">
              HỒ SƠ CÁ NHÂN
            </h2>
            
            <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <AtSign size={16} className="shrink-0 text-white/40" />
                <span className="text-white/50">Username</span>
                <span className="truncate font-medium text-white">{profile.username}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Mail size={16} className="shrink-0 text-white/40" />
                <span className="text-white/50">Email</span>
                <span className="truncate font-medium text-white">{profile.email}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="fullName" className="text-xs font-medium uppercase tracking-wide text-white/50">
                  Họ và tên
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                    <User size={18} />
                  </div>
                  <input
                    id="fullName"
                    {...register("fullName")}
                    type="text"
                    autoComplete="name"
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                      errors.fullName ? "border-red-500 bg-red-500/10" : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                    }`}
                    placeholder="Nhập họ tên"
                  />
                </div>
                {errors.fullName ? (
                  <p className="pl-1 text-xs font-medium text-red-400">{errors.fullName.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-xs font-medium uppercase tracking-wide text-white/50">
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                    <Phone size={18} />
                  </div>
                  <input
                    id="phone"
                    {...register("phone")}
                    type="tel"
                    autoComplete="tel"
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                      errors.phone ? "border-red-500 bg-red-500/10" : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                    }`}
                    placeholder="Ví dụ: 0912345678"
                  />
                </div>
                {errors.phone ? <p className="pl-1 text-xs font-medium text-red-400">{errors.phone.message}</p> : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || updateMutation.isPending}
                className="mt-2 flex items-center justify-center rounded-xl bg-[#00FF85] py-3 font-bold text-black transition-all hover:shadow-[0_0_15px_rgba(0,255,133,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting || updateMutation.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "LƯU THÔNG TIN"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* CỘT 2: ĐỔI MẬT KHẨU */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md h-full">
            <h2 className="mb-6 font-[var(--font-oswald)] text-xl font-bold tracking-wider text-white">
              BẢO MẬT & MẬT KHẨU
            </h2>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="oldPassword" className="text-xs font-medium uppercase tracking-wide text-white/50">
                  Mật khẩu cũ
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                    <Lock size={18} />
                  </div>
                  <input
                    id="oldPassword"
                    {...registerPassword("oldPassword")}
                    type="password"
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                      passwordErrors.oldPassword ? "border-red-500 bg-red-500/10" : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                    }`}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                {passwordErrors.oldPassword && <p className="pl-1 text-xs font-medium text-red-400">{passwordErrors.oldPassword.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="newPassword" className="text-xs font-medium uppercase tracking-wide text-white/50">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                    <Lock size={18} />
                  </div>
                  <input
                    id="newPassword"
                    {...registerPassword("newPassword")}
                    type="password"
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                      passwordErrors.newPassword ? "border-red-500 bg-red-500/10" : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                    }`}
                    placeholder="Ít nhất 8 ký tự, 1 chữ, 1 số"
                  />
                </div>
                {passwordErrors.newPassword && <p className="pl-1 text-xs font-medium text-red-400">{passwordErrors.newPassword.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-xs font-medium uppercase tracking-wide text-white/50">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    {...registerPassword("confirmPassword")}
                    type="password"
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                      passwordErrors.confirmPassword ? "border-red-500 bg-red-500/10" : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                    }`}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                {passwordErrors.confirmPassword && <p className="pl-1 text-xs font-medium text-red-400">{passwordErrors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmittingPassword || passwordMutation.isPending}
                className="mt-2 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 py-3 font-bold text-white transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmittingPassword || passwordMutation.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "CẬP NHẬT MẬT KHẨU"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link href="/" className="text-[#00FF85] text-sm hover:underline flex items-center justify-center gap-2">
          <span>&larr;</span> Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
