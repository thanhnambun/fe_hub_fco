"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0A0E1A] px-6 text-white">
        <h1 className="font-[var(--font-oswald)] text-2xl font-bold tracking-wide text-[#D4AF37]">
          Đã xảy ra lỗi
        </h1>
        <p className="mt-3 max-w-md text-center text-sm text-white/60">
          Ứng dụng gặp sự cố không mong muốn. Bạn có thể thử tải lại trang.
        </p>
        {process.env.NODE_ENV === "development" && error.message ? (
          <pre className="mt-6 max-h-40 max-w-full overflow-auto rounded-lg border border-white/10 bg-black/40 p-3 text-left text-xs text-red-300">
            {error.message}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-xl bg-[#00FF85] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-95"
        >
          Thử lại
        </button>
      </body>
    </html>
  );
}
