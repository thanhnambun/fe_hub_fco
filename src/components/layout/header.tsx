"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, User, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth-service";
import { toast } from "sonner";
import UserDropdown from "./user-dropdown";

type NavItem = {
  label: string;
  href: string;
};
const NAV_ITEMS: NavItem[] = [
  { label: "Cầu thủ", href: "/players" },
  { label: "Đội hình", href: "/squad-builder" },
  { label: "Đánh giá", href: "/reviews" },
  { label: "Thị trường", href: "/marketplace" },
];

export function Navbar() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const activePath = useMemo(() => pathname ?? "", [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return activePath === "/";
    }
    return activePath === href || activePath.startsWith(href);
  };

  const linkClassName = (href: string) =>
    `text-sm transition-colors ${isActive(href) ? "text-[#00FF85]" : "text-white/80 hover:text-[#00FF85]"}`;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Dù API lỗi vẫn clear UI
    }
    queryClient.removeQueries({ queryKey: ["auth", "me"] });
    setMobileOpen(false);
    toast.success("Đã đăng xuất thành công");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0A0E1A]/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-[var(--font-oswald)] text-xl tracking-[0.18em] text-[#00FF85]"
          >
            FCO HUB
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={linkClassName(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {!isLoading && !isAuthenticated ? (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-white/85 transition-colors hover:text-[#00FF85]"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-[#00FF85] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-95"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <UserDropdown />
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border border-white/10 p-2 text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-gray-800 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={linkClassName(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-3">
            {isLoading ? (
              <div className="h-10 w-full animate-pulse rounded-lg bg-white/10" />
            ) : !isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-center text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg bg-[#00FF85] py-2 text-center text-sm font-semibold text-black transition hover:brightness-95 hover:shadow-[0_0_10px_rgba(0,255,133,0.3)]"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="flex w-full flex-col gap-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <User size={16} />
                  Hồ sơ
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
