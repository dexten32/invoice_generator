import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:4000/api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  // On mount, validate existing token with /me endpoint
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token invalid or expired
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('[Auth] Failed to validate token:', err);
        // If backend is unreachable, keep token but clear user to be safe
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  /**
   * Login: calls /login, stores token, sets user.
   * Returns { success, message }
   */
  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('auth_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed.' };
      }
    } catch (err) {
      console.error('[Auth] Login error:', err);
      return { success: false, message: 'Cannot connect to server. Please ensure the backend is running.' };
    }
  }, []);

  /**
   * Logout: clears token from storage and state.
   */
  const logout = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        await fetch(`${API_BASE}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      }
    } catch (err) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
