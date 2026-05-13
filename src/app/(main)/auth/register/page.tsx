"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Mail, Phone, Loader2, BadgeCheck } from "lucide-react";
import { authService } from "@/services/auth-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { GuestGuard } from "@/components/auth/GuestGuard";

// --- Zod Schema (khớp CHÍNH XÁC với RegisterRequest.java) ---
const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Họ tên không được để trống" })
    .max(120, { message: "Họ tên tối đa 120 ký tự" }),

  username: z
    .string()
    .min(4, { message: "Tên đăng nhập phải từ 4 đến 50 ký tự" })
    .max(50, { message: "Tên đăng nhập phải từ 4 đến 50 ký tự" }),

  email: z
    .string()
    .min(1, { message: "Email không được để trống" })
    .email({ message: "Email không đúng định dạng" }),

  phone: z
    .string()
    .max(20, { message: "Số điện thoại tối đa 20 ký tự" })
    .optional()
    .or(z.literal("")),

  password: z
    .string()
    .min(8, { message: "Mật khẩu phải từ 8 đến 64 ký tự" })
    .max(64, { message: "Mật khẩu phải từ 8 đến 64 ký tự" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 chữ số",
    }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// --- Helper component: Input Field ---
function FormField({
  label,
  icon,
  error,
  children,
}: {
  label?: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
          {icon}
        </div>
        {children}
      </div>
      {error && <p className="pl-1 text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:bg-white/10 ${
      hasError
        ? "border-red-500 bg-red-500/10"
        : "border-white/10 bg-white/5 focus:border-[#00FF85]"
    }`;

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await authService.register({
        ...data,
        phone: data.phone || "",
      });

      setSuccess(true);
      toast.success("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      // Nếu backend trả về field errors (vd: username đã tồn tại)
      if (err?.errors && typeof err.errors === "object") {
        Object.entries(err.errors).forEach(([field, message]) => {
          setError(field as keyof RegisterFormValues, {
            type: "server",
            message: message as string,
          });
        });
      }
      // Luôn hiện toast với message chung
      toast.error(err?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <GuestGuard>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-wider text-[#00FF85]">
            TẠO TÀI KHOẢN
          </h1>
          <p className="mt-2 text-sm text-white/60">Gia nhập cộng đồng người chơi xuất sắc</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
            <BadgeCheck size={64} className="text-[#00FF85]" />
            <h2 className="text-xl font-bold text-white">Đăng ký thành công!</h2>
            <p className="text-sm text-white/60">Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Họ và tên */}
            <FormField icon={<User size={18} />} error={errors.fullName?.message}>
              <input
                {...register("fullName")}
                type="text"
                placeholder="Họ và tên"
                className={inputClass(!!errors.fullName)}
              />
            </FormField>

            {/* Username */}
            <FormField icon={<User size={18} />} error={errors.username?.message}>
              <input
                {...register("username")}
                type="text"
                placeholder="Tên đăng nhập (4-50 ký tự)"
                className={inputClass(!!errors.username)}
              />
            </FormField>

            {/* Email */}
            <FormField icon={<Mail size={18} />} error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                placeholder="Địa chỉ Email"
                className={inputClass(!!errors.email)}
              />
            </FormField>

            {/* Phone */}
            <FormField icon={<Phone size={18} />} error={errors.phone?.message}>
              <input
                {...register("phone")}
                type="tel"
                placeholder="Số điện thoại (không bắt buộc)"
                className={inputClass(!!errors.phone)}
              />
            </FormField>

            {/* Password */}
            <FormField icon={<Lock size={18} />} error={errors.password?.message}>
              <input
                {...register("password")}
                type="password"
                placeholder="Mật khẩu (ít nhất 8 ký tự, 1 chữ cái, 1 số)"
                className={inputClass(!!errors.password)}
              />
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex items-center justify-center rounded-xl bg-[#00FF85] py-3 font-bold text-black transition-all hover:shadow-[0_0_15px_rgba(0,255,133,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "ĐĂNG KÝ"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-white/60">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="font-semibold text-[#00FF85] hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
    </GuestGuard>
  );
}
