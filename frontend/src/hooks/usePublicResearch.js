import { useQuery } from '@tanstack/react-query';
import { publicResearchApi } from '../api/research';

export function usePublicRDCell() {
  return useQuery({ queryKey: ['public-research-rdcell'], queryFn: publicResearchApi.rdcell, staleTime: 5 * 60_000 });
}
export function usePublicJournal() {
  return useQuery({ queryKey: ['public-research-journal'], queryFn: publicResearchApi.journal, staleTime: 5 * 60_000 });
}
export function usePublicConferences() {
  return useQuery({ queryKey: ['public-research-conferences'], queryFn: publicResearchApi.conferences, staleTime: 5 * 60_000 });
}
export function usePublicFdps() {
  return useQuery({ queryKey: ['public-research-fdps'], queryFn: publicResearchApi.fdps, staleTime: 5 * 60_000 });
}
