import { createContext, useState, useContext, useEffect } from 'react';
import { getUserFromToken, isTokenExpired } from '../api/jwtUtils';

var AuthContext = createContext(null);

function AuthProvider({ children }) {
  var [user, setUser] = useState(null);

  // On mount, restore session from the stored JWT token
  useEffect(function () {
    try {
      var token = localStorage.getItem('hotelHub_token');
      if (token && !isTokenExpired(token)) {
        var userData = getUserFromToken(token);
        if (userData) {
          setUser(userData);
        }
      } else if (token) {
        // Token exists but is expired — clean up
        localStorage.removeItem('hotelHub_token');
        localStorage.removeItem('hotelHub_user');
      }
    } catch (e) {
      localStorage.removeItem('hotelHub_token');
      localStorage.removeItem('hotelHub_user');
    }
  }, []);

  /**
   * Called after successful login/register.
   * Stores the JWT token and decodes it to populate user state.
   *
   * @param {string} token - The JWT token from the auth-service
   */
  function login(token) {
    localStorage.setItem('hotelHub_token', token);

    var userData = getUserFromToken(token);
    if (userData) {
      setUser(userData);
      // Also store user data for quick access (non-sensitive)
      localStorage.setItem('hotelHub_user', JSON.stringify(userData));
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('hotelHub_token');
    localStorage.removeItem('hotelHub_user');
  }

  return (
    <AuthContext.Provider value={{ user: user, login: login, logout: logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  var context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
export default AuthContext;
