import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

function loadState() {
  try {
    return {
      token: localStorage.getItem('itm_token'),
      role: localStorage.getItem('itm_role'),
      user: JSON.parse(localStorage.getItem('itm_user') || 'null'),
    };
  } catch {
    return { token: null, role: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadState);

  const login = useCallback((token, role, user = null) => {
    localStorage.setItem('itm_token', token);
    localStorage.setItem('itm_role', role);
    localStorage.setItem('itm_user', JSON.stringify(user));
    // keep legacy key so existing admin protected routes still work
    if (role === 'admin') localStorage.setItem('itm_admin_token', token);
    setAuth({ token, role, user });
  }, []);

  const logout = useCallback(() => {
    ['itm_token', 'itm_role', 'itm_user', 'itm_admin_token'].forEach(k => localStorage.removeItem(k));
    setAuth({ token: null, role: null, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{
      token: auth.token,
      role: auth.role,
      user: auth.user,
      login,
      logout,
      isAdmin: auth.role === 'admin' && !!auth.token,
      isStudent: auth.role === 'student' && !!auth.token,
      isFaculty: auth.role === 'faculty' && !!auth.token,
      isLoggedIn: !!auth.token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
