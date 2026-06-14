import { createContext, useState, useContext, useEffect } from 'react';

var AuthContext = createContext(null);

function AuthProvider({ children }) {
  var [user, setUser] = useState(null);

  // On mount, restore session from localStorage
  useEffect(function () {
    try {
      var stored = localStorage.getItem('hotelHub_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      localStorage.removeItem('hotelHub_user');
    }
  }, []);

  function login(userData) {
    var sessionData = {
      guestId: userData.id,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role || 'USER',
    };
    setUser(sessionData);
    localStorage.setItem('hotelHub_user', JSON.stringify(sessionData));
  }

  function logout() {
    setUser(null);
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
