/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    let isMounted = true;

    const setupAuth = async () => {
      try {
        const { getAuthInstance } = await import('../utils/firebase');
        const auth = await getAuthInstance();
        const { onAuthStateChanged } = await import('firebase/auth');
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (isMounted) {
            setUser(currentUser);
            setAuthLoading(false);
          }
        });
      } catch (error) {
        console.error('Ошибка при инициализации auth:', error);
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    setupAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
