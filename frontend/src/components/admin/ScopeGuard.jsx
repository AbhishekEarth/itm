import { useAuth } from '../../context/AuthContext';

/**
 * Renders children only if the current user has ANY of the given scopes.
 * Super-admins always pass.
 *
 *   <ScopeGuard scopes={['dept.cse']}>...editor pencil...</ScopeGuard>
 */
export default function ScopeGuard({ scopes = [], fallback = null, children }) {
  const { hasScope, isLoggedIn } = useAuth();
  if (!isLoggedIn) return fallback;
  if (!scopes.length) return children;
  return hasScope(...scopes) ? children : fallback;
}
