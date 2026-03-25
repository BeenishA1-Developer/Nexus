import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Joyride } from 'react-joyride';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Run tour only once per session when logging in successfully and landing on dashboard
    if (isAuthenticated && !sessionStorage.getItem('tourCompleted') && (location.pathname === '/dashboard/entrepreneur' || location.pathname === '/dashboard/investor')) {
      setRunTour(true);
    }
  }, [isAuthenticated, location]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      setRunTour(false);
      sessionStorage.setItem('tourCompleted', 'true');
    }
  };

  const steps: any[] = [
    {
      target: '.tour-dashboard-link',
      content: 'Welcome to Business Nexus! This is your hub to track startup and investor activity.',
      disableBeacon: true,
    },
    {
      target: '.tour-wallet-link',
      content: 'Here you can explore our new Payment Section: manage funds, withdraw, and seamlessly transfer funding for your deals!',
    },
    {
      target: 'body',
      content: 'You can also check out the new Video Calling and Document Chamber features in the sidebar. Let\'s get building!',
      placement: 'center',
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {React.createElement(Joyride as any, {
        steps,
        run: runTour,
        continuous: true,
        showSkipButton: true,
        showProgress: true,
        callback: handleJoyrideCallback,
        styles: {
          options: {
            primaryColor: '#2563EB',
            zIndex: 10000,
          }
        }
      })}
      
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};