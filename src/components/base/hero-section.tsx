export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-hero-radial px-6 py-12 shadow-deep md:px-10">
      <div className="max-w-3xl">
        <p className="fco-heading text-xs uppercase tracking-[0.2em] text-fco-gold">FCO HUB PLATFORM</p>
        <h1 className="fco-heading mt-4 text-4xl font-extrabold leading-tight text-fco-green drop-shadow-[0_0_26px_rgba(0,255,133,0.38)] md:text-6xl">
          HỆ SINH THÁI FC ONLINE TOÀN DIỆN
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">
          Quản lý tài khoản, phân tích cầu thủ, và tối ưu đội hình trong một dashboard duy nhất.
        </p>
      </div>
    </section>
  );
}
