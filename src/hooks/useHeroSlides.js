import { useQuery } from "@tanstack/react-query";
import { fetchActiveHeroSlides } from "@/api/hero";

export function useHeroSlides() {
  return useQuery({
    queryKey: ["hero-slides"],
    queryFn: fetchActiveHeroSlides,
  });
}
