import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/app-provider";
import { Toaster } from "sonner";
import GlobalAuthListener from "@/components/auth/global-auth-listener";
import WebSocketListener from "@/components/auth/websocket-listener";
import { LockedAccountModal } from "@/components/locked-account-modal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "FCO HUB - FC Online Hub & Trading",
  description: "Hệ sinh thái FC Online toàn diện cho người chơi và trader.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col bg-[#0A0E1A] text-white">
        <AppProvider>
          {children}
          <Toaster position="top-right" richColors />
          <GlobalAuthListener />
          <WebSocketListener />
          <LockedAccountModal />
        </AppProvider>
      </body>
    </html>
  );
}
