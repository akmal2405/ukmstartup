import { useState, useEffect, useMemo } from "react";
import { Idea } from "../types";

export function useIdeas(query: string, activeCat: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas`);
        const data: Idea[] = await res.json();
        setIdeas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const filtered = useMemo(() => {
    return ideas.filter((i) => {
      const matchCat = activeCat === "Semua" || i.category === activeCat;
      const q = query.trim().toLowerCase();
      return matchCat && (!q ||
        i.startupName?.toLowerCase().includes(q) ||
        i.ownerName?.toLowerCase().includes(q) ||
        i.shortDescription?.toLowerCase().includes(q)
      );
    });
  }, [ideas, query, activeCat]);

  return { filtered, loading };
}