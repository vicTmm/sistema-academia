import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_PROFILES } from '../services/mockData';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: UserProfile;
  profiles: UserProfile[];
  setCurrentUser: (user: UserProfile) => void;
  switchUserById: (id: string) => void;
  isAdmin: boolean;
  isTeacher: boolean;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  // Padrão: Carlos Silva (Admin Geral & Financeiro)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('acqua_planet_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_PROFILES[0];
  });

  useEffect(() => {
    api.getProfiles().then(res => {
      if (res && res.length > 0) {
        setProfiles(res);
      }
    }).catch(() => {
      // mantém initial
    });
  }, []);

  const switchUserById = (id: string) => {
    const found = profiles.find(p => p.id === id);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('acqua_planet_user', JSON.stringify(found));
    }
  };

  const isAdmin = currentUser.role === 'admin';
  const isTeacher = currentUser.role === 'teacher';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profiles,
        setCurrentUser,
        switchUserById,
        isAdmin,
        isTeacher,
        role: currentUser.role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
};
