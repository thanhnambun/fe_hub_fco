import Link from "next/link";

const QUICK_LINKS = [
  { label: "Cầu thủ", href: "/players" },
  { label: "Đội hình", href: "/squad-builder" },
  { label: "Đánh giá", href: "/reviews" },
  { label: "Thị trường", href: "/marketplace" },
];

const LEGAL_SUPPORT_LINKS = [
  { label: "Điều khoản sử dụng", href: "/terms" },
  { label: "Chính sách bảo mật", href: "/privacy" },
  { label: "Trung tâm hỗ trợ", href: "/support" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#070B14]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <section className="space-y-3">
          <Link
            href="/"
            className="font-[var(--font-oswald)] text-xl tracking-[0.14em] text-[#00FF85]"
          >
            FCO HUB
          </Link>
          <p className="max-w-xs text-sm text-white/65">Hệ sinh thái FC Online toàn diện</p>
        </section>

        <section className="space-y-3">
          <h3 className="font-[var(--font-oswald)] text-sm uppercase tracking-[0.18em] text-white/90">
            Liên kết nhanh
          </h3>
          <nav className="flex flex-col gap-2">
            {QUICK_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 transition hover:text-[#00FF85]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        <section className="space-y-3">
          <h3 className="font-[var(--font-oswald)] text-sm uppercase tracking-[0.18em] text-white/90">
            Pháp lý & Hỗ trợ
          </h3>
          <nav className="flex flex-col gap-2">
            {LEGAL_SUPPORT_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 transition hover:text-[#00FF85]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </footer>
  );
}
