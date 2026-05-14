"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { X, Lock, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AUTH_REQUIRED_EVENT,
  getAuthRequiredMessage,
  isAuthRequiredEvent,
} from "@/lib/auth-events";
import { handleAuthError } from "@/lib/auth-error-handler";

const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập tài khoản"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const TOAST_ERROR_MS = 4000;
const DEFAULT_AUTH_MESSAGE = "Vui lòng đăng nhập để tiếp tục.";

export default function GlobalAuthListener() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleAuthRequired = useCallback((event: Event) => {
    if (!isAuthRequiredEvent(event)) {
      return;
    }
    const message = getAuthRequiredMessage(event, DEFAULT_AUTH_MESSAGE);
    toast.error(message, { duration: TOAST_ERROR_MS });
    setShowLoginModal(true);
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
    return () => window.removeEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
  }, [handleAuthRequired]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await authService.login(data);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Đăng nhập thành công!", {
        description: "Chào mừng bạn quay trở lại với FCO HUB.",
      });
      setShowLoginModal(false);
      reset();
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  if (!showLoginModal) return null;

  const handleClose = () => {
    setShowLoginModal(false);
    reset();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0D1117] p-8 shadow-[0_0_50px_-12px_rgba(0,255,133,0.2)]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-white/40 transition-colors hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00FF85]/10 text-[#00FF85]">
            <Lock size={24} />
          </div>
          <h2 className="font-[var(--font-oswald)] text-2xl font-bold tracking-wider text-white">
            TIẾP TỤC TRẢI NGHIỆM
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ của FCO HUB
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-widest text-[#D4AF37]">
              Tài khoản
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                {...register("identifier")}
                type="text"
                placeholder="Username hoặc Email"
                className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:bg-white/10 ${
                  errors.identifier
                    ? "border-red-500/50"
                    : "border-white/10 focus:border-[#D4AF37]/50"
                }`}
              />
            </div>
            {errors.identifier && (
              <p className="text-[10px] text-red-400">{errors.identifier.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-widest text-[#D4AF37]">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all focus:bg-white/10 ${
                  errors.password
                    ? "border-red-500/50"
                    : "border-white/10 focus:border-[#D4AF37]/50"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-400">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8B2E] py-3.5 font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="mx-auto animate-spin" size={20} />
            ) : (
              "ĐĂNG NHẬP NGAY"
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              handleClose();
              router.push("/auth/register");
            }}
            className="text-xs text-white/40 transition-colors hover:text-[#00FF85]"
          >
            Chưa có tài khoản? Đăng ký ngay
          </button>
        </div>

        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#00FF85]/5 blur-3xl" />
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#00FF85]/5 blur-3xl" />
      </div>
    </div>
  );
}
