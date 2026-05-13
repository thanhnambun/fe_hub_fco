"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const isAdmin = profile?.roles?.includes("ROLE_ADMIN");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0E1A]">
        <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  console.log(1323333);

  return <div className="min-h-screen bg-[#0D1117] text-white">{children}</div>;
}
