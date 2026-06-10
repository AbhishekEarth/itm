import { useQuery } from '@tanstack/react-query';
import { publicEventsApi } from '../api/events';

export function usePublicEvents(params = {}) {
  return useQuery({
    queryKey: ['public-events', params],
    queryFn: () => publicEventsApi.events(params),
    staleTime: 60_000,
  });
}

export function usePublicNotices() {
  return useQuery({
    queryKey: ['public-notices'],
    queryFn: publicEventsApi.notices,
    staleTime: 60_000,
  });
}

export function usePublicGallery() {
  return useQuery({
    queryKey: ['public-gallery'],
    queryFn: publicEventsApi.gallery,
    staleTime: 5 * 60_000,
  });
}

export function usePublicGalleryCategory(slug) {
  return useQuery({
    queryKey: ['public-gallery', slug],
    queryFn: () => publicEventsApi.galleryCategory(slug),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  });
}

export function usePublicClubs(params = {}) {
  return useQuery({
    queryKey: ['public-clubs', params],
    queryFn: () => publicEventsApi.clubs(params),
    staleTime: 5 * 60_000,
  });
}

export function usePublicWhatsNew(params = {}) {
  return useQuery({
    queryKey: ['public-whats-new', params],
    queryFn: () => publicEventsApi.whatsNew(params),
    staleTime: 60_000,
  });
}
