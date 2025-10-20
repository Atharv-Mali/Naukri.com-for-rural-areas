import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType, UserProfile, ProviderProfile } from '../types';
import * as db from '../utils/db';

interface AuthContextType {
  currentUser: User | null;
  userType: UserType | null;
  userProfile: UserProfile | null;
  providerProfile: ProviderProfile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  signup: (username: string, password: string, userType: UserType) => Promise<User | null>;
  logout: () => void;
  updateProfile: (profile: UserProfile | ProviderProfile) => void;
  getProviderProfileByUsername: (username: string) => Promise<ProviderProfile | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      setIsLoading(true);
      try {
        await db.initDB();
        const savedUsername = sessionStorage.getItem('currentUser');
        if (savedUsername) {
          const user = await db.getUser(savedUsername);
          if (user) {
            await loadUserSession(user);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedInUser();
  }, []);
  
  const loadUserSession = async (user: User) => {
     setCurrentUser(user);
     setUserType(user.userType);
     if (user.userType === 'seeker') {
        const profile = await db.getSeekerProfile(user.username);
        setUserProfile(profile || null);
     } else {
        const profile = await db.getProviderProfile(user.username);
        setProviderProfile(profile || null);
     }
     sessionStorage.setItem('currentUser', user.username);
  }

  const login = async (username: string, password: string): Promise<User | null> => {
    const user = await db.getUser(username);
    if (user && user.password === password) {
      await loadUserSession(user);
      return user;
    }
    alert('Invalid username or password.');
    return null;
  };

  const signup = async (username: string, password: string, type: UserType): Promise<User | null> => {
     const existingUser = await db.getUser(username);
     if (existingUser) {
        alert('Username already exists.');
        return null;
     }
     
     const newUser: User = { username, password, userType: type };
     await db.addUser(newUser);
     
     if (type === 'seeker') {
        const newProfile: UserProfile = { username, name: username, email: '', phone: '', description: '', skills: [], profilePicture: '' };
        await db.addSeekerProfile(newProfile);
     } else {
        const newProfile: ProviderProfile = { username, name: username, email: '', phone: '', company: '', profilePicture: '' };
        await db.addProviderProfile(newProfile);
     }

     await loadUserSession(newUser);
     return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    setUserProfile(null);
    setProviderProfile(null);
    sessionStorage.removeItem('currentUser');
  };
  
  const updateProfile = async (profile: UserProfile | ProviderProfile) => {
    if (currentUser) {
        if (userType === 'seeker' && 'skills' in profile) {
            await db.updateSeekerProfile(profile as UserProfile);
            setUserProfile(profile as UserProfile);
        } else if (userType === 'provider' && 'company' in profile) {
            await db.updateProviderProfile(profile as ProviderProfile);
            setProviderProfile(profile as ProviderProfile);
        }
    }
  };
  
  const getProviderProfileByUsername = async (username: string): Promise<ProviderProfile | null> => {
      return db.getProviderProfile(username).then(profile => profile || null);
  }


  const value = {
    currentUser,
    userType,
    userProfile,
    providerProfile,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    getProviderProfileByUsername
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
