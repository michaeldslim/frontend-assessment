'use client';

import { useEffect, useState } from "react";
import { IOp, IOpsResult } from "@/types";

const OPS_API_URL = 
  process.env.NEXT_PUBLIC_OPS_API_URL ??
  "https://frontend-challenge.veryableops.com/";

export function useOps(): IOpsResult {
  const [ops, setOps] = useState<IOp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOps = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(OPS_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch ops");
        }

        const data = await response.json() as IOp[];
        setOps(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error fetching ddata");
      } finally {
        setLoading(false);
      }
    };

    fetchOps();
  }, []);

  return { ops, loading, error };
};
