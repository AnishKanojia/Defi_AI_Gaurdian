import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, googleProvider } from '../firebase.ts';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  User,
} from 'firebase/auth';

export interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultValue: AuthContextValue = {
  currentUser: null,
  loading: true,
  signInWithGoogle: async () => undefined,
  signInWithEmail: async () => undefined,
  signUpWithEmail: async () => undefined,
  signOut: async () => undefined,
};

const AuthContext = createContext<AuthContextValue>(defaultValue);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    loading,
    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err: any) {
        const code = err?.code as string | undefined;
        if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') {
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        throw err;
      }
    },
    async signInWithEmail(email: string, password: string) {
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signUpWithEmail(email: string, password: string) {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    async signOut() {
      await firebaseSignOut(auth);
    },
  }), [currentUser, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
