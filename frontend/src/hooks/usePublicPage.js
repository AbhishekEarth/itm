import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/cms';

export function usePublicPage(path) {
  return useQuery({
    queryKey: ['public-page', path],
    queryFn: () => publicApi.page(path),
    staleTime: 60_000,
  });
}

export function usePublicHome() {
  return useQuery({
    queryKey: ['public-page', '/'],
    queryFn: () => publicApi.home(),
    staleTime: 60_000,
  });
}

export function usePublicSettings() {
  return useQuery({
    queryKey: ['public-settings'],
    queryFn: () => publicApi.settings(),
    staleTime: 5 * 60_000,
  });
}
