import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserStats } from '../types';

interface UserContextType {
  userStats: UserStats;
  updateUserStats: (newStats: Partial<UserStats>) => void;
  addPoints: (points: number) => void;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
  username: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userStats, setUserStats] = useState<UserStats>({
    reportsSubmitted: 0,
    points: 0,
    badges: []
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedStats = localStorage.getItem('userStats');
    const savedAuth = localStorage.getItem('userAuth');
    
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      setIsLoggedIn(auth.isLoggedIn);
      setUsername(auth.username);
    }
  }, []);

  const updateUserStats = (newStats: Partial<UserStats>) => {
    const updatedStats = { ...userStats, ...newStats };
    setUserStats(updatedStats);
    localStorage.setItem('userStats', JSON.stringify(updatedStats));
  };

  const addPoints = (points: number) => {
    const newPoints = userStats.points + points;
    const newBadges = [...userStats.badges];
    
    // Award badges based on points
    if (newPoints >= 50 && !newBadges.includes('Traffic Hero')) {
      newBadges.push('Traffic Hero');
    }
    if (newPoints >= 100 && !newBadges.includes('Road Guardian')) {
      newBadges.push('Road Guardian');
    }
    if (newPoints >= 200 && !newBadges.includes('Safety Champion')) {
      newBadges.push('Safety Champion');
    }
    
    updateUserStats({ 
      points: newPoints, 
      badges: newBadges,
      reportsSubmitted: userStats.reportsSubmitted + 1 
    });
  };

  const login = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem('userAuth', JSON.stringify({ isLoggedIn: true, username: user }));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('userAuth');
  };

  return (
    <UserContext.Provider value={{
      userStats,
      updateUserStats,
      addPoints,
      isLoggedIn,
      login,
      logout,
      username
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}