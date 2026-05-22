"use client";

import Link from "next/link";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, ShieldCheck, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { authService } from "@/services/auth-service";
import { GuestGuard } from "@/components/auth/guest-guard";

const NEW_PASSWORD_MIN_LENGTH = 8;
const RESEND_COOLDOWN_SECONDS = 60;

const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, "Mã OTP phải đúng 6 chữ số")
      .regex(/^\d{6}$/, "Mã OTP chỉ được chứa chữ số"),
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

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    if (!email || countdown > 0) return;
    setIsResending(true);
    try {
      await authService.forgotPassword(email);
      toast.success("Mã OTP mới đã được gửi vào email của bạn.");
      setCountdown(RESEND_COOLDOWN_SECONDS);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không thể gửi lại mã lúc này."));
    } finally {
      setIsResending(false);
    }
  }, [email, countdown]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!email) {
      toast.error("Thiếu thông tin email.");
      return;
    }
    try {
      await authService.resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
      router.push("/auth/login");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300 backdrop-blur-md">
          <p className="text-base font-semibold">Thiếu thông tin email. Vui lòng thử lại.</p>
          <Link
            href="/auth/forgot-password"
            className="mt-4 inline-block font-semibold text-[#00FF85] hover:underline"
          >
            Quay về trang quên mật khẩu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00FF85]/10 ring-2 ring-[#00FF85]/30">
              <ShieldCheck className="text-[#00FF85]" size={28} />
            </div>
          </div>
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-wider text-[#00FF85]">
            NHẬP MÃ XÁC NHẬN
          </h1>
          <p className="mt-2 text-sm text-white/60">Chúng tôi đã gửi mã 6 chữ số đến</p>
          {/* Email badge */}
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <Mail size={14} className="text-[#00FF85]" />
            <span className="text-sm font-medium text-white/80">{email}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* OTP Input */}
          <div className="flex flex-col gap-1">
            <label className="pl-1 text-xs font-semibold uppercase tracking-widest text-white/50">
              Mã OTP
            </label>
            <input
              {...register("otp")}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="• • • • • •"
              className={`w-full rounded-xl border py-3 text-center text-2xl font-bold tracking-[0.5em] text-white placeholder-white/20 outline-none transition focus:bg-white/10 ${
                errors.otp
                  ? "border-red-500 bg-red-500/10"
                  : "border-white/10 bg-white/5 focus:border-[#00FF85]"
              }`}
            />
            {errors.otp && (
              <p className="pl-1 text-xs font-medium text-red-400">{errors.otp.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="pl-1 text-xs font-semibold uppercase tracking-widest text-white/50">
              Mật khẩu mới
            </label>
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="pl-1 text-xs font-semibold uppercase tracking-widest text-white/50">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                <Lock size={18} />
              </div>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Nhập lại mật khẩu"
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

        {/* Resend OTP */}
        <div className="mt-5 text-center text-sm text-white/50">
          Không nhận được mã?{" "}
          {countdown > 0 ? (
            <span className="text-white/40">
              Gửi lại sau <span className="font-semibold text-[#00FF85]">{countdown}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-[#00FF85] hover:underline disabled:opacity-50"
            >
              {isResending ? "Đang gửi..." : "Gửi lại mã"}
            </button>
          )}
        </div>

        <p className="mt-3 text-center text-sm text-white/50">
          <Link
            href="/auth/forgot-password"
            className="font-semibold text-white/60 hover:text-[#00FF85]"
          >
            ← Đổi email khác
          </Link>
        </p>
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
