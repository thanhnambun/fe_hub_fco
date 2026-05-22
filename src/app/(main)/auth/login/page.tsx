"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { GuestGuard } from "@/components/auth/guest-guard";
import { handleAuthError } from "@/lib/auth-error-handler";

// --- Zod Schema (khớp với LoginRequest.java) ---
const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Vui lòng nhập Username hoặc Email" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await authService.login(data);
      // Cookie được backend set tự động — không cần lưu gì ở đây
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Đăng nhập thành công! Chào mừng trở lại 🎉");
      router.push("/");
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  return (
    <GuestGuard>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-wider text-[#00FF85]">
              ĐĂNG NHẬP
            </h1>
            <p className="mt-2 text-sm text-white/60">Tham gia hệ sinh thái FCO HUB</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Identifier */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                  <User size={18} />
                </div>
                <input
                  {...register("identifier")}
                  type="text"
                  placeholder="Username hoặc Email"
                  className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                    errors.identifier
                      ? "border-red-500 bg-red-500/10"
                      : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                  }`}
                />
              </div>
              {errors.identifier && (
                <p className="pl-1 text-xs font-medium text-red-400">{errors.identifier.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                  <Lock size={18} />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Mật khẩu"
                  className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                    errors.password
                      ? "border-red-500 bg-red-500/10"
                      : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="pl-1 text-xs font-medium text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex items-center justify-center rounded-xl bg-[#00FF85] py-3 font-bold text-black transition-all hover:shadow-[0_0_15px_rgba(0,255,133,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "VÀO HỆ THỐNG"}
            </button>
          </form>

          <p className="mt-4 text-right text-sm">
            <Link href="/auth/forgot-password" className="text-white/70 hover:text-[#00FF85]">
              Quên mật khẩu?
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-white/60">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="font-semibold text-[#00FF85] hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </GuestGuard>
  );
}
