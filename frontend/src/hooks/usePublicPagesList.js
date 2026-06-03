import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/cms';

/**
 * Lightweight list of every published admin-created page. The Header
 * dropdowns use this to inject custom pages into the matching menu by
 * URL-prefix (e.g. /about/leadership → About menu).
 */
export function usePublicPagesList() {
  return useQuery({
    queryKey: ['public-pages-list'],
    queryFn: () => publicApi.pages(),
    staleTime: 60_000,
  });
}
