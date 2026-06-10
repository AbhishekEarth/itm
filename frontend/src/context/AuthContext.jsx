import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clearAuth, getStoredAuth, storeAuth } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());

  const login = useCallback((tokenPayload) => {
    // Accepts either the full TokenResponse OR the legacy {access_token, role, user}
    const payload = {
      access_token: tokenPayload.access_token,
      refresh_token: tokenPayload.refresh_token ?? null,
      role: tokenPayload.role,
      user: tokenPayload.user ?? null,
      scopes: tokenPayload.scopes ?? [],
    };
    storeAuth(payload);
    setAuth({
      token: payload.access_token,
      refresh: payload.refresh_token,
      role: payload.role,
      user: payload.user,
      scopes: payload.scopes,
    });
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth({ token: null, refresh: null, role: null, user: null, scopes: [] });
  }, []);

  const hasScope = useCallback(
    (...scopes) => {
      if (auth.role === 'super_admin' || auth.role === 'admin') return true;
      if (!scopes.length) return false;
      const owned = new Set(auth.scopes || []);
      return scopes.some((s) => owned.has(s));
    },
    [auth.role, auth.scopes]
  );

  const value = useMemo(
    () => ({
      token: auth.token,
      refresh: auth.refresh,
      role: auth.role,
      user: auth.user,
      scopes: auth.scopes || [],
      login,
      logout,
      hasScope,
      isLoggedIn: !!auth.token,
      isAdmin: auth.role === 'super_admin' || auth.role === 'admin',
      isSuperAdmin: auth.role === 'super_admin',
      isEditor: auth.role === 'editor',
      isStudent: auth.role === 'student',
      isFaculty: auth.role === 'faculty',
    }),
    [auth, login, logout, hasScope]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
