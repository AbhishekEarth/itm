import { useQuery } from '@tanstack/react-query';
import { publicDeptApi } from '../api/departments';

export function usePublicDepartment(code) {
  return useQuery({
    queryKey: ['public-department', code],
    queryFn: () => publicDeptApi.get(code),
    enabled: !!code,
    staleTime: 60_000,
  });
}
