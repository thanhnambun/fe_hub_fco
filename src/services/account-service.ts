import { apiClient } from "@/services/api-client";
import type { Account } from "@/types/account";

const fallbackAccounts: Account[] = [
  {
    id: "acc-001",
    ownerName: "Legend Builder",
    server: "VN-01",
    valueBp: 4_750_000_000,
    rank: "Super Champion",
    highlightPlayer: {
      id: 1,
      name: "K. Mbappe",
      team: "Real Madrid",
      position: "ST",
      rating: 123,
      priceBp: 1_320_000_000,
      avatarUrl:
        "https://images.unsplash.com/photo-1570498839593-e565b39455fc?auto=format&fit=crop&w=900&q=80",
    },
  },
];

export async function getFeaturedAccounts(): Promise<Account[]> {
  try {
    const response = await apiClient.get<Account[]>("/api/v1/accounts/featured");
     
     return response.data;
  } catch {
    return fallbackAccounts;
  }
}
