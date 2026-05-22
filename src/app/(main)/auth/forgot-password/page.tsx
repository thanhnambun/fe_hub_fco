"use client";

import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { GuestGuard } from "@/components/auth/guest-guard";

import { getErrorMessage } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    try {
      await authService.forgotPassword(email);
      toast.success("Mã OTP đã được gửi vào email của bạn. Vui lòng kiểm tra hộp thư.");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không thể gửi yêu cầu lúc này."));
    }
  };

  return (
    <GuestGuard>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-wider text-[#00FF85]">
              QUÊN MẬT KHẨU
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Nhập email — chúng tôi sẽ gửi mã xác nhận 6 chữ số
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                  <Mail size={18} />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
                    errors.email
                      ? "border-red-500 bg-red-500/10"
                      : "border-white/10 bg-white/5 focus:border-[#00FF85]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="pl-1 text-xs font-medium text-red-400">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex items-center justify-center rounded-xl bg-[#00FF85] py-3 font-bold text-black transition-all hover:shadow-[0_0_15px_rgba(0,255,133,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "GỬI MÃ XÁC NHẬN"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Nhớ mật khẩu rồi?{" "}
            <Link href="/auth/login" className="font-semibold text-[#00FF85] hover:underline">
              Quay về đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </GuestGuard>
  );
}
