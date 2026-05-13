import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlayerById } from "@/services/player-service";
import { PlayerDetailHero } from "@/components/features/players/player-detail-hero";
import { PlayerStatsRadar } from "@/components/features/players/player-stats-radar";
import { PlayerTraitsList } from "@/components/features/players/player-traits-list";
import { PlayerPriceTable } from "@/components/features/players/player-price-table";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate Metadata for SEO & Open Graph (Social Sharing)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    if (!Number.isFinite(id)) {
      return { title: "Player Not Found | FCO Hub" };
    }

    const player = await getPlayerById(id);

    if (!player) return { title: "Player Not Found | FCO Hub" };

    return {
      title: `${player.playerName} ${player.seasonCode} | FCO Hub`,
      description: `Xem chi tiết chỉ số, giá thị trường và các thẻ phụ của ${player.playerName} mùa ${player.seasonCode} với OVR ${player.ovr}.`,
      openGraph: {
        title: `${player.playerName} ${player.seasonCode} | FCO Hub`,
        description: `OVR: ${player.ovr} - Vị trí: ${player.preferredPosition} - Giá: ${player.marketPriceBp ? new Intl.NumberFormat("vi-VN").format(player.marketPriceBp) + " BP" : "N/A"}`,
        images: [
          {
            url: player.imageUrl || "https://fcohub.com/default-og.png",
            width: 800,
            height: 600,
            alt: player.playerName,
          },
        ],
      },
    };
  } catch (error) {
    return { title: "Error | FCO Hub" };
  }
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (!Number.isFinite(id)) return notFound();

  let player;
  try {
    player = await getPlayerById(id);
  } catch (error) {
    return notFound();
  }

  if (!player) return notFound();

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      {/* Back button or Breadcrumb could go here */}

      {/* 1. Hero Section */}
      <PlayerDetailHero player={player} />

      {/* 2. Content Grid */}
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        
        {/* Left Column (Stats & Traits) */}
        <div className="flex w-full flex-col gap-8 lg:w-1/3">
          <PlayerStatsRadar player={player} />
          <PlayerTraitsList traits={player.traits} />
        </div>

          {/* Right Column (Prices) */}
        <div className="w-full lg:w-2/3">
          <PlayerPriceTable prices={player.prices} />
          
          {/* OVR By Pos */}
          {player.ovrByPosJson && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
               <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/70">
                 Chỉ số theo vị trí (OVR by Pos)
               </h3>
               <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                 {Object.entries(JSON.parse(player.ovrByPosJson) as Record<string, number>).map(([pos, ovr]) => (
                   <div key={pos} className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-2 transition-colors hover:bg-white/10">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{pos}</span>
                     <span className="font-mono text-lg font-semibold text-[#00FF85]">{ovr}</span>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
