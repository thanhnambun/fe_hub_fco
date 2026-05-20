"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth-service";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  Globe,
  LogOut,
  Crown,
  Menu,
  X,
  CreditCard,
  Calendar,
  Flag,
  Trophy,
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAdminOrStaff = profile?.roles?.some((role) =>
    ["ROLE_ADMIN", "ROLE_STAFF"].includes(role),
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
    if (!isLoading && isAuthenticated && !isAdminOrStaff) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isAdminOrStaff, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0E1A]">
        <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdminOrStaff) {
    return null;
  }

  const isAdmin = profile?.roles?.includes("ROLE_ADMIN");

  const navItems = [
    {
      title: "Bảng điều khiển",
      href: "/admin",
      icon: LayoutDashboard,
    },
    ...(isAdmin
      ? [
          {
            title: "Quản lý người dùng",
            href: "/admin/users",
            icon: Users,
          },
        ]
      : []),
    {
      title: "Cầu thủ gốc",
      href: "/admin/players",
      icon: Users,
    },
    {
      title: "Thẻ Cards",
      href: "/admin/cards",
      icon: CreditCard,
    },
    {
      title: "Mùa giải",
      href: "/admin/seasons",
      icon: Calendar,
    },
    {
      title: "Quốc gia",
      href: "/admin/nations",
      icon: Flag,
    },
    {
      title: "Giải đấu",
      href: "/admin/leagues",
      icon: Trophy,
    },
    {
      title: "Quản lý đơn hàng",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    ...(isAdmin
      ? [
          {
            title: "Cài đặt hệ thống",
            href: "/admin/settings",
            icon: Settings,
          },
        ]
      : []),
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      queryClient.clear();
      router.push("/auth/login");
    } catch {
      queryClient.clear();
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0E1A] text-white">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#0B0F19]/90 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-[#D4AF37]" />
          <span className="font-[var(--font-oswald)] text-lg font-bold tracking-wider text-white">
            FCO ADMIN
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar - Desktop & Mobile */}
      <aside
        className={`fixed bottom-0 top-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0B0F19]/95 backdrop-blur-md transition-all duration-300 lg:sticky lg:z-30 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Logo */}
        <div className="hidden h-20 items-center gap-3 border-b border-white/10 px-6 lg:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <Crown size={22} />
          </div>
          <div>
            <h1 className="font-[var(--font-oswald)] text-lg font-bold tracking-wider text-white">
              FCO PORTAL
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#00FF85] font-semibold">
              Admin Panel
            </p>
          </div>
        </div>

        {/* User Profile Summary */}
        <div className="border-b border-white/10 px-6 py-5 mt-16 lg:mt-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 font-bold text-[#D4AF37] border border-white/10">
              {profile?.fullName?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <div className="overflow-hidden font-sans">
              <p className="truncate text-sm font-semibold text-white">{profile?.fullName}</p>
              <p className="truncate text-[10px] text-white/50">@{profile?.username}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 font-sans">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-4 border-[#D4AF37]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-[#D4AF37]" : "text-white/40"} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="space-y-1.5 border-t border-white/10 p-4 font-sans">
          <Link
            href="/"
            className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <Globe size={18} className="text-white/40" />
            Quay lại trang chủ
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pt-16 lg:pt-0">
        <main className="min-h-screen">{children}</main>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  );
}
