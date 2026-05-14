"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ACCOUNT_LOCKED_EVENT = "ACCOUNT_LOCKED_EVENT";

const INITIAL_COUNTDOWN = 10;
const TIMER_INTERVAL = 1000;

const FULL_CIRCLE_DEGREES = 360;

export function LockedAccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const queryClient = useQueryClient();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(() => {
    // 1. Sync across tabs
    localStorage.setItem("fco_hub_force_logout", "true");

    // 2. Clear auth cache so guards don't redirect back
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.removeQueries({ queryKey: ["auth", "me"] });

    // 3. Optional: Call logout API to clear server cookies (don't wait for it)
    import("@/services/auth-service").then(({ authService }) =>
      authService.logout().catch(() => {}),
    );

    // 4. Hard redirect to login to clear all state
    window.location.href = "/auth/login";
  }, [queryClient]);

  // Handle Event & Storage Sync
  useEffect(() => {
    const handleLocked = () => {
      setCountdown(INITIAL_COUNTDOWN); // Reset countdown on open
      setIsOpen(true);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fco_hub_force_logout" && e.newValue === "true") {
        handleLogout();
      }
    };

    window.addEventListener(ACCOUNT_LOCKED_EVENT, handleLocked);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(ACCOUNT_LOCKED_EVENT, handleLocked);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [handleLogout]);

  // Timer Logic
  useEffect(() => {
    if (isOpen) {
      if (countdown > 0) {
        timerRef.current = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, TIMER_INTERVAL);
      } else {
        handleLogout();
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, countdown, handleLogout]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent manual closing by user
        if (!open && isOpen) return;
        setIsOpen(open);
      }}
    >
      <DialogContent
        className="bg-[#0A0A0A] border-red-500/30 text-white sm:max-w-[425px] outline-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-red-500">
            TÀI KHOẢN ĐÃ BỊ KHÓA!
          </DialogTitle>
          <DialogDescription className="text-white/70 text-base leading-relaxed">
            Hệ thống phát hiện tài khoản của bạn đã bị quản trị viên khóa vì vi phạm chính sách hoặc
            lý do bảo mật.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col items-center gap-6">
          <div className="relative flex h-24 w-24 items-center justify-center" aria-live="polite">
            <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin-slow"
              style={{
                transition: "all 1s linear",
                transform: `rotate(${(INITIAL_COUNTDOWN - countdown) * (FULL_CIRCLE_DEGREES / INITIAL_COUNTDOWN)}deg)`,
              }}
            ></div>
            <span className="text-4xl font-bold text-red-500">{countdown}</span>
          </div>

          <p className="text-sm text-white/50 text-center italic">
            Bạn sẽ tự động đăng xuất và quay lại trang đăng nhập sau khi kết thúc đếm ngược.
          </p>

          <Button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold h-12 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Đăng xuất ngay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
