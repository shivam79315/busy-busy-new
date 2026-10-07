import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHeroSlide,
  deleteHeroSlide,
  fetchAllHeroSlides,
  reorderHeroSlides,
  updateHeroSlide,
} from "@/api/hero";

export function useAdminHeroSlides() {
  return useQuery({
    queryKey: ["admin-hero-slides"],
    queryFn: fetchAllHeroSlides,
  });
}

const invalidateHeroQueries = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["admin-hero-slides"] });
  queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
};

export function useCreateHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHeroSlide,
    onSuccess: () => invalidateHeroQueries(queryClient),
  });
}

export function useUpdateHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateHeroSlide(id, data),
    onSuccess: () => invalidateHeroQueries(queryClient),
  });
}

export function useDeleteHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHeroSlide,
    onSuccess: () => invalidateHeroQueries(queryClient),
  });
}

export function useReorderHeroSlides() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderHeroSlides,
    onSuccess: () => invalidateHeroQueries(queryClient),
  });
}
