import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/AppProvider";
import { Toaster } from "sonner";
import GlobalAuthListener from "@/components/auth/GlobalAuthListener";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
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
        </AppProvider>
      </body>
    </html>
  );
}
