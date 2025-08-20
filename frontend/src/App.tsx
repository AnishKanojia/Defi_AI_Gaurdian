import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { io } from 'socket.io-client';

// Contexts
import { AuthProvider } from './context/AuthContext.tsx';
import { AlertContext } from './context/AlertContext.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { WalletProvider } from './context/WalletContext.tsx';

// Components
import Header from './components/Header.tsx';
import ChatbotFab from './components/ChatbotFab.tsx';

// Pages
import Dashboard from './pages/Dashboard.tsx';
import RiskDashboard from './pages/RiskDashboard.tsx';
import Contracts from './pages/Contracts.tsx';
import Wallet from './pages/Wallet.tsx';
import Markets from './pages/Markets.tsx';
import SecurityCenter from './pages/SecurityCenter.tsx';
import FeaturePage from './pages/Feature.tsx';
import SignIn from './pages/SignIn.tsx';
import Settings from './pages/Settings.tsx';
import Alerts from './pages/Alerts.tsx';
import Analytics from './pages/Analytics.tsx';
import Landing from './pages/Landing.tsx';

// Theme
import { theme } from './theme/theme.ts';

// Config
import { API_BASE } from './config.ts';

// Socket.IO connection
const socket = io(API_BASE);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // Temporarily bypass authentication for testing
      setIsAuthenticated(true);
      setIsLoading(false);
      
      // Original code (commented out for testing):
      // const user = localStorage.getItem('user');
      // setIsAuthenticated(!!user);
      // setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: '#0A0A0A',
          color: '#FFFFFF'
        }}>
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SettingsProvider>
          <AlertContext.Provider value={{ alerts: [], addAlert: () => {}, clearAlerts: () => {} }}>
            <WalletProvider>
              <div className="App">
                {isAuthenticated ? (
                  <>
                    <Header />
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/risk" element={<RiskDashboard />} />
                      <Route path="/contracts" element={<Contracts />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/markets" element={<Markets />} />
                      <Route path="/security" element={<SecurityCenter />} />
                      <Route path="/feature/:slug" element={<FeaturePage />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/alerts" element={<Alerts />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <ChatbotFab />
                  </>
                ) : (
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                )}
              </div>
            </WalletProvider>
          </AlertContext.Provider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
