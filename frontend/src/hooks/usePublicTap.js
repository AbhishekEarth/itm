import { useQuery } from '@tanstack/react-query';
import { publicPlacementsApi } from '../api/placements';

export function usePublicRecruiters() {
  return useQuery({
    queryKey: ['public-recruiters'],
    queryFn: () => publicPlacementsApi.recruiters(),
    staleTime: 5 * 60_000,
  });
}

export function usePublicTap() {
  return useQuery({
    queryKey: ['public-tap'],
    queryFn: () => publicPlacementsApi.tap(),
    staleTime: 60_000,
  });
}
