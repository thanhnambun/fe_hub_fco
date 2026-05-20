import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlayerById } from "@/services/player-service";
import { PlayerDetailContainer } from "@/components/features/players/player-detail-container";

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
  } catch {
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
  } catch {
    return notFound();
  }

  if (!player) return notFound();

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <PlayerDetailContainer player={player} />
    </main>
  );
}
