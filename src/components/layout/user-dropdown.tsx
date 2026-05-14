"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { User, LogOut, Wallet, ChevronDown, Crown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth-service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function useIsClient() {
  return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
}

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useIsClient();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isClient || !isAuthenticated || !profile) return null;

  const isAdmin = profile.roles?.includes("ROLE_ADMIN");
  const displayName = profile.fullName || profile.username;
  const formattedBalance = new Intl.NumberFormat("vi-VN").format(profile.balance || 0);

  const handleLogout = async () => {
    try {
      await authService.logout();
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      toast.success("Đã đăng xuất thành công");
      setIsOpen(false);
      window.location.href = "/";
    } catch {
      toast.error("Lỗi khi đăng xuất");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md transition-all hover:bg-white/10 sm:flex">
          <Wallet size={14} className="text-[#D4AF37]" />
          <span className="text-xs font-bold tracking-tight">
            <span className="text-[#D4AF37]">{formattedBalance}</span>
            <span className="ml-1 text-white/60">BP</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1 pr-3 transition-all hover:border-[#D4AF37]/50 hover:bg-white/20"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA8B2E] text-sm font-bold text-black shadow-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden max-w-[100px] truncate text-sm font-medium text-white/90 lg:block">
            {displayName}
          </span>
          <ChevronDown
            size={14}
            className={`text-white/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#0D1117]/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="border-b border-white/5 bg-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Tài khoản của bạn
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{displayName}</p>
            <p className="truncate text-xs text-white/40">{profile.email}</p>
          </div>

          <div className="p-2">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="group mb-1 flex items-center gap-3 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-3 transition-all hover:bg-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37]/20 group-hover:bg-black/20">
                  <Crown size={18} className="text-[#D4AF37] group-hover:text-black" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#D4AF37] group-hover:text-black">
                    Quản trị hệ thống
                  </p>
                  <p className="text-[10px] text-[#D4AF37]/60 group-hover:text-black/60">
                    Admin Portal Exclusive
                  </p>
                </div>
              </Link>
            )}

            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              <User size={18} className="text-white/40" />
              <span>Hồ sơ cá nhân</span>
            </Link>

            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              <Wallet size={18} className="text-white/40" />
              <span>Lịch sử giao dịch</span>
            </Link>

            <div className="my-2 border-t border-white/5" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-all hover:bg-red-500/10"
            >
              <LogOut size={18} />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
