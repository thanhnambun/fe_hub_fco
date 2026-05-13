import { useEffect, useState } from "react";

import { getFeaturedAccounts } from "@/services/account-service";
import type { Account } from "@/types/account";

export function useFeaturedAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getFeaturedAccounts()
      .then((data) => {
        if (mounted) {
          setAccounts(data);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { accounts, loading };
}
