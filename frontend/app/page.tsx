"use client";

import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import MainDashboard from '../components/MainDashboard';

export default function App() {
  // Global state to manage authentication status and role
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('USER'); // 'USER', 'AGENT', 'ADMIN'
  const [authToken, setAuthToken] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Optionally check if token is already in localStorage on reload
    const token = localStorage.getItem('token');
    if (token) {
      // Logic to auto-login if token is valid goes here
      // For now we just stay logged out and force login
    }
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div className="min-h-screen bg-[#fdfbf7]" />;
  }

  const handleLogin = (role: string, token: string) => {
    setUserRole(role);
    setAuthToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken('');
    setUserRole('USER');
    setIsLoggedIn(false);
  };

  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <MainDashboard userRole={userRole} onLogout={handleLogout} />
      )}
    </>
  );
}
