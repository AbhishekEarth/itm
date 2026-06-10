import { useQuery } from '@tanstack/react-query';
import { publicDeptApi } from '../api/departments';

/**
 * Live list of all departments — used by the homepage Departments grid so the
 * "240 seats", "120 seats" etc. tiles read from `dept.intake` in the database
 * and stay in sync with whatever the admin saves on /admin/departments.
 */
export function usePublicDepartments() {
  return useQuery({
    queryKey: ['public-departments'],
    queryFn: () => publicDeptApi.list(),
    staleTime: 60_000,
  });
}
