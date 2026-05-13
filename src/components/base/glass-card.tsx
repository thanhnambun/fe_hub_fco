import type { PropsWithChildren } from "react";

type GlassCardProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl shadow-deep transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  );
}
