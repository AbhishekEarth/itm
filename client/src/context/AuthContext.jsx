import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('itm_admin_token'));

  const login = useCallback((t) => {
    setToken(t);
    localStorage.setItem('itm_admin_token', t);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('itm_admin_token');
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAdmin: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
