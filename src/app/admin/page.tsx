import { Crown, BarChart3, Users, ShoppingBag, Settings } from "lucide-react";
import Link from "next/link";

const ADMIN_MODULES = [
  {
    title: "Quản lý người dùng",
    description: "Xem, khoá/mở khoá tài khoản người dùng.",
    href: "/admin/users",
    icon: Users,
    color: "text-[#00FF85]",
    border: "border-[#00FF85]/20",
    bg: "bg-[#00FF85]/5",
  },
  {
    title: "Quản lý cầu thủ",
    description: "Thêm, sửa, xoá dữ liệu cầu thủ và mùa giải.",
    href: "/admin/players",
    icon: BarChart3,
    color: "text-[#D4AF37]",
    border: "border-[#D4AF37]/20",
    bg: "bg-[#D4AF37]/5",
  },
  {
    title: "Quản lý đơn hàng",
    description: "Theo dõi và xử lý các giao dịch trên hệ thống.",
    href: "/admin/orders",
    icon: ShoppingBag,
    color: "text-purple-400",
    border: "border-purple-400/20",
    bg: "bg-purple-400/5",
  },
  {
    title: "Cài đặt hệ thống",
    description: "Cấu hình chung của FCO HUB platform.",
    href: "/admin/settings",
    icon: Settings,
    color: "text-sky-400",
    border: "border-sky-400/20",
    bg: "bg-sky-400/5",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
          <Crown size={26} />
        </div>
        <div>
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-wider text-white">
            ADMIN PORTAL
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Bảng điều khiển quản trị hệ thống FCO HUB
          </p>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {ADMIN_MODULES.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className={`group flex items-start gap-4 rounded-2xl border ${mod.border} ${mod.bg} p-6 transition-all hover:brightness-125`}
          >
            <div className={`mt-0.5 shrink-0 ${mod.color}`}>
              <mod.icon size={24} />
            </div>
            <div>
              <p className={`font-semibold ${mod.color}`}>{mod.title}</p>
              <p className="mt-1 text-sm text-white/50">{mod.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
