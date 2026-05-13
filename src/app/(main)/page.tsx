import { FeatureGrid } from "@/components/base/feature-grid";
import { HeroSection } from "@/components/base/hero-section";
import { PlayerSection } from "@/components/base/player-section";


export default function Home() {
  return (
    <main className="min-h-screen bg-fco-navy text-white">


      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 md:py-10">
        <HeroSection />
        <FeatureGrid />
        <PlayerSection />

        <section className="grid gap-5 lg:grid-cols-1">
          <div className="glass rounded-3xl p-6 shadow-deep">
            <h2 className="fco-heading text-2xl font-semibold text-fco-gold">Trung tâm tài khoản</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
              Khám phá tài khoản giá trị cao, có đội hình cạnh tranh và khả năng đầu tư an toàn.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-fco-surface/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">Tổng số tài khoản</p>
                <p className="mt-2 text-3xl font-bold text-fco-green">1,245</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-fco-surface/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">BP trung bình</p>
                <p className="mt-2 text-3xl font-bold text-fco-gold">3.2B</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
