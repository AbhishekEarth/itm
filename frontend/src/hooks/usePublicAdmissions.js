import { useQuery } from '@tanstack/react-query';
import { publicAdmissionsApi } from '../api/admissions';

export function usePublicAdmissions() {
  return useQuery({
    queryKey: ['public-admissions'],
    queryFn: publicAdmissionsApi.bundle,
    staleTime: 5 * 60_000,
  });
}

export function usePublicPositions(params = {}) {
  return useQuery({
    queryKey: ['public-positions', params],
    queryFn: () => publicAdmissionsApi.positions(params),
    staleTime: 60_000,
  });
}

export function usePublicJrf() {
  return useQuery({
    queryKey: ['public-jrf'],
    queryFn: publicAdmissionsApi.jrf,
    staleTime: 60_000,
  });
}
