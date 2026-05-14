"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { GuestGuard } from "@/components/auth/guest-guard";

const NEW_PASSWORD_MIN_LENGTH = 8;

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(NEW_PASSWORD_MIN_LENGTH, `Mật khẩu phải có ít nhất ${NEW_PASSWORD_MIN_LENGTH} ký tự`)
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Mật khẩu phải chứa ít nhất 1 chữ và 1 số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: string }).message ?? "Không thể đặt lại mật khẩu.");
  }
  return "Không thể đặt lại mật khẩu.";
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Token không hợp lệ hoặc bị thiếu.");
      return;
    }

    try {
      await authService.resetPassword({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
      router.push("/auth/login");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300 backdrop-blur-md">
          <p className="text-base font-semibold">Token không hợp lệ hoặc bị thiếu.</p>
          <Link
            href="/auth/forgot-password"
            className="mt-4 inline-block font-semibold text-[#00FF85] hover:underline"
          >
            Gửi lại yêu cầu quên mật khẩu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-wider text-[#00FF85]">
            ĐẶT LẠI MẬT KHẨU
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Nhập mật khẩu mới để tiếp tục sử dụng tài khoản
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                <Lock size={18} />
              </div>
              <input
                {...register("newPassword")}
                type="password"
                placeholder="Mật khẩu mới"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                  errors.newPassword
                    ? "border-red-500 bg-red-500/10"
                    : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                }`}
              />
            </div>
            {errors.newPassword && (
              <p className="pl-1 text-xs font-medium text-red-400">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                <Lock size={18} />
              </div>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                  errors.confirmPassword
                    ? "border-red-500 bg-red-500/10"
                    : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="pl-1 text-xs font-medium text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex items-center justify-center rounded-xl bg-[#00FF85] py-3 font-bold text-black transition-all hover:shadow-[0_0_15px_rgba(0,255,133,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "CẬP NHẬT MẬT KHẨU"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <GuestGuard>
      <Suspense
        fallback={
          <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#00FF85]" />
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </GuestGuard>
  );
}
